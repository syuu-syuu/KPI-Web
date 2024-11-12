"use client"
import { useState, useEffect, use } from 'react'
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
import DatePickerWithRange  from '@/components/date-picker'
import { get } from 'http';
import { getColumns} from './columns';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableToolbar } from './toolbar';
import { DataTablePagination } from './pagination';
import { fetchOriginalRawData } from '@/lib/api';
import { DateRange } from "react-day-picker"
import { SiteHourlyData } from '@/lib/definitions'
import { loadTimeRange, loadOriginalRawData} from '@/lib/data';

interface DataTableProps<TData> {
  data: TData[]
  site_id: string
}

const DataTable= ({data, site_id}: DataTableProps<SiteHourlyData>) => {  
  const [selectedMode, setSelectedMode] = useState('original');
  const columns = getColumns(selectedMode);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )


  const [dateRange, setDateRange] = useState<DateRange>()
  const [originalRawData, setOriginalRawData] = useState<SiteHourlyData[]>(data)

  useEffect(() => { 
    console.log("selectedMode:", selectedMode);
    console.log("columns:", columns);
    async function loadInitialTimeRange() {
    try {
      const availableDateRange = await loadTimeRange(site_id)
      setDateRange(availableDateRange)  
    } catch (error) {
      console.error("Error fetching available time range:", error)
      ;
    }
  }
  loadInitialTimeRange();
  }, [site_id]);

  useEffect(() => { 
    async function loadTableData() {
      try {
        console.log("💙 dateRange in datepicker:", dateRange?.from,dateRange?.to); 
        const fetchedData = await loadOriginalRawData(site_id, dateRange?.from, dateRange?.to)
        setOriginalRawData(fetchedData)
      } catch (error) {
        console.error("Error fetching original raw data:", error);
      }  
    }
    loadTableData();
  }, [site_id, dateRange]);


  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
      console.log("newDateRange:", newDateRange);
      setDateRange(newDateRange);
  }
  
  const table = useReactTable({
    data: originalRawData,
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
        <DatePickerWithRange site_id = {site_id} onDateRangeChange={handleDateRangeChange}/>
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
      

      <div className="flex space-x-2 mt-2 justify-end">
        <Button disabled={selectedMode === 'original'}>
          Add To Exclusive Outages
        </Button>
        <Button disabled={selectedMode === 'original'}>
          Remove From Exclusive Outages
        </Button>
      </div>

    </div>
  )


}

export default DataTable;

