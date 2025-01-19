import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { supabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const supabase = await supabaseServer();

  const session = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser(session.data.session?.access_token ?? '');

  const { data, error } = await supabase
    .from('user_details')
    .select()
    .eq('user_id', user?.id)
    .single();

  const baseUsername =
    data?.username ??
    user?.email?.slice(0, user?.email?.indexOf('@')) ??
    user?.user_metadata?.name.replace(/\s/g, '');

  if (session) {
    if (error) {
      let finalUsername = baseUsername;
      let counter = 1;

      while (true) {
        const { data: exists } = await supabase.rpc('check_username_exists', {
          input_username: finalUsername,
        });

        if (!exists) break;
        finalUsername = `${baseUsername}_${counter}`;
        counter++;
      }
      const userDetails = {
        user_id: user?.id,
        username: finalUsername,
        name: user?.user_metadata?.name ?? '',
        email: user?.email ?? null,
      };

      await supabase.from('user_details').insert([userDetails]);
    }
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/dashboard/${baseUsername}`
  );
}
