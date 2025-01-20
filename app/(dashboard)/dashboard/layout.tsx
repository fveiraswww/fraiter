import type { Metadata } from 'next';
import '../../globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/dashboard/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Lattter',
  description: 'Writer copilot',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'next14', 'pwa', 'next-pwa'],
  authors: [
    {
      name: 'fveiras',
      url: 'https://www.x.com/fveiras_',
    },
  ],
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: '/icon.svg' },
    { rel: 'icon', url: '/icon.svg' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <Sidebar />
          {children}
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
