'use client';

import { UserDetails } from '@/db/types';
import { User } from '@supabase/supabase-js';
import { ThemeProvider } from 'next-themes';
import { redirect, usePathname } from 'next/navigation';
import React, {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

interface UserDataContextType {
  user: User | null;
  user_details: UserDetails | null;
}

export const UserDataContext = createContext<UserDataContextType>({
  user: null,
  user_details: null,
});

function Provider({
  children,
  user,
  user_details,
}: {
  children: ReactNode;
  user: User | null;
  user_details: UserDetails | null;
}) {
  const value = useMemo(
    () => ({
      user,
      user_details,
    }),
    [user_details, user]
  );

  const pathname = usePathname();
  if (pathname === '/' && user_details?.username)
    redirect(`/dashboard/${user_details.username}`);

  return (
    <UserDataContext.Provider value={value}>
      <ThemeProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="system"
      >
        {children}
      </ThemeProvider>
    </UserDataContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error('useUser must be used within a BusinessProvider');
  }

  return context;
};

export default Provider;
