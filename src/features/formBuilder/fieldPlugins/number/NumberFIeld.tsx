import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import type { ItemType } from "../../types/ItemType";

interface NumberFieldProps {
  id: string;
  required?: boolean;
  updateField?: (updates: Partial<ItemType>) => void;
}

export function NumberField({ id, required, updateField }: NumberFieldProps) {
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
          Campo numero
        </span>
    </div>
  );
}
