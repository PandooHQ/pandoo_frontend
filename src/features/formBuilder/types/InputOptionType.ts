import type { LucideIcon } from "lucide-react";

export interface InputOptionType {
    id: string;
    label: string;
    icon: LucideIcon;
    className?: string;
    type: string
}