"use client"

import { ColumnDef, Column } from "@tanstack/react-table"
import { CellContext } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { inverterFormattedNamesSample } from "./data"
import { DataTableColumnHeader } from "@/components/raw-data-table/column-header"
import { SiteMonthlyData } from "@/lib/definitions"

export const getColumns = (selectedMode: string): ColumnDef<SiteMonthlyData>[] => {
  const columns: ColumnDef<SiteMonthlyData>[] = [
    {
        accessorKey: "is_day",
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
        accessorKey: "POA_Irradiance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="POA Irradiance" />
        ),
        cell: (info) => {
          const value = info.getValue() as number;
          return value !== undefined && value !== null ? value.toFixed(6) : "N/A"; // Use "N/A" or any placeholder for undefined values
        },
        // cell: (info) => {
        //   const value = parseFloat(info.getValue() as string); // Convert string to a number
        //   return !isNaN(value) ? value.toFixed(6) : "N/A"; // Check if it's a valid number
        // },
        // cell: (info) => (info.getValue() as number).toFixed(6), // 6 decimal places
    },
    {
        accessorKey: "meter_Power",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Meter Power" />
        ),
        cell: (info) => {
          const value = info.getValue() as number;
          return value !== undefined && value !== null ? value.toFixed(6) : "N/A"; // Use "N/A" or any placeholder for undefined values
        },
        // cell: (info) => {
        //   const value = parseFloat(info.getValue() as string); // Convert string to a number
        //   return !isNaN(value) ? value.toFixed(6) : "N/A"; // Check if it's a valid number
        // },
        // cell: (info) => info.getValue() !== null ? (info.getValue() as number).toFixed(6) : "N/A", // 6 decimal places or display "N/A"
    },
    // Dynamically create columns for each inverter
    ...inverterFormattedNamesSample.map((inverterName) => ({
        id: inverterName,
        header: ({ column }: { column: Column<SiteMonthlyData, unknown> }) => (
          <DataTableColumnHeader column={column} title={inverterName} />
        ),
        accessorFn: (row: SiteMonthlyData) => 
        row.inverters.find((i) => i.inverter_name === inverterName)?.value,
        cell: (info: CellContext<SiteMonthlyData, unknown>) => {
    const value = info.getValue();

    // Check if the value is a number and is not NaN before applying toFixed
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(6); // Format the number to 6 decimal places
    } else {
      return "N/A"; // Return a fallback value for non-numeric data
    }
  },
        // cell: (info: CellContext<SiteMonthlyData, unknown>) => 
        //     info.getValue() !== null ? (info.getValue() as number).toFixed(6) : "N/A", 
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
        return info.row.original.POA_Irradiance > 0 ? "Active" : "Inactive";
      },
    });
  }

  return columns;

} 