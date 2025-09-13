import type { UniqueIdentifier } from "@dnd-kit/core";
import type { ItemType } from "./ItemType";

export interface SectionType{
    id: UniqueIdentifier,
    title: string, 
    items: ItemType[]
}