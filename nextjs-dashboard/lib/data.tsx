import { SiteMonthlyData } from "./definitions";

export const siteMonthlyDataSample: SiteMonthlyData[] = [
    {
        timestamp: "2023-09-01T00:00:00",
        poaIrradiance: -0.263722,
        meterPower: null,
        inverters: [
            { inverterOriginalName:"A", inverterFormattedName: "Inverter_1", value: 0.0 },
            { inverterOriginalName:"B",inverterFormattedName: "Inverter_2", value: 0.0 },
            { inverterOriginalName:"C",inverterFormattedName: "Inverter_3", value: 0.0 },
            { inverterOriginalName:"D",inverterFormattedName: "Inverter_4", value: 0.0 },
        ],
        dayNight: "Night",
    },
    {
        timestamp: "2023-09-01T06:00:00",
        poaIrradiance: 4.741910,
        meterPower: null,
        inverters: [
            { inverterOriginalName:"A",inverterFormattedName: "Inverter_1", value: 7.745 },
            { inverterOriginalName:"B",inverterFormattedName: "Inverter_2", value: 8.236668 },
            { inverterOriginalName:"C",inverterFormattedName: "Inverter_3", value: 9.295 },
            { inverterOriginalName:"D",inverterFormattedName: "Inverter_4", value: 8.701668 },
        ],
        dayNight: "Day",
    },
    {
        timestamp: "2023-09-01T08:00:00",
        poaIrradiance: 23.572520,
        meterPower: null,
        inverters: [
            { inverterOriginalName:"A",inverterFormattedName: "Inverter_1", value: 37.06833 },
            { inverterOriginalName:"B",inverterFormattedName: "Inverter_2", value: 42.31833 },
            { inverterOriginalName:"C",inverterFormattedName: "Inverter_3", value: 49.03667 },
            { inverterOriginalName:"D",inverterFormattedName: "Inverter_4", value: 47.44667 },
        ],
        dayNight: "Day",
    }
];
