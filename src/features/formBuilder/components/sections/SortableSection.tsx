import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { SortableItem } from "../Items/SortableItem";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { SectionType } from "../../types/SectionType";
import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ItemType } from "../../types/ItemType";
import { useEffect, useRef, useState } from "react";

export function SortableSection({
  section,
  isSortingContainer,
  removeSection,
  updateSection,
  updateItem,
  removeItem,
  selectedSection,
  setSelectedSection,
  setSelectedInput,
}: {
  section: SectionType;
  isSortingContainer: boolean;
  removeSection: (id: UniqueIdentifier) => void;
  updateSection: (id: UniqueIdentifier, title: string) => void;
  updateItem: (itemId: string, updates: Partial<ItemType>) => void;
  removeItem: (itemId: string) => void;
  selectedSection: UniqueIdentifier | undefined;
  setSelectedSection: (itemId: UniqueIdentifier) => void;
  setSelectedInput?: (itemId: UniqueIdentifier) => void;
}) {
  const { id, title, items } = section;
  const { setNodeRef, transform, isDragging, attributes, listeners } =
    useSortable({
      id,
      data: { type: "container", children: items.map((i) => i.id) },
    });

  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string | number>(
    "auto"
  );

  useEffect(() => {
    if (contentRef.current) {
      const initialHeight = contentRef.current.getBoundingClientRect().height;
      setContainerHeight(initialHeight);
      requestAnimationFrame(() => {
        setContainerHeight("auto");
      });
    }
  }, [items.length]);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isDragging ? 0.7 : 1,
        background: id === selectedSection ? "aliceblue" : "#f9fafb",
        border: "1px solid",
        borderColor: id === selectedSection ? "#0097ff" : "#e5e7eb",
        borderRadius: "12px",
        padding: "12px",
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minHeight: items.length ? `${items.length * 64 + 80}px` : "160px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDragging ? "#e5e7eb" : "transparent",
          }}
        >
          <GripVertical size={16} color="#6b7280" />
        </div>
        <Input
          value={title}
          onChange={(e) => updateSection(id, e.target.value)}
          placeholder="Título de la sección"
          className="flex-1 font-medium"
          onClick={(e) => {
            setSelectedSection(id);
            e.stopPropagation();
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            removeSection(id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={contentRef}
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            height: containerHeight,
            transition: "height 500ms ease-in-out",
          }}
          className="flex flex-col gap-2"
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              disabled={isSortingContainer}
              onRemove={() => removeItem(item.id)}
              onUpdate={updateItem}
              section={section?.id}
              setSelectedSection={setSelectedSection}
              setSelectedInput={setSelectedInput}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
