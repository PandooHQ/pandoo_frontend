/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItemType } from "../../types/ItemType";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { FormFieldRenderer } from "../../fieldPlugins";

type SortableItemProps = {
  item: ItemType;
  disabled?: boolean;
  onUpdate: (id: string, updates: Partial<ItemType>) => void;
  onRemove: (id: string) => void;
  section: UniqueIdentifier;
  setSelectedSection: (itemId: UniqueIdentifier) => void;
  setSelectedInput?: (itemId: UniqueIdentifier) => void;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function SortableItem({
  item,
  disabled,
  onUpdate,
  onRemove,
  section,
  setSelectedSection,
  setSelectedInput,
}: SortableItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled,
    animateLayoutChanges,
  });

  const updateField = (updates: Partial<ItemType>) => {
    onUpdate(item.id, updates);
  };

  const addOption = () => {
    const newOption = {
      id: Date.now(),
      label: "Nueva opción",
    };
    updateField({ options: [...(item.options ?? []), newOption] });
  };

  const updateOption = (
    optId: number,
    updates: Partial<{ label: string; value: string }>
  ) => {
    updateField({
      options: (item.options ?? []).map((opt) =>
        opt.id === optId ? { ...opt, ...updates } : opt
      ),
    });
  };

  const removeOption = (optId: number) => {
    updateField({
      options: (item.options ?? []).filter((opt) => opt.id !== optId),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: transition ?? "transform 200ms ease, opacity 200ms ease",
        opacity: isDragging ? 0.5 : 1,
        background: "#fff",
        padding: "8px 12px",
        margin: "4px 0",
        borderRadius: "8px",
        border: "1px solid #ddd",
        boxShadow: isDragging ? "0 4px 10px rgba(0,0,0,0.1)" : undefined,
      }}
      {...attributes}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <GripVertical
          className="h-4 w-4 cursor-grab text-muted-foreground"
          {...listeners}
        />

        <Input
          value={item.label}
          onChange={(e) => updateField({ label: e.target.value })}
          placeholder="Etiqueta del campo"
          className="flex-1 text-sm mr-2"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSection(section);
            setSelectedInput?.(item.id);
          }}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <FormFieldRenderer
        item={item}
        updateField={updateField}
        updateOption={updateOption}
        removeOption={removeOption}
        addOption={addOption}
        onUpdate={onUpdate}
      />
    </div>
  );
}
