import type { SectionType } from "@/features/formBuilder/types/SectionType"

export interface FormType {
  id: number;
  title: string;
  sections?: SectionType[];
  description?: string;
  status?: "published" | "draft";
  created_at?: string;
  responses?: number;
  lastModified?: string;
}
