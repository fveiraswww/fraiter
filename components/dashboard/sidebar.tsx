'use client';

import {
  Airplay,
  Calendar,
  Coins,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react';
import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import CollapsibleProfileMenu from './collapsible-profile';

export default function ResizableSidebar() {
  const items = [
    {
      title: 'Home',
      url: `/dashboard`,
      icon: Home,
    },
    {
      title: 'Requests',
      url: `/dashboard/requests`,
      icon: Inbox,
    },
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Stream control',
      url: `/dashboard/stream-control`,
      icon: Airplay,
    },
    {
      title: 'Settings',
      url: `/dashboard/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar className="!border-none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="text-xl">fraiter</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent className="my-8">
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CollapsibleProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
