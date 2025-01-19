import type {Metadata} from "next";

import "../globals.css";

import {Navbar} from "@/components/landing/navbar";
import {supabaseServer} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "SkaleBox",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const supabase = await supabaseServer();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  const {data: userDetails} = await supabase
    .from("user_details")
    .select()
    .eq("user_id", user?.id)
    .single();

  return (
    <html lang="en">
      <body className="light m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-white font-sans antialiased">
        <Navbar user={userDetails} />
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
