import type { Metadata } from 'next';
import '../../globals.css';
import { Toaster } from 'sonner';
import Sidebar from '@/components/dashboard/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Provider from '@/components/dashboard/provider';
import { supabaseServer } from '@/lib/supabase/server';
import { UserDetails } from '@/db/types';

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

  const { data: userData } = (await supabase
    .from('user_details')
    .select()
    .eq('user_id', user?.id)
    .single()) as unknown as { data: UserDetails };

  return (
    <html lang="en">
      <Provider user={user} user_details={userData}>
        <body>
          <SidebarProvider>
            <Sidebar />
            {children}
            <Toaster />
          </SidebarProvider>
        </body>
      </Provider>
    </html>
  );
}
