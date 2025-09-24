export const Status = {
  Completed: "completed",
  Pending: "in_progress"
} as const;

export type Status = typeof Status[keyof typeof Status];

export interface MobileForm {
  id: number;
  created_at: string;
  status: Status;
  title: string;
  type: string
}
