'use client';
import { MapIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NavLinksProps} from '@/lib/definitions';


const NavLinks: React.FC<NavLinksProps> = ({ menuItems, expandedItems, toggleMenuItem  }) => {
  const pathname = usePathname();

  // Helper function to generate class names
  const getClassNames = (href: string) => clsx(
    'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
    {
      'bg-sky-100 text-blue-600': pathname === href,
    }
  );

  return (
    <>
      {menuItems.map((item) => {
        return (
          <div key={item.name}>
            <Link
              href={item.href}
               onClick={(e) => {
                if (item.children) {
                  e.preventDefault();
                  toggleMenuItem(item.name);
                }
              }}
              className={getClassNames(item.href)}
            >
              <item.icon className="w-6" />
              <p className="hidden md:block">{item.name}</p>
            </Link>
            {expandedItems[item.name] && item.children && (
              <div className="ml-10 space-y-2">
                {item.children.map((child) => (
                  <Link
                    key={child.site_id}
                    href={child.href}
                    className={getClassNames(child.href)}
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


export {NavLinks};