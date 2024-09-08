"use client"

import { ColumnDef, Column } from "@tanstack/react-table"
import { CellContext } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { inverterFormattedNamesSample } from "./data"
import { DataTableColumnHeader } from "@/components/raw-data-table/column-header"

export interface InverterData {
    inverterOriginalName: string;
    inverterFormattedName: string;
    value: number | null;
}

export interface SiteMonthlyData {
    timestamp: string; // ISO string format for date and time
    poaIrradiance: number;
    meterPower: number | null;
    inverters: InverterData[];
    dayNight: "Day" | "Night" | "Unknown"; 
}


export const getColumns = (selectedMode: string): ColumnDef<SiteMonthlyData>[] => {
  const columns: ColumnDef<SiteMonthlyData>[] = [
    {
        accessorKey: "dayNight",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Day/Night" />
        ),
    },
    {
        accessorKey: "timestamp",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="TimeStamp" />
        ),
        cell: (info) => new Date(info.getValue() as string).toLocaleString(), // Format the timestamp as readable date-time
    },
    {
        accessorKey: "poaIrradiance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="POA Irradiance" />
        ),
        cell: (info) => (info.getValue() as number).toFixed(6), // 6 decimal places
    },
    {
        accessorKey: "meterPower",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Meter Power" />
        ),
        cell: (info) => info.getValue() !== null ? (info.getValue() as number).toFixed(6) : "N/A", // 6 decimal places or display "N/A"
    },
    // Dynamically create columns for each inverter
    ...inverterFormattedNamesSample.map((inverterName) => ({
        id: inverterName,
        header: ({ column }: { column: Column<SiteMonthlyData, unknown> }) => (
          <DataTableColumnHeader column={column} title={inverterName} />
        ),
        accessorFn: (row: SiteMonthlyData) => 
        row.inverters.find((i) => i.inverterFormattedName === inverterName)?.value,
        cell: (info: CellContext<SiteMonthlyData, unknown>) => 
            info.getValue() !== null ? (info.getValue() as number).toFixed(6) : "N/A", 
    })),
  ];

  if (selectedMode === 'auto-processed'|| "expected") {
    columns.unshift({
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
    });

    // Add the "Status" column if the mode is "auto-processed"
    columns.push({
      accessorKey: "status",
      header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
      cell: (info) => {
        // Custom logic to calculate status
        return info.row.original.poaIrradiance > 0 ? "Active" : "Inactive";
      },
    });
  }

  return columns;

} 