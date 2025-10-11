import { Card, CardContent } from "@/shared/components/ui/card";
import type { MobileForm } from "../types/MobileFormType";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Props {
  mobileForm: MobileForm;
  onMouseEnter?: () => void;
  onClick?: () => void
}

const statusColors: Record<MobileForm["status"], string> = {
  sent: "bg-green-500 text-white",
  draft: "bg-yellow-500 text-white",
  assigned: "bg-red-500 text-white",
};

const MobileFormCard = ({ mobileForm, onMouseEnter, onClick }: Props) => {
  const { t } = useTranslation();

  const statusText = {
    sent: t("mobile_forms.sent"),
    draft: t("mobile_forms.draft"),
    assigned: t("mobile_forms.assigned"),
  }[mobileForm.status];

  return (
    <div className="relative hover:cursor-pointer" onMouseEnter={onMouseEnter} onClick={onClick}>
      <Badge
        className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium shadow-md ${statusColors[mobileForm.status]}`}
      >
        {statusText}
      </Badge>

      <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <h3 className="font-semibold text-gray-900 text-lg flex-1">
            {mobileForm.title}
          </h3>
          <div className="flex flex-row justify-between text-sm text-gray-600">
            <p>ID: {mobileForm.id}</p>
             <p>{mobileForm.updated_at}</p> 
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileFormCard;
