'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { CellContext } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { inverterFormattedNamesSample } from './data';
import { DataTableColumnHeader } from '@/components/raw-data-table/column-header';
import { SiteHourlyData, DataStatus} from '@/lib/definitions';
import { StatusIcon } from '@/components/status-icon';

export const getColumns = (
  selectedMode: string,
): ColumnDef<SiteHourlyData>[] => {
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
      accessorKey: 'is_day',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Day/Night" />
      ),
    },
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TimeStamp" />
      ),
      // Format the timestamp as readable date-time
      cell: (info) => {
        const timestamp = info.getValue() as string;
        const [datePart, timePart] = timestamp.split('T');
        const timeOnly = timePart.split('.')[0]; // Remove milliseconds if present
        const [hours, minutes] = timeOnly.split(':');
        return `${datePart} ${hours}:${minutes}`;
      },
    },
    {
      accessorKey: 'POA_Irradiance',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="POA Irradiance" />
      ),
      cell: (info) => info.getValue() || 'N/A',
    },
    {
      accessorKey: 'meter_Power',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Meter Power" />
      ),
      cell: (info) => info.getValue() || 'N/A',
    },

    // Dynamically create columns for each inverter
    ...inverterFormattedNamesSample.map((inverterName) => ({
      id: inverterName,
      header: ({ column }: { column: Column<SiteHourlyData, unknown> }) => (
        <DataTableColumnHeader column={column} title={inverterName} />
      ),
      accessorFn: (row: SiteHourlyData) => {
        // row.inverters.find((i) => i.inverter_name === inverterName)?.value,
        const inverter = row.inverters.find(
          (i) => i.inverter_name === inverterName,
        );
        return getInverterValue(inverter, selectedMode);
      },
      cell: (info: CellContext<SiteHourlyData, unknown>) =>
        info.getValue() || 'N/A',
    })),
  ];

  // Add checkbox and status if the mode is not "original"
  if (selectedMode !== 'original') {
    columns.unshift({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
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

    columns.push({
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: (info) => <StatusIcon status={info.getValue() as DataStatus} showTooltip={true} />,
    });
  }


  return columns;
};