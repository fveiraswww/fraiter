import type {UserDetails} from "@/db/types";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import {Button as AnimatedButton} from "../ui/animated-button";

import {cn} from "@/lib/utils";

export function Navbar({user}: {user: UserDetails | null}) {
  return (
    <nav className="relative z-50 py-2">
      <div className="flex flex-row items-center justify-between md:px-1">
        <Link href="/">
          <div className="relative flex h-[40px] w-[100px] items-center">
            <Image
              alt="logo skalebox"
              className="invert"
              height={100}
              src="/complete-logo.svg"
              width={100}
            />
          </div>
        </Link>
        <div className="flex flex-row items-center gap-2">
          <div className="!px-0 !py-0">
            {!user?.user_id && (
              <Link className="flex flex-row gap-2" href="/signIn">
                <AnimatedButton
                  gradient_blur
                  className={cn("!h-7 !w-32 cursor-pointer hover:bg-gray-100")}
                >
                  <p>Sign in / Sign up</p>
                </AnimatedButton>
              </Link>
            )}
            {user?.user_id ? (
              <Link className="flex flex-row gap-2" href={`/dashboard/${user?.username}`}>
                <AnimatedButton
                  gradient_blur
                  className={cn("!h-7 !w-32 cursor-pointer !text-white hover:bg-black/20")}
                >
                  <p>Dashboard</p>
                </AnimatedButton>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
