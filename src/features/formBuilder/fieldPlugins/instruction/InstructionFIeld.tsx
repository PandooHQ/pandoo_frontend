/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@/components/blocks/editor-00/editor";
import { useCallback, useMemo } from "react";
import { createInitialEditorState } from "../../hooks/lexicalHelpers";
import type { SerializedEditorState } from "lexical";
import type { ItemType } from "../../types/ItemType";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

interface InstructionFieldProps {
  id: string;
  description?: string;
  image_data?: {
    filename: string;
    content_type: string;
  };
  imageUrl?: string;
  onUpdate: (id: string, updates: Partial<ItemType>) => void;
  updateField?: (updates: Partial<ItemType>) => void;
  required?: boolean;
}

export const InstructionFIeld = ({
  id,
  description,
  image_data,
  imageUrl,
  onUpdate,
  updateField,
  required,
}: InstructionFieldProps) => {
  const initialEditorState = useMemo(() => {
    const imgSrc = imageUrl || image_data?.filename;
    return createInitialEditorState(description, imgSrc);
  }, [description, imageUrl, image_data]);

  const handleEditorChange = useCallback(
    (editorSerializedState: SerializedEditorState) => {
      const root = editorSerializedState.root;
      let textContent = "";
      const images: string[] = [];

      root.children.forEach((child: any) => {
        if (child.type === "paragraph" && child.children) {
          child.children.forEach((node: any) => {
            if (node.type === "text") {
              textContent += node.text;
            } else if (node.type === "image") {
              images.push(node.src);
            }
          });
        }
      });

      const htmlDescription = textContent.trim() ? `<p>${textContent}</p>` : "";

      const updates: Partial<ItemType> = {
        description: htmlDescription,
      };

      if (images.length > 0) {
        updates.image_data = {
          filename: images[0],
          content_type: "image/png",
        };
        updates.imageUrl = images[0];
      } else {
        updates.image_data = {
          filename: "",
          content_type: "",
        };
        updates.imageUrl = "";
      }

      if (
        description !== htmlDescription ||
        (imageUrl || image_data?.filename) !== (images[0] || "")
      ) {
        onUpdate(id, updates);
      }
    },
    [id, description, imageUrl, image_data, onUpdate]
  );
  return (
    <>
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
            editorSerializedState={initialEditorState}
            onSerializedChange={handleEditorChange}
          />
        </div>
      </div>
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
          Campos instrucciones
        </span>
      </div>
    </>
  );
};
