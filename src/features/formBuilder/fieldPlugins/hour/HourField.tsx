import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import type { ItemType } from "../../types/ItemType";

interface HourFieldProps {
  id: string;
  required?: boolean;
  updateField?: (updates: Partial<ItemType>) => void;
}

export function HourField({ id, required, updateField }: HourFieldProps) {
  return (
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
          Campo Hora
        </span>
    </div>
  );
}
