import { SiteMonthlyData } from "@/lib/definitions"

export const siteMonthlyDataSample: SiteMonthlyData[] = [
    {
        is_day: "Night",
        timestamp: "2023-09-01T00:00:00",
        POA_Irradiance: "-0.263722",
        meter_power: null,
        inverters: [
            { inverter_name: "Inverter_1", value: "2.0" },
            { inverter_name: "Inverter_2", value: "0.1" },
            { inverter_name: "Inverter_3", value: "0.0" },
            { inverter_name: "Inverter_4", value: "0.0" },
        ],
    },
    {
        is_day: "Day",
        timestamp: "2023-09-01T06:00:00",
        POA_Irradiance: "4.741910",
        meter_power: null,
        inverters: [
            { inverter_name: "Inverter_1", value: "7.745" },
            { inverter_name: "Inverter_2", value: "8.236668" },
            { inverter_name: "Inverter_3", value: "9.295" },
            { inverter_name: "Inverter_4", value: "8.701668" },
        ],
        
    },
    {
        is_day: "Day",
        timestamp: "2023-09-01T08:00:00",
        POA_Irradiance: "23.572520",
        meter_power: null,
        inverters: [
            { inverter_name: "Inverter_1", value: "37.06833" },
            { inverter_name: "Inverter_2", value: "42.31833" },
            { inverter_name: "Inverter_3", value: "49.03667" },
            { inverter_name: "Inverter_4", value: "47.44667" },
        ],
    }
];


export const inverterFormattedNamesSample = ["Inverter_1", "Inverter_2", "Inverter_3", "Inverter_4"];