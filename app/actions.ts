'use server';

import { supabaseServer } from '@/lib/supabase/server';

export async function changeProfile(accessToken: string, profile: string) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('user_details')
    .update({ profile })
    .eq('user_id', user.id);

  if (error) {
    console.error(error);

    throw new Error(error.message);
  }

  return true;
}
