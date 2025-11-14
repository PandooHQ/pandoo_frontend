import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import type { ItemOption, ItemType } from "../../types/ItemType";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SelectFieldProps {
  id: string;
  required?: boolean;
  updateField?: (updates: Partial<ItemType>) => void;
  updateOption?: (
    optId: number,
    updates: Partial<{
      label: string;
      value: string;
    }>
  ) => void;
  removeOption?: (optId: number) => void;
  addOption?: () => void;
  options?: ItemOption[] | undefined;
}

export function SelectField({
  id,
  required,
  updateField,
  updateOption,
  removeOption,
  addOption,
  options,
}: SelectFieldProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id={`required-${id}`}
          checked={required}
          onCheckedChange={(checked) => updateField?.({ required: checked })}
          onClick={(e) => e.stopPropagation()}
        />
        <Label htmlFor={`required-${id}`} className="text-xs">
          Requerido
        </Label>
        <span className="text-xs text-muted-foreground capitalize">
          Campo Seleccionar
        </span>
      </div>
      <div className="space-y-2 pl-6 border-l border-gray-200">
        {(options ?? []).map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <Input
              value={opt.label}
              placeholder="Etiqueta"
              className="flex-1 text-xs"
              onChange={(e) => updateOption?.(opt.id, { label: e.target.value })}
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                removeOption?.(opt.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            addOption?.();
          }}
        >
          <Plus className="h-3 w-3 mr-1" /> Añadir opción
        </Button>
      </div>
    </>
  );
}
