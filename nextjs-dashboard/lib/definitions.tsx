export type SiteMenuItem = {
  site_id: number;
  name: string;
  href: string;
};

export type SiteDetail = {
  site_id: number;
  site_name: string;
  longitude: number | string;
  latitude: number | string;
  address: string;
  city: string;
  state: string;
  contract_start_month: number | string;
  contract_end_month: number | string;
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


export interface InverterData {
    inverter_name: string;
    value: number | null;
}

export interface SiteMonthlyData {
    is_day: "Day" | "Night" | "Unknown"; 
    timestamp: string; // ISO string format for date and time
    POA_Irradiance: number;
    meter_power: number | null;
    inverters: InverterData[];
}
