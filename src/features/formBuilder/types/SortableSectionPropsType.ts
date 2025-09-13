import type { UniqueIdentifier } from "@dnd-kit/core";

export interface SortableSectionProps {
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  isSortingContainer: boolean;
  removeSection: (id:UniqueIdentifier)=> void;
  updateSection: (id:UniqueIdentifier, title:string)=>void
}