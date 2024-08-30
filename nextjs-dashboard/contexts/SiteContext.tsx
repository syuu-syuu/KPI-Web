import React, { createContext, useContext, useState } from 'react';
import { SiteMenuItem } from '@/lib/definitions';

interface SiteContextProps {
  siteMenuItems: SiteMenuItem[];
  setSiteMenuItems: React.Dispatch<React.SetStateAction<SiteMenuItem[]>>;
}

const SiteContext = createContext<SiteContextProps | undefined>(undefined);

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider = ({
  children,
  siteMenuItems: initialSiteMenuItems,
}: {
  children: React.ReactNode;
  siteMenuItems: SiteMenuItem[];
}) => {
  const [siteMenuItems, setSiteMenuItems] = useState<SiteMenuItem[]>(initialSiteMenuItems);

  return (
    <SiteContext.Provider value={{ siteMenuItems, setSiteMenuItems }}>
      {children}
    </SiteContext.Provider>
  );
};