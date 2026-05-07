import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Les 7 Alertes — Conserve ta couronne",
  description: "Un parcours royal de 7 chapitres pour protéger et fortifier ton couple.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0F0205",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
