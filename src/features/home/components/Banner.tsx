import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-40 h-40 md:w-20 md:h-20 rounded-lg flex items-center justify-center"> 
          <img src="/LogoPandoo.png" alt="Pandoo Logo" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-balance">
            {t("home.banner.welcomeTitle")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("home.banner.subtitle")}
          </p>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
        {t("home.banner.description")}
      </p>
    </div>
  );
}
