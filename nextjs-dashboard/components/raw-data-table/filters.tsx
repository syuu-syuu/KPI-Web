import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/raw-data-table/view-options"
import { DataTableFacetedFilter } from "@/components/raw-data-table/faceted-filter"
import { STATUS_OPTIONS, DAY_NIGHT_OPTIONS } from '@/lib/definitions';

interface DataTableFiltersProps<TData> {
  table: Table<TData>;
  selectedMode: string; 
}

export function DataTableFilters<TData>({
  table,
  selectedMode,
}: DataTableFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("is_day") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_day")}
            title="Day/Night"
            options={DAY_NIGHT_OPTIONS}
          />
        )}
        {selectedMode !== 'original' && table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={STATUS_OPTIONS}
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