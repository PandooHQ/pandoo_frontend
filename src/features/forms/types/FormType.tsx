import type { SectionType } from "@/features/formBuilder/types/SectionType"

export interface FormType {
  id: number;
  title: string;
  sections?: SectionType[];
  description?: string;
  status?: "published" | "draft";
  createdAt?: string;
  responses?: number;
  lastModified?: string;
}
