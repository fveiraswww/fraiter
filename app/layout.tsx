import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Provider from '@/components/dashboard/provider';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
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
