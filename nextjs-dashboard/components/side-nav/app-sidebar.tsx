'use client';
import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSiteMenuContext } from '@/hooks/use-nav';
import {
  BookOpen,
  Bot,
  Sunrise,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Home,
  Tent,
  Grid2x2Check,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { SiteMenuItem } from '@/lib/definitions';

const createSideNavData = (siteMenuItems: SiteMenuItem[]) => {
  return {
    user: {
    name: "Lizzy",
    email: "lizzy@gmail.com",
    avatar: "@/public/css-logo.png",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Site Profiles",
      url: "#",
      icon: Tent,
      items: siteMenuItems.map((site) => ({
        title: site.name,
        url: `/sites/profile/${site.site_id}`,
      })),
    },
    {
      title: "Data & Analytics",
      url: "#",
      icon: Grid2x2Check,
      items: siteMenuItems.map((site) => ({
        title: site.name,
        url: `/sites/data/${site.site_id}`,
      })),
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
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],

  }
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { siteMenuItems } = useSiteMenuContext();
  const [sideNavData, setSideNavData] = useState(() => createSideNavData([]));

  useEffect(() => {
        const initialSideNavData = createSideNavData(siteMenuItems);
        setSideNavData(initialSideNavData);
  }, [siteMenuItems]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground mr-2">
                  <Sunrise className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight mt-1">
                  <span className="truncate text-sm font-semibold">AutoCAL Dashboard</span>
                  <span className="truncate text-xs">Carolina Solar Services</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideNavData.navMain} />
        {/* <NavProjects projects={sideNavData.projects} /> */}
        {/* <NavSecondary items={sideNavData.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sideNavData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
