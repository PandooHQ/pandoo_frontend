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
import { toast } from "sonner"
import type { CreateDeparmentInput, Department, DepartmentResp } from "@/shared/types/DepartmentsContextType"

export function DepartmentCombobox({ departments, onSelect, createDepartments }: { 
  departments: Department[], 
  onSelect: (position: Department | null) => void,
  createDepartments: (userData: CreateDeparmentInput) => Promise<DepartmentResp>
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [searchValue, setSearchValue] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const selectedDepartment = departments.find((pos) => pos.name === value)

  const handleCreateDepartment = async () => {
    if (!searchValue.trim()) return
    
    setIsCreating(true)
    try {
      const response = await createDepartments({ name: searchValue.trim() })

      const newDepartment = response.data
      
      setValue(newDepartment.name)
      onSelect(newDepartment)
      setOpen(false)
      setSearchValue("")
      toast.success(`Departamento "${searchValue}" creado`)
    } catch (error) {
      console.error("Error al crear departamento:", error)
      toast.error("Error al crear departamento")
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
          {selectedDepartment ? selectedDepartment.name : "Seleccionar departamento..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar departamento..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-center">
                <p className="text-sm text-muted-foreground mb-2">No encontrado.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleCreateDepartment}
                  disabled={isCreating || !searchValue.trim()}
                >
                  {isCreating ? "Creando..." : `➕ Crear "${searchValue}"`}
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {departments
                .filter((dept) => 
                  dept.name?.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((dept) => (
                  <CommandItem
                    key={dept.id}
                    value={dept.name}
                    onSelect={() => {
                      setValue(dept.name)
                      setOpen(false)
                      onSelect(dept)
                      setSearchValue("")
                    }}
                  >
                    {dept.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === dept.name ? "opacity-100" : "opacity-0"
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