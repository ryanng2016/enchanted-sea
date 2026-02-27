import { Geist, Geist_Mono, Roboto } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import * as SoftRippleCursorModule from "../components/SoftRippleCursor";
import * as ZGridBackgroundModule from "../components/ZGridBackground";

// Handles both: default export AND named export
const SoftRippleCursor =
  (SoftRippleCursorModule as any).default ??
  (SoftRippleCursorModule as any).SoftRippleCursor;

const ZGridBackground =
  (ZGridBackgroundModule as any).default ??
  (ZGridBackgroundModule as any).ZGridBackground;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const monsieur = localFont({
  src: "./fonts/MonsieurLaDoulaise-Regular.ttf",
  variable: "--font-monsieur",
  display: "swap",
});

export const metadata: Metadata = {
  title: "enchanted sea ♡",
  description: "By  ૮◞ ‸ ◟ ა",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monsieur.variable} ${roboto.variable} relative bg-white overflow-x-hidden`}
      >
        <SoftRippleCursor />

        {/* 3D Grid Overlay (Above Waves, Below Content) */}
        <ZGridBackground />

        {/* Main Content */}
        <div className="relative z-20">{children}</div>

        {/* Bottom Glow + Water Waves */}
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[300px] overflow-visible">
          <div className="absolute inset-x-0 -bottom-12 h-[360px] bg-linear-to-t from-blue-500/35 via-blue-500/15 to-transparent blur-2xl" />
          <div className="absolute inset-x-0 -bottom-12 h-[360px] wave-water wave-water--back opacity-35" />
          <div className="absolute inset-x-0 -bottom-12 h-[360px] wave-water wave-water--front opacity-55" />
        </div>
      </body>
    </html>
  );
}