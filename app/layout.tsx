import type { Metadata } from 'next';

import { Analytics } from "@vercel/analytics/next"

import './globals.css';

export const metadata: Metadata = {
  title: 'SkelPass — Secure Password Management',
  description: 'Modern Password Manager with Profile Management by Skelvric.',
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>);
};
