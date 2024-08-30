import { SiteDetail } from '@/lib/definitions';

export const fetchSites = async (): Promise<SiteDetail[]> => {
  try {
    const response = await fetch('/api/sites/'); 
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    console.log("✅ Successfully fetched sites");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

export const fetchSiteDetails = async (siteId: string): Promise<SiteDetail> => {
  try {
    const response = await fetch(`/api/sites/${siteId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log("✅ Successfully fetched information for site {data.site_name}");
    return data;
  } catch (error) {
    console.error('Error fetching site details:', error);
    throw error;
  }
}


