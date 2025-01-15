import axios from 'axios';
import { SiteDetail, SiteHourlyData } from '@/lib/definitions';

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
    console.log('✅ Successfully fetched sites for side menu');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching sites:', error);
    throw error;
  }
};

export const fetchSiteDetails = async (
  site_id: string,
): Promise<SiteDetail> => {
  try {
    const response = await axios.get(`/api/sites/${site_id}`);
    console.log(
      `✅ Successfully fetched information for site ${response.data.site_name}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error fetching site details for site_id ${site_id}:`,
      error,
    );
    throw error;
  }
};

export const submitSiteDetails = async (
  site_id: string,
  siteData: Record<string, any>,
) => {
  try {
    const response = await axios.put(`/api/sites/${site_id}/`, siteData);
    console.log('Site data submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting site data:', error);
  }
};

export async function fetchAvailableTimeRange(site_id: string | null) {
  if (!site_id) {
    console.warn('⚠️ site_id is null or undefined, skipping API request');
    return null;
  }

  try {
    const response = await axios.get(
      '/api/site_hourly_data/get_available_time_range',
      {
        params: {
          site_id,
        },
      },
    );
    console.log('✅ Successfully fetched available time range', response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error fetching available time range for site_id ${site_id}:`,
      error,
    );
    throw error;
  }
}

export async function fetchHourlyData(
  site_id: string,
  start_date: Date | undefined,
  end_date: Date | undefined,
): Promise<SiteHourlyData[]> {
  try {
    // Convert dates to ISO string format - a widely accepted standard
    // const startDateStr = start_date?.toISOString();
    // const endDateStr = end_date?.toISOString();

    const formatDate = (date: Date | undefined) => {
      if (!date) return '';
      const padZero = (num: number) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    };
    const startDateStr = formatDate(start_date);
    const endDateStr = formatDate(end_date);
    console.log('💙 startDateStr, endDateStr:', startDateStr, endDateStr);

    const response = await axios.get('/api/site_hourly_data/get_hourly', {
      params: {
        site_id,
        start_date: startDateStr,
        end_date: endDateStr,
      },
    });

    console.log('✅ Successfully fetched hourly data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching hourly data:', error);
    throw error;
  }
}

export const processFiles = async (site_id: string) => {
  try {
    const response = await axios.post('/api/process_file/', {
      site_id: site_id,
    });
    console.log('✅ Successfully processed files');
    return response.data;
  } catch (error) {
    console.error('❌ Error processing files:', error);
    throw error;
  }
};

export const processOriginalData = async (site_id: string) => {
  try {
    console.log('Processing original data for site_id:', site_id);
    const response = await axios.post(
      '/api/site_hourly_data/process_original/',
      {
        site_id: site_id,
      },
    );
    console.log('✅ Successfully processed original data');
    return response.data;
  } catch (error) {
    console.error('❌ Error processing original data:', error);
    throw error;
  }
};

export const calculateAvailabilities = async (site_id: string) => {
  try {
    const response = await axios.post('/api/kpi/calculate_availabilities/', {
      site_id: site_id,
    });
    console.log('✅ Successfully calculated availabilities');
    return response.data;
  } catch (error) {
    console.error('❌ Error calculating availabilities:', error);
    throw error;
  }
};
