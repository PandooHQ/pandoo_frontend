// DatePicker.tsx
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Label } from "@/shared/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"

interface Props {
  title: string
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ title, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {title}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {value ? selectedDate?.toLocaleDateString("es-ES") : "Selecciona una fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) {
                onChange("")
                setOpen(false)
                return
              }
              const formatted = date.toLocaleDateString("en-CA") 
              onChange(formatted)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
