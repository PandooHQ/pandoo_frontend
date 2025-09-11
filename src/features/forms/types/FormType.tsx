export interface FormType {
  id: number
  title: string
  description: string
  status: "published" | "draft" | "archived"
  createdAt: string
  responses: number
  lastModified: string 
}
