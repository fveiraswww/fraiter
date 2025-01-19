import type { Metadata } from 'next';
import '../../globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/dashboard/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
};

export default function RootLayout({
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
