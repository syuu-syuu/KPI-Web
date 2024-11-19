export const STATE_CHOICES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

export const STATE_MAP = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

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

// export interface NavLinksProps {
//   menuItems: NavLink[]; // The array of navigation links to display
//   expandedItems: { [key: string]: boolean }; // A map of expanded state for each menu item by name
//   toggleMenuItem: (itemName: string) => void; // Function to toggle the expanded state of a menu item
// }

export interface InverterData {
  inverter_name: string;
  value: string | null;
}

export interface SiteHourlyData {
  is_day: 'Day' | 'Night' | 'Unknown';
  timestamp: string; // ISO string format for date and time
  POA_Irradiance: string | null;
  meter_power: string | null;
  inverters: InverterData[];
}


export type DataStatus = "A" | "B" | "C" | "D";

export interface StatusDefinition {
  value: DataStatus;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const STATUS_DEFINITIONS: Record<DataStatus, StatusDefinition> = {
  A: {
    value: "A",
    label: "No issues",
    description: "No issues, no changes",
  },
  B: {
    value: "B",
    label: "Auto-corrected",
    description: "Issues, auto-corrected",
  },
  C: {
    value: "C",
    label: "Needs investigation",
    description: "Issues, auto-corrected, manual investigation required",
  },
  D: {
    value: "D",
    label: "Unprocessed",
    description: "Unprocessed",
  }
};

export const STATUS_OPTIONS = Object.values(STATUS_DEFINITIONS);