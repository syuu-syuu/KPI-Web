"use client"
import { useState } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  RowSelectionState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import TableModeSelector from './table-mode-selector';
import { DatePickerWithRange } from '@/components/date-picker'
import { get } from 'http';
import { getColumns, SiteMonthlyData } from './columns';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableToolbar } from './toolbar';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData> {
  data: TData[]
}


const DataTable= ({data}: DataTableProps<SiteMonthlyData>) => {
  const [selectedMode, setSelectedMode] = useState('original');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const columns = getColumns(selectedMode);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })


  return (
    <div>
      <div className="flex mt-6 mb-6 space-x-6" > 
        <DatePickerWithRange />
        <TableModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      </div>             

      <div className='mt-2'>
        <DataTableToolbar table={table}/>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='mt-2'>
        <DataTablePagination table={table} />
      </div>
      

  

      {(selectedMode === 'auto-processed'||"expected") && (
        <div className="flex space-x-2 mt-2 justify-end">
          <Button>Add To Ex                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 clusive Outages</Button>
          <Button>Remove From Exclusive Outages</Button>
        </div>
      )}
    </div>
  )


}

export default DataTable;

