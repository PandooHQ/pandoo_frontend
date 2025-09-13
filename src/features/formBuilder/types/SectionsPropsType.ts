import type { UniqueIdentifier } from "@dnd-kit/core";
import type { SectionType } from "./SectionType";
import type { ItemType } from "./ItemType";

export interface SectionProps {
  containers: UniqueIdentifier[];
  sections: SectionType[];
  addSection: () => void;
  removeSection: (id:UniqueIdentifier) => void;
  updateSection: (id:UniqueIdentifier, title:string) => void;
  updateItem: (itemId: string, updates: Partial<ItemType>) => void;
  removeItem: (itemId: string) => void;
  isSortingContainer: boolean;
}
