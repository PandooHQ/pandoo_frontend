import { Card, CardContent } from "@/shared/components/ui/card";
import type { MobileForm } from "../types/MobileFormType";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Props {
  mobileForm: MobileForm;
}

const statusColors: Record<MobileForm["status"], string> = {
  completed: "bg-green-500 text-white",
  in_progress: "bg-blue-500 text-white",
};

const MobileFormCard = ({ mobileForm }: Props) => {
  const { t } = useTranslation();

  const statusText =
    mobileForm.status === "completed"
      ? t("mobile_forms.completed")
      : t("mobile_forms.in_progress");

  return (
    <div className="relative">
      <Badge
        className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium shadow-md ${statusColors[mobileForm.status]}`}
      >
        {statusText}
      </Badge>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-gray-900 text-lg">
            {mobileForm.title}
          </h3>

          <span className="text-sm text-gray-600">{mobileForm.created_at}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileFormCard;
