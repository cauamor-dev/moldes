import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/toast";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const text = Instrument_Sans({ subsets: ["latin"], variable: "--font-text" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: { default: "Moldes", template: "%s · Moldes" },
  description: "Catálogo pessoal de direção de design.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#121117", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${text.variable} ${code.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
