import type { ScheduleEntry } from "@/types";

export const SCHEDULE: ScheduleEntry[] = [
  { day: 0,  type: "chapter",   chap: 1, label: "Lun", icon: "👑" },
  { day: 1,  type: "chapter",   chap: 2, label: "Mar", icon: "👑" },
  { day: 2,  type: "challenge",          label: "Mer", icon: "⚔️" },
  { day: 3,  type: "chapter",   chap: 3, label: "Jeu", icon: "👑" },
  { day: 4,  type: "chapter",   chap: 4, label: "Ven", icon: "👑" },
  { day: 5,  type: "rest",               label: "Sam", icon: "🌿" },
  { day: 6,  type: "rest",               label: "Dim", icon: "🌿" },
  { day: 7,  type: "chapter",   chap: 5, label: "Lun", icon: "👑" },
  { day: 8,  type: "chapter",   chap: 6, label: "Mar", icon: "👑" },
  { day: 9,  type: "challenge",          label: "Mer", icon: "⚔️" },
  { day: 10, type: "chapter",   chap: 7, label: "Jeu", icon: "👑" },
];

export const CHAP_DAYS: Record<number, number> = { 1: 0, 2: 1, 3: 3, 4: 4, 5: 7, 6: 8, 7: 10 };

export const QUOTES = [
  "L'infidélité dans le mariage ne consiste pas seulement au fait de tromper sexuellement son partenaire… découvre la suite de cette pensée à la page 25 de ton livre.",
  "Le mariage est l'école de la mort à soi, si tu ramènes toujours tout à toi, ton mari finira par se lasser… voir plus à la page 59.",
  "Tu dois retenir une chose : ton mari peut continuer à vivre avec toi sans que tu ne sois la reine de son cœur ou de sa vie… évite cette situation en lisant le troisième chapitre de ton livre.",
  "Ton royaume ne se détruira pas si tu apprends à reconnaître les alertes et si tu es assez sage pour appliquer les clés de ce livre.",
  "Une partie de l'apprentissage du mariage consiste à trouver la meilleure façon de communiquer pour bien vivre avec ton partenaire de vie. Page 88",
  "L'aspect qui cause des discordes dans les relations est le fait de comparer sa relation à celle des autres… Mon conseil du jour : Ne compare ta relation à aucune autre.",
  "L'orgueil dit : j'ai raison. L'amour dit : nous avons besoin de paix.",
];

export const SPIRITUAL_DATA = [
  { type: "Enseignement", title: "Prière pour ton couple",        desc: "Une prière guidée de 7 jours pour intercéder pour ta relation et ouvrir un espace spirituel dans ton foyer.", time: "7 jours", tag: "Prière" },
  { type: "Méditation",   title: "La Femme de valeur, Prov. 31", desc: "Méditation musicale et lecture contemplative autour du portrait de la femme royale dans les Écritures.",       time: "25 min",  tag: "Écriture" },
  { type: "Enseignement", title: "Pardonner sans oublier",        desc: "Maman Lili explique pourquoi le pardon n'est pas l'amnésie, et comment guérir vraiment sans effacer.",           time: "18 min",  tag: "Guérison" },
  { type: "Worship",      title: "Musique pour le foyer",         desc: "Une sélection de worship en français pour créer une atmosphère spirituelle dans ta maison.",                      time: "45 min",  tag: "Musique" },
  { type: "Défi",         title: "7 jours de gratitude conjugale",desc: "Chaque jour, noter 3 choses pour lesquelles tu es reconnaissante envers ton conjoint. Observe ce qui change.",   time: "7 jours", tag: "Défi" },
  { type: "Verset",       title: "Éphésiens 5",                   desc: "Ce texte fondateur sur le mariage relu à travers les yeux de la reine, non pour soumettre, mais pour comprendre sa propre autorité.", time: "10 min", tag: "Écriture" },
];

export const FAQ_DATA = [
  { q: "Comment retrouver la complicité qu'on avait au début ?",       a: "Ma reine, la complicité ne revient pas d'elle-même. Elle se recherche, se cultive, se réinvente. Commence par un geste simple : rappelle-toi ce qui vous faisait rire au début et reproduis-le intentionnellement. La complicité est une plante, elle pousse là où tu l'arroses. Ose la légèreté ! 💛" },
  { q: "Mon mari est distant depuis quelques semaines. Que faire ?",    a: "Ma reine, la distance est souvent un appel déguisé. Avant de réagir, prie. Ensuite, crée un espace doux pour qu'il puisse parler, sans pression, sans reproche. Pose une question simple : 'Comment tu vas vraiment ?' Et écoute. Souvent, l'homme qui s'éloigne cherche à être rejoint autrement. 💛" },
  { q: "Comment prier efficacement pour mon couple ?",                  a: "Ma reine, prie avec précision. Nomme ton mari devant Dieu. Nomme les situations. Mais surtout, commence par prier pour toi : que ton cœur soit doux, ta bouche sage, et tes mains bâtisseuses. Une femme qui prie transforme d'abord ce qui est en elle, puis ce qui est autour d'elle. 💛" },
  { q: "Est-ce que l'orgueil peut vraiment détruire un mariage ?",     a: "Absolument, ma reine. L'orgueil est l'un des eunuques les plus dangereux parce qu'il se déguise en dignité. Il dit : 'Je ne m'excuserai pas en premier.' Et chaque jour qui passe sans réconciliation construit un mur. Bigtha est patient. C'est pourquoi tu dois l'être plus que lui. La paix d'abord. 💛" },
];
