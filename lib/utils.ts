import { CHAP_DAYS, SCHEDULE } from "@/lib/data/schedule";
import { CHAPTERS } from "@/lib/data/chapters";

export const today = () => new Date().toISOString().slice(0, 10);

export function daysSince(startDate: string): number {
  if (!startDate) return 0;
  const s = new Date(startDate);
  const n = new Date();
  s.setHours(0, 0, 0, 0);
  n.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((n.getTime() - s.getTime()) / 86_400_000));
}

export function chapDay(num: number): number {
  return CHAP_DAYS[num] ?? 99;
}

export function isChapAvailable(
  num: number,
  startDate: string,
  chapsDone: number[],
  adminMode: boolean
): boolean {
  if (adminMode) return true;
  if (!startDate) return num === 1;
  const d = daysSince(startDate);
  if (d < chapDay(num)) return false;
  if (num === 1) return true;
  return chapsDone.includes(num - 1);
}

export function getChapDate(num: number, startDate: string): string {
  if (!startDate) return "";
  const s = new Date(startDate);
  s.setDate(s.getDate() + chapDay(num));
  return s.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export function getSchedDate(offset: number, startDate: string): string {
  if (!startDate) return "";
  const s = new Date(startDate);
  s.setDate(s.getDate() + offset);
  return String(s.getDate());
}

export function todayScheduleEntry(startDate: string) {
  const d = daysSince(startDate);
  return d < SCHEDULE.length ? SCHEDULE[d] : null;
}

export function currentQuoteIndex() {
  return new Date().getDay();
}

export function chapColor(num: number): string {
  const colors = ["#2D5A3D", "#A8882A", "#4A7A5A", "#1A3A2A"];
  return colors[num % colors.length];
}

export function personalise(text: string, kName: string): string {
  return text.replace(/\bROI\b/g, kName || "mon roi");
}

export function xpPercent(xp: number): number {
  return Math.min(100, Math.round((xp / 700) * 100));
}

export function getChapterByNum(num: number) {
  return CHAPTERS.find((c) => c.num === num);
}

export function nextUnlockedChap(chapsDone: number[]): number {
  for (let i = 1; i <= 7; i++) {
    if (!chapsDone.includes(i)) return i;
  }
  return 7;
}
