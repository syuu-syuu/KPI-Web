import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteMenuItem, SiteDetail } from '@/lib/definitions';
import { fetchSites } from '@/lib/api';

interface SiteMenuContextProps {
  siteMenuItems: SiteMenuItem[];
  setSiteMenuItems: React.Dispatch<React.SetStateAction<SiteMenuItem[]>>;
}

const SiteMenuContext = createContext<SiteMenuContextProps>({
  siteMenuItems: [],
  setSiteMenuItems: () => {},
});

export const useSiteMenuContext = () => {
  const context = useContext(SiteMenuContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider = ({children,}: {children: React.ReactNode;}) => {
  const [siteMenuItems, setSiteMenuItems] = useState<SiteMenuItem[]>([]);
  useEffect(() => {
    const loadSites = async () => {
      const data = await fetchSites(); // Fetch the data client-side
      const siteMenuItems = data.map((site: SiteDetail) => ({
        site_id: site.site_id,
        name: site.site_name,
        href: `/sites/${site.site_id}`, // Create URL with site_id
      })).sort((a, b) => a.name.localeCompare(b.name));
      console.log('Generated siteMenuItems:', siteMenuItems);
      setSiteMenuItems(siteMenuItems);
    };

    loadSites();
  }, []);

  return (
    <SiteMenuContext.Provider value={{ siteMenuItems, setSiteMenuItems }}>
      {children}
    </SiteMenuContext.Provider>
  );
};