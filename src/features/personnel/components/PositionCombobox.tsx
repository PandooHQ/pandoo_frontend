import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"
import type { CreatePositionInput, Position } from "@/shared/types/PositionsContextType"
import { toast } from "sonner"


export function PositionCombobox({ positions, onSelect, createPositions }: { 
  positions: Position[], 
  onSelect: (position: Position | null) => void,
  createPositions: (userData: CreatePositionInput) => Promise<Position>
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchValue, setSearchValue] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const selectedPosition = positions.find((pos) => pos.name === value)

  const handleCreatePosition = async () => {
    if (!searchValue.trim()) return
    
    setIsCreating(true)
    try {
      const newPosition = await createPositions({ name: searchValue.trim() })
      
      setValue(newPosition.name)
      onSelect(newPosition)
      setOpen(false)
      setSearchValue("")
      toast.success(`Cargo "${searchValue}" creado`)
    } catch (error) {
      console.error("Error al crear posición:", error)
      toast.error("Error al crear cargo")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPosition ? selectedPosition.name : "Seleccionar cargo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar cargo..." 
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                No encontrado.  
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 w-full"
                  onClick={handleCreatePosition}
                  disabled={isCreating || !searchValue.trim()}
                >
                  {isCreating ? "Creando..." : `➕ Crear "${searchValue}"`}
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {positions.map((pos) => (
                <CommandItem
                  key={pos.id}
                  value={pos.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue)
                    setOpen(false)
                    onSelect(pos)
                    setSearchValue("")
                  }}
                >
                  {pos.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === pos.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}