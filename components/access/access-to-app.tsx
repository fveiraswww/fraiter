'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { Twitch } from 'lucide-react';
import Image from 'next/image';

import { Button } from '../ui/button';

import SignUpForm from './sign-up/sign-up';
import SignInForm from './sign-in/sign-in';

import { createClient } from '@/lib/supabase/client';
import GoogleIcon from '@/public/icons/GoogleIcon';

interface IProps {
  type_of_mode: 'signup' | 'signin';
}

export function AccessToApp({ type_of_mode }: IProps) {
  // eslint-disable-next-line react/hook-use-state
  const [showinput, setShowInput] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const accessWithTwitch = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'twitch',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    });

    router.refresh();
  };

  const accessWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    });

    router.refresh();
  };

  return (
    <div>
      <main className="m-auto my-10 flex w-full flex-col justify-center px-8 md:w-2/3 lg:w-2/3 xl:w-2/5">
        <div className="mb-[43px] text-center">
          <h1 className="flex items-center justify-center text-2xl font-medium leading-[26px]">
            {type_of_mode === 'signup' ? 'Sign Up' : 'Log In'} to
            <Image
              alt="logo skalebox"
              className="ml-2 inline dark:invert"
              height={100}
              src="/complete-logo.svg"
              width={100}
            />
          </h1>
          {type_of_mode === 'signup' ? (
            <p className="text-dark-muted mt-2 text-xs text-gray-400">
              {'Already have an account? '}
              <Link className="underline transition-colors" href="/signIn">
                Log In
              </Link>
              .
            </p>
          ) : (
            <p className="text-dark-muted mt-2 text-xs text-gray-400">
              {"Don't have an account? "}
              <Link className="underline transition-colors" href="/signUp">
                Create account
              </Link>
              .
            </p>
          )}
        </div>
        <div className="space-y-4">
          <Button
            className="shadow-border-complete-inner relative w-full rounded-md hover:!bg-grey-hover xl:text-sm"
            type="submit"
            onClick={accessWithGoogle}
          >
            <div className="absolute left-4">
              <GoogleIcon />
            </div>
            Continue with Google
          </Button>
          <Button
            className="shadow-border-complete-inner relative w-full rounded-md bg-brand transition-all hover:!bg-brand-secondary xl:text-sm"
            type="submit"
            onClick={accessWithTwitch}
          >
            <div className="absolute left-4">
              <Twitch />
            </div>
            Continue with Twitch
          </Button>
        </div>
        <div className="my-[33px] h-[1px] border border-grey-border/40" />
        {!showinput ? (
          <Button
            className="w-full"
            type="submit"
            variant="ghost"
            onClick={() => setShowInput(true)}
          >
            Continue with Email
          </Button>
        ) : type_of_mode === 'signin' ? (
          <SignInForm />
        ) : (
          <SignUpForm />
        )}
      </main>
      <Toaster />
    </div>
  );
}
