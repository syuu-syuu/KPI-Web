import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/raw-data-table/view-options"

import { DataTableFacetedFilter } from "@/components/raw-data-table/faceted-filter"

export const dayNight = [
  {
    value: "Day",
    label: "Day",
  },
  {
    value: "Night",
    label: "Night",
  },
  {
    value: "Unknown",
    label: "Unknown",
  },
]

export const statuses = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("dayNight") && (
          <DataTableFacetedFilter
            column={table.getColumn("dayNight")}
            title="Day/Night"
            options={dayNight}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}