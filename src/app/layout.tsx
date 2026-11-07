import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hypixel SkyBlock Tracker — Official API Powered',
  description: 'Production-ready Hypixel SkyBlock player tracker with live API integration, NBT inventory decoder, networth analysis, upgrade planner, and public share URLs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
