import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
