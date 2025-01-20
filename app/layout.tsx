import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Provider from '@/components/dashboard/provider';

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
    { rel: 'apple-touch-icon', url: 'icons/icon.svg' },
    { rel: 'icon', url: 'icons/icon.svg' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('user_details')
    .select()
    .eq('user_id', user?.id)
    .single();

  return (
    <html lang="en">
      <Provider user={user} user_details={userDetails}>
        <body>
          {children}
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
