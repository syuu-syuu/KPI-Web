import TableModeSelector from './table-mode-selector';
import DatePickerWithRange  from '@/components/date-picker'
import { DataTableFilters } from './filters';
import { Table } from '@tanstack/react-table';
import { SiteHourlyData } from '@/lib/definitions';
import { DateRange } from 'react-day-picker';

interface DataTableToolbarProps {
  site_id: string;
  handleDateRangeChange: (dateRange: DateRange) => void;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  table: Table<SiteHourlyData>;
}

export const DataTableToolbar = ({site_id, handleDateRangeChange, selectedMode, setSelectedMode, table}: DataTableToolbarProps) => {
  return (
    <>
      <div className="flex mt-6 mb-6 space-x-6 justify-between" > 
        <DatePickerWithRange site_id = {site_id} onDateRangeChange={handleDateRangeChange}/>
        <TableModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      </div>             

      <div className='mt-2 mb-6'>
        <DataTableFilters table={table} selectedMode={selectedMode}/>
      </div>
    </>
  )
}