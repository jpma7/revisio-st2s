import type { Metadata } from "next";
import { DM_Serif_Display, Work_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Révisio – Ton bac ST2S en poche",
  description:
    "Révise les maths de 1ère ST2S dans un coin chaleureux, sans stress et sans approximation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSerif.variable} ${workSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-slate antialiased">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-10">
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-slate transition hover:text-terracotta"
            >
              Révisio
            </Link>
            <div className="flex items-center gap-1 sm:gap-3">
              <NavLink href="/revision-express" label="🚀 Express" />
              <NavLink href="/programme" label="Programme" />
              <NavLink href="/reviser" label="Réviser" />
              <NavLink href="/annales" label="Annales" />
              <NavLink href="/ia" label="IA" />
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="mx-auto w-full max-w-5xl flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-8 text-center">
          <p className="font-display text-lg text-slate">Révisio</p>
          <p className="mt-1 text-sm text-slate-light">
            Ton coin révision pour le bac ST2S · Sources vérifiées · Pas
            d&apos;hallucination
          </p>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-light transition hover:bg-cream hover:text-terracotta sm:px-4 sm:text-base"
    >
      {label}
    </Link>
  );
}
