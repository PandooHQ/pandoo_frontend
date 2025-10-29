import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItemType } from "../../types/ItemType";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Grip, Plus } from "lucide-react";
import { defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { createEditor, type SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";
import {$generateHtmlFromNodes} from '@lexical/html';
import { nodes } from '../../../../components/blocks/editor-00/nodes';

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState
 

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
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue) 

  useEffect(() => {
    const editor = createEditor({ nodes }); // asegúrate de pasar los nodos
    editor.setEditorState(editor.parseEditorState(editorState));

    editor.update(() => {
      const html = $generateHtmlFromNodes(editor);
      console.log("HTML generado:", html);
    });
  }, [editorState]);


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

  useEffect(() => {
    console.log("Render item id:", item.id);
  }, [item.id]);

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
        <Grip
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
      
      {item.type === "instruction" && (
            <div className="flex w-full">
              <div
                style={{
                  width: "680px",       
                  minHeight: "120px", 
                  maxHeight: "300px", 
                  overflow: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                <Editor
                  editorSerializedState={editorState}
                  onSerializedChange={(value) => setEditorState(value)}
                />
              </div>
            </div>
          )}
      <div className="flex items-center space-x-2">
          <Switch
            id={`required-${item.id}`}
            checked={item.required}
            onCheckedChange={(checked) => updateField({ required: checked })}
            onClick={(e) => e.stopPropagation()}
          />
          <Label htmlFor={`required-${item.id}`} className="text-xs">
            Requerido
          </Label>
          <span className="text-xs text-muted-foreground capitalize">
            {item.type === "instructions"
              ? "Bloque de instrucciones"
              : item.type === "signature"
                ? "Campo de firma"
                : item.type === "select"
                  ? "Campo de selección"
                  : item.type === "number"
                    ? "Campo numerico"
                    : item.type === "text"
                      ? "Campo de texto"
                      : item.type === "date"
                        ? "Campo fecha"
                        : item.type === "instruction"
                          ? "Campo instrucciones" 
                          :`Campo ${item.type}`}
          </span>
      </div>

      {(item.type === "select" || item.type === "checkbox") && (
        <div className="space-y-2 pl-6 border-l border-gray-200">
          {(item.options ?? []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <Input
                value={opt.label}
                placeholder="Etiqueta"
                className="flex-1 text-xs"
                onChange={(e) =>
                  updateOption(opt.id, { label: e.target.value })
                }
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(opt.id);
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
              addOption();
            }}
          >
            <Plus className="h-3 w-3 mr-1" /> Añadir opción
          </Button>
        </div>
      )}
    </div>
  );
}
