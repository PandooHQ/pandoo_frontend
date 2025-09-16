import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export default function NotFoundPage() {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">{t("not_found.title")}</p>
      <img src="/NotFound.jpeg" />
      <Link
        to={`/${lang}/dashboard`}
        className="mt-4 rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 font-bold"
      >
        {t("not_found.button")}
      </Link>
    </div>
  );
}
