import {useEffect, useState} from "react";

import {createClient} from "../supabase/client";
import {Session} from "../supabase/types";

export default function useSession() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession();

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function getSession() {
    const {
      data: {session: getSupabaseSession},
    } = await supabase.auth.getSession();

    setSession(getSupabaseSession);
  }

  return {session};
}
