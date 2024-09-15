export const STATE_CHOICES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY"
];

export type SiteDetail = {
  site_id: number;
  site_name: string;
  longitude: number | undefined;
  latitude: number | undefined;
  address: string;
  city: string;
  state: string;
  contract_start_month: number | undefined;
  contract_end_month: number | undefined;
};


export type SiteMenuItem = {
  site_id: number;
  name: string;
  href: string;
};


export interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: SiteMenuItem[]; 
}

export interface NavLinksProps {
  menuItems: NavLink[]; // The array of navigation links to display
  expandedItems: { [key: string]: boolean }; // A map of expanded state for each menu item by name
  toggleMenuItem: (itemName: string) => void; // Function to toggle the expanded state of a menu item
}

export interface SiteDetailsFormProps {
  site_id: string;
  siteDetails: SiteDetail | undefined;
  onUpdateSiteDetails: (updatedDetails: SiteDetail) => void;
}



export interface InverterData {
    inverter_name: string;
    value: string | null;
}

export interface SiteHourlyData {
    is_day: "Day" | "Night" | "Unknown"; 
    timestamp: string; // ISO string format for date and time
    POA_Irradiance: string | null;
    meter_power: string | null;
    inverters: InverterData[];
}
