import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function GettingStarted() {
  const { t } = useTranslation();

  const steps = [
    { id: "1", to: "forms/blank" },
    { id: "2", to: "personnel" },
    { id: "3", to: "dashboard" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("home.gettingStarted.title")}</CardTitle>
        <CardDescription>{t("home.gettingStarted.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 lg:grid-cols-3">
          {steps.map(({ id, to }) => (
            <div key={id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600">{id}</span>
              </div>
              <div>
                <h4 className="font-medium">
                  {t(`home.gettingStarted.steps.${id}.title`)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t(`home.gettingStarted.steps.${id}.text`)}
                </p>
                <Link
                  to={to}
                  className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
                >
                  {t(`home.gettingStarted.steps.${id}.link`)}{" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
