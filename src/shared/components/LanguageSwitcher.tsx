import { useTranslation } from "react-i18next"

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en"
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
    >
      {i18n.language === "en" ? "Español" : "English"}
    </button>
  )
}
