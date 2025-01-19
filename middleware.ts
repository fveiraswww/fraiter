import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { parseEnumToArray } from './lib/utils';

enum PrivateRoutes {
  DASHBOARD = '/dashboard',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const private_routes = parseEnumToArray(PrivateRoutes);

  const { data: userDetails } = await supabase
    .from('user_details')
    .select()
    .eq('user_id', user?.id)
    .single();

  if (!user || !userDetails || userDetails.plan === 'BASE') {
    if (
      private_routes.some((route: string) =>
        request.nextUrl.pathname.includes(route)
      )
    ) {
      const url = new URL('/', request.url);

      url.searchParams.set('error', 'account_plan');

      return Response.redirect(url);
    }
  }

  return supabaseResponse;
}
