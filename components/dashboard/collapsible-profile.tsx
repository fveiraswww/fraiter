'use client';

import * as React from 'react';
import {
  Settings,
  MessageSquare,
  LogOut,
  ChevronsUpDown,
  Coins,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Avatar from 'boring-avatars';

import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function CollapsibleProfileMenu() {
  const route = useRouter();

  // async function signOut() {
  //   await supabase.auth.signOut();

  //   route.push('/');
  // }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="mb-2 flex cursor-pointer items-center justify-between space-x-4 rounded-lg p-1 transition-all">
          <div className="flex flex-row items-center gap-2">
            <Avatar
              square
              className="!rounded-md"
              name="user"
              size={24}
              variant="marble"
            />
            <h4 className="text-sm font-semibold">Fran Veiras</h4>
          </div>
          <Button className="!h-fit !w-fit p-0" size="sm" variant="ghost">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-[80] !max-w-fit !p-1">
        <div className="flex items-center space-x-4 p-1">
          <Avatar square name={'user'} size={32} variant="marble">
            <AvatarImage alt="@franciscoveiras" src="/placeholder-avatar.jpg" />
            <AvatarFallback>FV</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {/* {user_details?.name && user_details.name.length > 0
                ? user_details.name
                : user_details?.username} */}
              Fran veiras
            </div>
            <div className="text-xs text-muted-foreground">
              franciscover99@gmail.com
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button className="!h-7 w-full justify-start !p-1" variant="ghost">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="!h-7 w-full justify-start !p-1" variant="ghost">
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
          <Button
            className="!h-7 w-full justify-start !p-1"
            variant="ghost"
            // onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
