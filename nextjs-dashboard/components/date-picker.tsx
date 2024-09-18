"use client"
import { useState, useEffect } from 'react'
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { fetchAvailableTimeRange } from "@/lib/api"
import { extend } from 'leaflet'
// import { useSitePageContext } from "@/contexts/SitePageContext"
import { loadTimeRange } from "@/lib/data"

// const { site_id } = useSitePageContext();
interface DatePickerWithRangeProp extends React.HTMLAttributes<HTMLDivElement> {
  site_id: string;
  onDateRangeChange: (newDateRange: DateRange) => void;
}

const DatePickerWithRange = ({ site_id, onDateRangeChange} : DatePickerWithRangeProp) => {
  const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2023, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
  });
  

  useEffect(() => { 
    async function loadInitialTimeRange() {
    try {
      const availableDateRange = await loadTimeRange(site_id)
      setDate(availableDateRange)   
    } catch (error) {
      console.error("Error fetching available time range:", error);
    }
  }
  loadInitialTimeRange();
  }, [site_id]);

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    if (newDateRange && newDateRange.from && newDateRange.to) {
      onDateRangeChange(newDateRange); // Notify parent with the new selected date range
    }
  };
 
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerWithRange