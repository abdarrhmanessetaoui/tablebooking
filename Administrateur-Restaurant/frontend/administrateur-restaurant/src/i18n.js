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
      "collapse": "Collapse",

      "dashboard_title": "Dashboard",
      "today": "Today",
      "tomorrow": "Tomorrow",
      "this_month": "This Month",
      "export_pdf": "Export PDF",
      "exporting": "Exporting...",
      "loading": "Loading...",
      "error_loading": "Error loading",
      "error_prefix": "Error",
      "confirmed_plural": "Confirmed",
      "pending_plural": "Pending",
      "cancelled_plural": "Cancelled",
      "reservation": "reservation",
      "reservation_plural": "reservations",
      "no_reservations": "No reservations",
      "reservations_will_appear_here": "Reservations will appear here",
      "view_all_reservations_period": "All reservations — {{period}}",
      "date": "Date",
      "name": "Name",
      "time": "Time",
      "guests": "Guests",
      "service": "Service",
      "status": "Status",
      "count_persons": "{{count}} persons",
      "status_confirmed": "Confirmed",
      "status_pending": "Pending",
      "status_cancelled": "Cancelled"
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
      "collapse": "Réduire",

      "dashboard_title": "Tableau de bord",
      "today": "Aujourd'hui",
      "tomorrow": "Demain",
      "this_month": "Ce mois",
      "export_pdf": "Exporter PDF",
      "exporting": "Export…",
      "loading": "Chargement...",
      "error_loading": "Erreur de chargement",
      "error_prefix": "Erreur ",
      "confirmed_plural": "Confirmées",
      "pending_plural": "En attente",
      "cancelled_plural": "Annulées",
      "reservation": "réservation",
      "reservation_plural": "réservations",
      "no_reservations": "Aucune réservation",
      "reservations_will_appear_here": "Les réservations apparaîtront ici",
      "view_all_reservations_period": "Toutes les réservations — {{period}}",
      "date": "Date",
      "name": "Nom",
      "time": "Heure",
      "guests": "Personnes",
      "service": "Service",
      "status": "Statut",
      "count_persons": "{{count}} personnes",
      "status_confirmed": "Confirmée",
      "status_pending": "En attente",
      "status_cancelled": "Annulée"
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
      "collapse": "تصغير",

      "dashboard_title": "لوحة القيادة",
      "today": "اليوم",
      "tomorrow": "غداً",
      "this_month": "هذا الشهر",
      "export_pdf": "تصدير PDF",
      "exporting": "جارٍ التصدير...",
      "loading": "جاري التحميل...",
      "error_loading": "خطأ في التحميل",
      "error_prefix": "خطأ",
      "confirmed_plural": "مؤكدة",
      "pending_plural": "قيد الانتظار",
      "cancelled_plural": "ملغاة",
      "reservation": "حجز",
      "reservation_plural": "حجوزات",
      "no_reservations": "لا توجد حجوزات",
      "reservations_will_appear_here": "ستظهر الحجوزات هنا",
      "view_all_reservations_period": "جميع الحجوزات — {{period}}",
      "date": "التاريخ",
      "name": "الاسم",
      "time": "الوقت",
      "guests": "الأشخاص",
      "service": "الخدمة",
      "status": "الحالة",
      "count_persons": "{{count}} شخص",
      "status_confirmed": "مؤكدة",
      "status_pending": "قيد الانتظار",
      "status_cancelled": "ملغاة"
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
