import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useMobileFormsContext } from "../hooks/useMobileFormsContext";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const MobileFormInputs = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
  } = useMobileFormsContext();

  const { t } = useTranslation();

  const statuses = [
    { value: "all", label: t("mobile_forms.all") },
    { value: "draft", label: t("mobile_forms.draft") },
    { value: "sent", label: t("mobile_forms.sent") },
    { value: "assigned", label: t("mobile_forms.assigned") },
  ];

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-3 w-full">
        {/* Input con icono */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("mobile_forms.search_placeholder") || "Buscar formularios..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        {/* Select de estados */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-10 flex-1 w-full">
            <SelectValue placeholder={t("mobile_form.state")} />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
