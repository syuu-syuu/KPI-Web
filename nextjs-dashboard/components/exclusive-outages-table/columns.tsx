"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellContext } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export interface ExclusiveOutageData {
    start_time: string; // ISO string format for date and time
    end_time: string;   // ISO string format for date and time
    impacted_inverters: number[]; // array of impacted inverter IDs
}

export const columns: ColumnDef<ExclusiveOutageData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "start_time",
        header: "Start Time",
        cell: (info) => new Date(info.getValue() as string).toLocaleString(), // Format the start_time as readable date-time
    },
    {
        accessorKey: "end_time",
        header: "End Time",
        cell: (info) => new Date(info.getValue() as string).toLocaleString(), // Format the end_time as readable date-time
    },
    {
        accessorKey: "impacted_inverters",
        header: "Impacted Inverter IDs",
        cell: (info) => (info.getValue() as number[]).join(", "), // Display inverter IDs as a comma-separated list
    },
];