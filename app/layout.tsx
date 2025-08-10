import './globals.css';
import '../lib/tokens/tokens.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'WO/WNSC Dashboard',
  description: 'Offline-first dashboard for Oman Oil (WO) and NAMA (WNSC) records.',
  manifest: '/manifest.json',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  themeColor: '#0B5ED7',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WO-WNSC" />
      </head>
      <body className="theme-oman-oil app-shell">{children}</body>
    </html>
  );
}
