"use client"

import { ColumnDef, Column } from "@tanstack/react-table"
import { CellContext } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react"
import { inverterFormattedNamesSample } from "./data"
import { DataTableColumnHeader } from "@/components/raw-data-table/column-header"
import { SiteHourlyData } from "@/lib/definitions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const StatusIcon = ( {status} : {status: string} ) => {
  const tooltipMessages: Record<string, string> = {
    "A": "No issues, no changes",
    "B": "Issues, auto-corrected",
    "C": "Issues, auto-corrected, manual investigation required",
    "D": "Unprocessed"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center justify-center">
            {status === 'A' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === 'B' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
            {status === 'C' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {status === 'D' && <AlertTriangle className="h-5 w-5 text-black-500" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipMessages[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


export const getColumns = (selectedMode: string): ColumnDef<SiteHourlyData>[] => {
  const getInverterValue = (inverter: any, mode: string) => {
    switch (mode) {
      case 'original':
        return inverter?.value;
      case 'auto-processed':
        return inverter?.processed_value;
      case 'expected':
        return inverter?.expected_value;
      default:
        return inverter?.value;
    }
  };

  const columns: ColumnDef<SiteHourlyData>[] = [
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
        // cell: (info) => new Date(info.getValue() as string).toLocaleString(), // Format the timestamp as readable date-time
        cell: (info) => {
          const timestamp = info.getValue() as string;
          const [datePart, timePart] = timestamp.split('T');
          const timeOnly = timePart.split('.')[0];  // Remove milliseconds if present
          const [hours, minutes] = timeOnly.split(':');
          return `${datePart} ${hours}:${minutes}`;
        }
    },
    {
        accessorKey: "POA_Irradiance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="POA Irradiance" />
        ),
        cell: (info) => info.getValue() || "N/A",
          
    },
    {
        accessorKey: "meter_Power",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Meter Power" />
        ),
        cell: (info) => info.getValue() || "N/A",
    },
    // Dynamically create columns for each inverter
    ...inverterFormattedNamesSample.map((inverterName) => ({
        id: inverterName,
        header: ({ column }: { column: Column<SiteHourlyData, unknown> }) => (
          <DataTableColumnHeader column={column} title={inverterName} />
        ),
        accessorFn: (row: SiteHourlyData) => {
          // row.inverters.find((i) => i.inverter_name === inverterName)?.value,
          const inverter = row.inverters.find((i) => i.inverter_name === inverterName);
          return getInverterValue(inverter, selectedMode);
        },
        cell: (info: CellContext<SiteHourlyData, unknown>) => info.getValue() || "N/A",
    })),
  ];

  if (selectedMode === 'auto-processed' || selectedMode === 'expected') {
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
      cell: (info) => <StatusIcon status={info.getValue() as string}/>,
      
    });

    
  }

  

  return columns;

} 