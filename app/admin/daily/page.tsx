"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type DailyMessage = {
  id: string;
  text: string;
  audio_url: string | null;
  publish_at: string;
  published: boolean;
  created_at: string;
};

function AudioPlayer({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  }

  return (
    <div className="flex items-center gap-2">
      <audio ref={ref} src={url} onEnded={() => setPlaying(false)} />
      <button onClick={toggle}
              className="text-[.72rem] px-3 py-1.5 rounded-lg font-sans border transition-all
                         border-gold/30 text-gold/80 hover:bg-gold/10">
        {playing ? "⏸ Pause" : "▶ Écouter"}
      </button>
    </div>
  );
}

function timeStr(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isLive(msg: DailyMessage) {
  return msg.published && new Date(msg.publish_at) <= new Date();
}

export default function AdminDailyPage() {
  const [messages,   setMessages]   = useState<DailyMessage[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [enabled,    setEnabled]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);

  // Formulaire
  const [text,        setText]       = useState("");
  const [audioFile,   setAudioFile]  = useState<File | null>(null);
  const [publishAt,   setPublishAt]  = useState("");
  const [publishNow,  setPublishNow] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sb = createClient();

  // ── Chargement ───────────────────────────────────────────────────────────

  async function load() {
    const [{ data: msgs }, { data: setting }] = await Promise.all([
      sb.from("daily_messages").select("*").order("publish_at", { ascending: false }),
      sb.from("app_settings").select("value").eq("key", "daily_message_enabled").single(),
    ]);
    setMessages((msgs ?? []) as DailyMessage[]);
    setEnabled(setting?.value !== "false");
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  // ── Activer / désactiver la section ──────────────────────────────────────

  async function toggleSection() {
    const next = !enabled;
    setEnabled(next);
    await sb.from("app_settings")
      .upsert({ key: "daily_message_enabled", value: next ? "true" : "false" });
  }

  // ── Reset formulaire ─────────────────────────────────────────────────────

  function resetForm() {
    setText(""); setAudioFile(null); setPublishAt(""); setPublishNow(false);
    setEditingId(null); setShowForm(false);
  }

  function startEdit(msg: DailyMessage) {
    setEditingId(msg.id);
    setText(msg.text);
    // Format datetime-local value
    const d = new Date(msg.publish_at);
    const pad = (n: number) => String(n).padStart(2, "0");
    setPublishAt(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    setPublishNow(msg.published);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Sauvegarder (nouveau ou modification) ────────────────────────────────

  async function handleSave() {
    if (!text.trim()) return;
    setSaving(true);

    let audioUrl: string | null = null;

    // Upload audio si nouveau fichier
    if (audioFile) {
      const ext      = audioFile.name.split(".").pop();
      const path     = `${Date.now()}.${ext}`;
      const { data: upData, error: upErr } = await sb.storage
        .from("daily-audio")
        .upload(path, audioFile, { upsert: true });

      if (!upErr && upData) {
        const { data: urlData } = sb.storage.from("daily-audio").getPublicUrl(upData.path);
        audioUrl = urlData.publicUrl;
      }
    }

    const payload: Partial<DailyMessage> & { text: string; publish_at: string; published: boolean } = {
      text:       text.trim(),
      publish_at: publishNow ? new Date().toISOString() : (publishAt ? new Date(publishAt).toISOString() : new Date().toISOString()),
      published:  publishNow,
      ...(audioUrl !== null ? { audio_url: audioUrl } : {}),
    };

    if (editingId) {
      await sb.from("daily_messages").update(payload).eq("id", editingId);
    } else {
      const { data: { user } } = await sb.auth.getUser();
      await sb.from("daily_messages").insert({ ...payload, created_by: user?.id });
    }

    resetForm();
    await load();
    setSaving(false);
  }

  // ── Publier / dépublier ───────────────────────────────────────────────────

  async function togglePublish(msg: DailyMessage) {
    const nowPublishing = !msg.published;
    const update: Partial<DailyMessage> & { published: boolean } = { published: nowPublishing };
    // Si on publie et que publish_at est dans le futur → avance à maintenant
    if (nowPublishing && new Date(msg.publish_at) > new Date()) {
      update.publish_at = new Date().toISOString();
    }
    await sb.from("daily_messages").update(update).eq("id", msg.id);
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, ...update } : m));
  }

  // ── Supprimer ─────────────────────────────────────────────────────────────

  async function handleDelete(msg: DailyMessage) {
    if (!confirm("Supprimer ce message ?")) return;
    if (msg.audio_url) {
      const path = msg.audio_url.split("/daily-audio/")[1];
      if (path) await sb.storage.from("daily-audio").remove([path]);
    }
    await sb.from("daily_messages").delete().eq("id", msg.id);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif font-light text-ivory text-[2rem]">Message du jour</h1>
          <p className="text-ivory/40 text-sm mt-1">
            Paroles audio et texte programmées pour les reines
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle section */}
          <button onClick={toggleSection}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[.78rem] font-sans
                              border transition-all
                              ${enabled
                                ? "bg-forest/20 border-forest/40 text-[#7ECFA0]"
                                : "bg-danger/10 border-danger/30 text-danger/70"}`}>
            {enabled ? "✓ Section activée" : "✗ Section désactivée"}
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }}
                  className="font-display text-[.7rem] tracking-[.15em] uppercase px-4 py-2.5
                             bg-gradient-to-br from-gold to-gold-l text-dark rounded-full
                             hover:-translate-y-0.5 transition-all">
            + Nouveau message
          </button>
        </div>
      </div>

      {!enabled && (
        <div className="bg-danger/10 border border-danger/20 rounded-2xl px-5 py-3 mb-6 text-sm text-danger/70 font-sans">
          ⚠ La section "Message du jour" est désactivée — les utilisateurs ne verront aucun message.
          Clique sur "Section désactivée" pour la réactiver.
        </div>
      )}

      {/* Formulaire ajout / modification */}
      {showForm && (
        <div className="bg-white/4 border border-gold/15 rounded-2xl p-6 mb-6">
          <h2 className="font-serif text-ivory text-[1.1rem] mb-5">
            {editingId ? "Modifier le message" : "Nouveau message"}
          </h2>

          {/* Texte */}
          <label className="font-display text-[.58rem] tracking-[.22em] uppercase text-gold/60 mb-2 block">
            Texte du message *
          </label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
                    placeholder="Tape le message ici… (peut être envoyé sans audio)"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5
                               text-ivory/85 font-serif text-[.95rem] outline-none
                               focus:border-gold/30 resize-none placeholder:text-ivory/20 mb-4" />

          {/* Audio */}
          <label className="font-display text-[.58rem] tracking-[.22em] uppercase text-gold/60 mb-2 block">
            Fichier audio (optionnel)
          </label>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 rounded-xl border border-white/10 text-ivory/50
                               hover:border-gold/30 hover:text-ivory/70 text-[.8rem] font-sans transition-all">
              {audioFile ? `✓ ${audioFile.name}` : "📎 Choisir un fichier audio"}
            </button>
            {audioFile && (
              <button onClick={() => setAudioFile(null)}
                      className="text-danger/50 hover:text-danger text-[.72rem] font-sans">
                Retirer
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="audio/*" className="hidden"
                 onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />

          {/* Publication */}
          <div className="flex flex-col gap-3 mb-5">
            <label className="font-display text-[.58rem] tracking-[.22em] uppercase text-gold/60 block">
              Publication
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)}
                     className="w-4 h-4 accent-gold" />
              <span className="text-[.85rem] text-ivory/70 font-sans">Publier immédiatement</span>
            </label>
            {!publishNow && (
              <div>
                <p className="text-[.75rem] text-ivory/40 mb-1.5 font-sans">Ou programmer une date/heure :</p>
                <input type="datetime-local" value={publishAt}
                       onChange={(e) => setPublishAt(e.target.value)}
                       className="px-3 py-2 rounded-lg border border-white/10 bg-white/5
                                  text-ivory/70 text-[.85rem] font-sans outline-none
                                  focus:border-gold/30 [color-scheme:dark]" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={!text.trim() || saving}
                    className="font-display text-[.7rem] tracking-[.15em] uppercase px-5 py-2.5
                               bg-gradient-to-br from-gold to-gold-l text-dark rounded-full
                               disabled:opacity-40 hover:-translate-y-0.5 transition-all">
              {saving ? "Sauvegarde…" : editingId ? "Enregistrer les modifications" : "Créer le message"}
            </button>
            <button onClick={resetForm}
                    className="px-4 py-2 text-[.8rem] text-ivory/40 hover:text-ivory/60 font-sans">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des messages */}
      {loading ? (
        <p className="text-ivory/30 animate-pulse text-sm">Chargement…</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-10 text-ivory/25 font-serif italic">
          Aucun message créé pour l'instant
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => {
            const live = isLive(msg);
            const future = msg.published && new Date(msg.publish_at) > new Date();
            return (
              <div key={msg.id}
                   className={`bg-white/4 border rounded-2xl p-5 transition-all
                               ${live    ? "border-forest/30" :
                                 future  ? "border-gold/20" :
                                           "border-white/8"}`}>
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {live && (
                    <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-forest/20 text-[#7ECFA0] font-display tracking-wider">
                      🟢 EN DIRECT
                    </span>
                  )}
                  {future && (
                    <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-display tracking-wider">
                      ⏰ PROGRAMMÉ
                    </span>
                  )}
                  {!msg.published && (
                    <span className="text-[.6rem] px-2 py-0.5 rounded-full bg-white/8 text-ivory/35 font-display">
                      BROUILLON
                    </span>
                  )}
                  <span className="text-[.65rem] text-ivory/30 font-sans ml-auto">
                    {msg.published ? "Publie le" : "Prévu le"} {timeStr(msg.publish_at)}
                  </span>
                </div>

                {/* Texte */}
                <p className="font-serif text-ivory/85 leading-relaxed mb-3">{msg.text}</p>

                {/* Audio */}
                {msg.audio_url && <AudioPlayer url={msg.audio_url} />}

                {/* Actions */}
                <div className="flex gap-3 mt-4 flex-wrap items-center border-t border-white/5 pt-3">
                  <button onClick={() => togglePublish(msg)}
                          className={`text-[.72rem] px-3 py-1.5 rounded-lg border font-sans transition-all
                                      ${msg.published
                                        ? "border-orange-500/30 text-orange-400/70 hover:bg-orange-500/10"
                                        : "border-forest/30 text-[#7ECFA0] hover:bg-forest/15"}`}>
                    {msg.published ? "Dépublier" : "Publier maintenant"}
                  </button>
                  <button onClick={() => startEdit(msg)}
                          className="text-[.72rem] px-3 py-1.5 rounded-lg border border-white/10
                                     text-ivory/50 hover:border-gold/30 hover:text-gold/70 font-sans transition-all">
                    ✏ Modifier
                  </button>
                  <button onClick={() => handleDelete(msg)}
                          className="text-[.72rem] px-3 py-1.5 rounded-lg border border-danger/20
                                     text-danger/50 hover:bg-danger/10 hover:text-danger/80 font-sans transition-all">
                    🗑 Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
