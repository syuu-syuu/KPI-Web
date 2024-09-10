import axios from 'axios';
import { SiteDetail,  SiteMonthlyData } from '@/lib/definitions'

// axios.interceptors.response.use(
//   response => response, // Let the response pass through if it's successful
//   error => {
//     // Handle specific error statuses or network issues here
//     console.error('Global error handler:', error);
//     return Promise.reject(error); // Reject the promise to maintain the error flow
//   }
// );

export const fetchSites = async (): Promise<SiteDetail[]> => {
  try {
      const response = await axios.get('/api/sites');
    console.log("✅ Successfully fetched sites for side menu");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching sites:", error);
    throw error;
  }
  
    
};


export const fetchSiteDetails = async (site_id: string): Promise<SiteDetail> => {
  try {
    const response = await axios.get(`/api/sites/${site_id}`);
    console.log(`✅ Successfully fetched information for site ${response.data.site_name}`);
    return response.data;
  } catch (error) { 
    console.error(`❌ Error fetching site details for site_id ${site_id}:`, error);
    throw error;
  }
};

export async function fetchAvailableTimeRange(site_id: string | null) {
  if (!site_id) {
    console.warn("⚠️ site_id is null or undefined, skipping API request");
    return null;
  }

  try {
    const response = await axios.get(`/api/get_available_time_range/${site_id}`);
    console.log("✅ Successfully fetched available time range", response.data);
    return response.data;
  } catch (error) { 
    console.error(`❌ Error fetching available time range for site_id ${site_id}:`, error);
    throw error;
  }
}

export async function fetchOriginalRawData(site_id: string, start_date: Date | undefined, end_date: Date | undefined): Promise<SiteMonthlyData[]> {
    try {
      // Convert dates to ISO string format - a widely accepted standard
      const startDateStr = start_date?.toISOString();
      const endDateStr = end_date?.toISOString();
      
      const response = await axios.get('/api/site_monthly_data/list_original', {
        params: {
          site_id,
          start_date: startDateStr,
          end_date: endDateStr
        }
      });

      console.log("✅ Successfully fetched original raw data:", response.data);
      return response.data
    } catch (error) {
      console.error("❌ Error fetching original raw data:", error);
      throw error;
    }
    
}