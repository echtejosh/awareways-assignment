"use client"

import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DatePickerProps = {
  date?: Date
  onSelect: (date: Date | undefined) => void
  time: string
  onTimeChange: (time: string) => void
  className?: string
  placeholder?: string
  id?: string
}

const HOURS = Array.from({ length: 24 }, (_, index) =>
  `${index}`.padStart(2, "0")
)

const MINUTES = Array.from({ length: 60 }, (_, index) =>
  `${index}`.padStart(2, "0")
)

export function DatePicker({
  date,
  onSelect,
  time,
  onTimeChange,
  className,
  placeholder = "Pick a date",
  id,
}: DatePickerProps) {
  const [hours, minutes] = normalizeTime(time)

  function handleHourChange(nextHour: string) {
    onTimeChange(`${nextHour}:${minutes}`)
  }

  function handleMinuteChange(nextMinute: string) {
    onTimeChange(`${hours}:${nextMinute}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          data-empty={!date}
          className={cn(
            "h-9 w-[212px] justify-between rounded-md border-transparent text-left font-normal shadow-none data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          {date ? (
            `${format(date, "PPP")} ${time}`
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-3 p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            defaultMonth={date}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 px-1 pb-1">
            <Select value={hours} onValueChange={handleHourChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent align="start">
                {HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={minutes} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent align="start">
                {MINUTES.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function normalizeTime(value: string): [string, string] {
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value.split(":") as [string, string]
  }

  return ["00", "00"]
}
