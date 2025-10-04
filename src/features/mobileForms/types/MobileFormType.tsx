export interface MobileForm {
  id: number;
  updated_at: string;
  status: Status;
  title: string;
}

export type Status = "sent" | "draft" | "assigned";
