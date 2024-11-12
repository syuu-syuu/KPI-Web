import { fetchAvailableTimeRange, fetchHourlyData } from '@/lib/api';
import { DateRange } from "react-day-picker"

export async function loadTimeRange(site_id: string) {
  try {
    const data = await fetchAvailableTimeRange(site_id);
    if (data?.earliest && data?.latest) {
      console.log("Time range data:", data.earliest, "-", data.latest);
      const availableDateRange = {
        from: new Date(data.earliest),
        to: new Date(data.latest),
      }
      return availableDateRange;
    } else {
      console.error("Time range data is missing or invalid");
    }
  } catch (error) {
    console.error("Error fetching available time range:", error);
    throw error;
  }
}

export async function loadHourlyData(site_id: string, start_date: Date | undefined, end_date: Date | undefined) {
    try {
      const fetchedData = await fetchHourlyData(site_id, start_date, end_date);
      return fetchedData;
    } catch (error) {
      console.error("Error fetching original raw data:", error);
      throw error;
    }
}