import { cn } from "@/shared/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import type { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

export const ClonableItem = forwardRef<HTMLDivElement, { id: string; label: string; type: string; icon?: LucideIcon; className?: string }>(
  (props, ref) => {
    const { id, label, type, icon: Icon, className, ...rest } = props;
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id,
      data: { label, type, isFromMenu: true, icon: Icon },
    });

    const setRefs = (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else (ref as any).current = node;
    };

    return (
      <div
        ref={setRefs}
        {...attributes}
        {...listeners}
        {...rest}
        className={cn(
          "flex items-center w-full rounded-md border px-3 py-2 text-sm shadow-sm cursor-grab transition bg-white hover:bg-muted",
          isDragging && "opacity-50",
          className
        )}
        style={{ transform: "none" }}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {label}
      </div>
    );
  }
);
