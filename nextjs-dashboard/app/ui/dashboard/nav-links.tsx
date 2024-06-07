'use client';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ServerIcon,
  CubeTransparentIcon,
  MapIcon
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
interface Site {
  name: string;
  href: string;
}

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: Site[];
}

interface NavLinksProps {
  onToggleSites: () => void; 
  sitesExpanded: boolean;
}


const siteNames: string[] = [
  "Chilouquin Solar Farm",
  "Cotten Farm",
  "County Home Solar Center, LLC",
  "Dairy Solar",
  "Davis Lane Solar, LLC",
  "Faison",
  "Four Oaks",
  "Freemont Solar Center",
  "Gauss Solar",
  "Jersey Solar",
  "Lakeview Solar",
  "Mariposa Solar Center, LLC",
  "Merrill Solar",
  "Monroe Moore Farm",
  "NC Solar I",
  "NC Solar II",
  "Nitro",
  "Princeton",
  "Red Oak Solar Farm",
  "S. Robeson Solar",
  "Sarah",
  "Schell Solar Farm",
  "Sedberry",
  "Siler 421 Farm",
  "Sonne Two, LLC",
  "Tiburon",
  "Tumbleweed Solar Farm",
  "Turkey Hill Solar"
];

const sitesData: Site[] = siteNames.map(name => ({
  name,
  href: `/dashboard/site/${name.toLowerCase().replace(/ /g, '-').replace(/,/g, '').replace(/\./g, '').replace(/&/g, 'and')}`
}));


const links: NavLink[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Docs',
    href: '/dashboard/docs',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Sites', href: '/dashboard/sites', icon: CubeTransparentIcon, children: sitesData},
  { name: 'Database', href: 'dashboard/database', icon: ServerIcon}
];



export const NavLinks: React.FC<NavLinksProps> = ({ onToggleSites, sitesExpanded }) => {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isSites = link.name === 'Sites';
        return (
          <div key={link.name}>
            <Link
              href={link.href}
              onClick={(e) => {
                if (isSites) {
                  e.preventDefault(); 
                  onToggleSites();   
                }
              }}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
            {isSites && sitesExpanded && link.children && (
              <div className="ml-10 space-y-2">
                {link.children.map((child) => (
                  <Link key={child.name}
                    href={child.href}
                    className={clsx(
                      'flex h-[48px] grow items-center justify-center mt-2 gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                      {
                        'bg-sky-100 text-blue-600': pathname === child.href,
                      },
                    )}
                  >
                  <MapIcon className="w-6" /> 
                    <p className="hidden md:block">{child.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
