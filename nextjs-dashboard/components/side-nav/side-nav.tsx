'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import CSSLogo from '@/components/side-nav/css-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ServerIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

import { SiteMenuItem, NavLink } from '@/lib/definitions';
import { NavLinks } from '@/components/side-nav/nav-links';
import { useSiteMenuContext } from '@/hooks/use-nav';


const createMenuItems = (siteMenuItems: SiteMenuItem[]): NavLink[] => {
  return [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Docs', href: '/docs', icon: DocumentDuplicateIcon },
    { name: 'Sites', href: '/sites', icon: CubeTransparentIcon, children: siteMenuItems },
    { name: 'Database', href: '/database', icon: ServerIcon },
  ];
};


const SideNav = () => {
  const { siteMenuItems } = useSiteMenuContext(); // Use the siteMenuItems from the context
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [menuItems, setMenuItems] = useState<NavLink[]>([]);

  useEffect(() => {
        const initialMenuItems = createMenuItems(siteMenuItems);
        setMenuItems(initialMenuItems);
  }, [siteMenuItems]);

  const toggleMenuItem = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-y-auto">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <CSSLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks 
          menuItems={menuItems}
          expandedItems={expandedItems}
          toggleMenuItem={toggleMenuItem}/>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}


export default SideNav