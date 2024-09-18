'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSiteMenuContext } from '@/hooks/use-nav';
import {
  Home,
  BookOpen,
  Tent,
  Atom,
  Bird,
  Bot,
  Code2,
  Eclipse,
  Frame,
  History,
  LifeBuoy,
  Map,
  PieChart,
  Rabbit,
  Send,
  Settings2,
  SquareTerminal,
  Star,
  Turtle,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { StorageCard } from "@/components/storage-card"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar"

import { SiteMenuItem } from '@/lib/definitions';

const createSideNavData = (siteMenuItems: SiteMenuItem[]) => {
  return {
    user: {
    name: "Lizzy",
    email: "lizzy@example.com",
    avatar: "@/public/css-logo.png",
  },
  navMain: [
     {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Sites",
      url: "#",
      icon: Tent,
      items: siteMenuItems.map((site) => ({
        title: site.name,
        url: `/sites/${site.site_id}`,
      })),
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  }
}

const AppSidebar = () => {
  const { siteMenuItems } = useSiteMenuContext();
  const [sideNavData, setSideNavData] = useState(() => createSideNavData([]));

  useEffect(() => {
        const initialSideNavData = createSideNavData(siteMenuItems);
        setSideNavData(initialSideNavData);
  }, [siteMenuItems]);


  return (
    <Sidebar>
      <SidebarHeader>
          <div
            className={"flex flex-row items-center leading-none text-zinc-900 space-x-4 mt-5 mb-5"}
          >
            <p className="text-[22px]">Carolina Solar Services</p>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>KPI Calculator</SidebarLabel>
          <NavMain items={sideNavData.navMain} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={sideNavData.navSecondary} />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sideNavData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}


export {AppSidebar};