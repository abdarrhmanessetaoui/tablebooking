import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "reservations": "Reservations",
      "planning": "Planning",
      "blocked_dates": "Blocked Dates",
      "services": "Services",
      "tables": "Tables",
      "reports": "Reports",
      "settings": "Settings",
      "logout": "Logout",
      "language": "Language",
      "expand": "Expand",
      "collapse": "Collapse"
    }
  },
  fr: {
    translation: {
      "dashboard": "Tableau de bord",
      "reservations": "Réservations",
      "planning": "Planning",
      "blocked_dates": "Dates bloquées",
      "services": "Services",
      "tables": "Tables",
      "reports": "Rapports",
      "settings": "Paramètres",
      "logout": "Déconnexion",
      "language": "Langue",
      "expand": "Agrandir",
      "collapse": "Réduire"
    }
  },
  ar: {
    translation: {
      "dashboard": "لوحة القيادة",
      "reservations": "الحجوزات",
      "planning": "التخطيط",
      "blocked_dates": "تواريخ محظورة",
      "services": "الخدمات",
      "tables": "الطاولات",
      "reports": "التقارير",
      "settings": "الإعدادات",
      "logout": "تسجيل خروج",
      "language": "اللغة",
      "expand": "توسيع",
      "collapse": "تصغير"
    }
  }
}

const savedLang = localStorage.getItem('lang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  })

export default i18n
