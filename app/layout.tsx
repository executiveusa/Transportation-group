import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bones — Private Driver Puerto Vallarta",
  description:
    "Private driver in Puerto Vallarta. Airport transfers, shopping, night out, business. 15+ years experience. Safe. Reliable. Fair prices.",
  keywords:
    "private driver Puerto Vallarta, airport transfer PV, taxi Puerto Vallarta, chauffeur PV",
  openGraph: {
    title: "Bones — Private Driver Puerto Vallarta",
    description: "Safe. Reliable. Fair prices. Book via WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
