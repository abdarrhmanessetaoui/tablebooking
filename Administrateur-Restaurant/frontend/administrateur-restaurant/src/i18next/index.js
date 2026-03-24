import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// ================= TRANSLATIONS =================
const resources = {
  en: {
    translation: {
      // NAV
      dashboard: "Dashboard",
      reservations: "Reservations",
      services: "Services",
      logout: "Logout",
      language: "Language",
      expand: "Expand",
      collapse: "Collapse",
      english: "English",
      french: "French",
      arabic: "Arabic",
      loading: "Loading...",

      // TOAST
      toast: {
        reservation_created: "Reservation created for {{name}}",
        reservation_create_failed: "Unable to create reservation",
        status_updated: "Status updated successfully",
        status_update_failed: "Unable to update status",
        reservation_deleted: "Reservation deleted",
        reservation_delete_failed: "Unable to delete reservation",
        table_created: "Table {{number}} added",
        table_updated: "Table {{number}} updated",
        table_deleted: "Table {{number}} deleted",
        table_create_failed: "Unable to add table",
        table_update_failed: "Unable to update table",
        table_delete_failed: "Unable to delete table",
        table_activated: "Table {{number}} activated",
        table_deactivated: "Table {{number}} deactivated",
        table_toggle_failed: "Unable to change table status",

        // Services keys
        service_created: "Service '{{name}}' added",
        service_updated: "Service '{{name}}' updated",
        service_deleted: "Service '{{name}}' deleted",
        service_create_failed: "Unable to add service",
        service_update_failed: "Unable to update service",
        service_delete_failed: "Unable to delete service"
      },

      // CONFIRM
      confirm: {
        delete_title: "Delete reservation",
        delete_message: "Do you want to delete the reservation for {{name}}?",
        delete_sub: "This action is irreversible.",
        delete_button: "Delete",
          delete_table_title: "Delete table",
  delete_table_message: "Do you want to delete table {{number}}?",
  delete_table_sub: "This action is irreversible.",
  delete_table_button: "Delete",
        delete_service_title: "Delete service",
        delete_service_message: "Do you want to delete '{{name}}'?",
        delete_service_sub: "Existing reservations will not be affected.",
        delete_service_button: "Delete"
      },

      // COMMON
      common: {
        client: "this client"
      },

      // ERRORS
      errors: {
        load_blocked_dates: "Unable to load blocked dates",
        block_failed: "Failed to block dates",
        unblock_failed: "Failed to unblock date",
        load_reservations: "Unable to load reservations",
        fetch_reports: "Failed to load reports",
        fetch_stats: "Failed to load statistics",
        load_tables: "Unable to load tables",
        fetch_services: "Unable to load services"
      },

      // BLOCK / UNBLOCK
      block: {
        multiple_title: "Block multiple dates",
        multiple_message: "You are about to block {{count}} dates.",
        multiple_sub: "This may take some time.",
        confirm: "Confirm",
        success_one: "Date successfully blocked",
        success_many: "{{count}} dates successfully blocked"
      },
      unblock: {
        title: "Unblock date",
        message: "Do you want to unblock {{date}}?",
        confirm: "Unblock",
        success: "Date unblocked"
      },

      // DASHBOARD SUMMARY
      summary_title: "General Summary",
      summary_subtitle: "Filtered data",
      summary_total: "Total",
      summary_confirmed: "Confirmed",
      summary_pending: "Pending",
      summary_cancelled: "Cancelled",
      summary_avg_guests: "Avg. Guests",
      guests_label: "guests",

      // TABLE
      name: "Name",
      time: "Time",
      guests: "Guests",
      service: "Service",
      status: "Status",
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      no_reservations: "No reservations",
      reservations_appear_here: "Reservations will appear here",
      view_all_reservations: "View all reservations",
      all_reservations: "All reservations",

      // SERVICES
      services_subtitle: "Manage the formulas offered to clients during reservation.",
      add_service: "Add a service",
      edit_service: "Edit service",
      configured_services: "Configured services",
      price: "Price",
      capacity: "Capacity",
      duration: "Duration",
      free: "Free",

      // REPORTS
      reports_title: "Reports",
      reports_subtitle: "Complete analytics of your reservations",
      btn_export_pdf: "Export PDF",
      btn_generating: "Generating…",

      // CHARTS
      chart_hour_title: "By Hour",
      chart_hour_subtitle: "Most requested slots",
      chart_day_title: "By Day",
      chart_day_subtitle: "Busiest days",
      chart_service_title: "By Service",
      chart_service_subtitle: "Service breakdown",
      chart_guests_title: "By Guests",
      chart_guests_subtitle: "Group size",
      chart_week_title: "By Week",
      chart_week_subtitle: "Weekly activity",
      chart_month_title: "By Month",
      chart_month_subtitle: "Monthly activity",
      chart_year_title: "By Year",
      chart_year_subtitle: "Yearly history",
      chart_total: "Total",
      services_label: "services",
      no_data: "No data"
    }
  },

  fr: {
    translation: {
      dashboard: "Tableau de bord",
      reservations: "Réservations",
      services: "Services",
      logout: "Déconnexion",
      language: "Langue",
      expand: "Agrandir",
      collapse: "Réduire",
      english: "Anglais",
      french: "Français",
      arabic: "Arabe",
      loading: "Chargement...",

      toast: {
        reservation_created: "Réservation créée pour {{name}}",
        reservation_create_failed: "Impossible de créer la réservation",
        status_updated: "Statut mis à jour avec succès",
        status_update_failed: "Impossible de modifier le statut",
        reservation_deleted: "Réservation supprimée",
        reservation_delete_failed: "Impossible de supprimer la réservation",
          table_created: "Table {{number}} ajoutée",
  table_updated: "Table {{number}} modifiée",
  table_deleted: "Table {{number}} supprimée",
  table_create_failed: "Impossible d'ajouter la table",
  table_update_failed: "Impossible de modifier la table",
  table_delete_failed: "Impossible de supprimer la table",
  table_activated: "Table {{number}} activée",
  table_deactivated: "Table {{number}} désactivée",
  table_toggle_failed: "Impossible de changer le statut de la table",

        service_created: "Service '{{name}}' ajouté",
        service_updated: "Service '{{name}}' modifié",
        service_deleted: "Service '{{name}}' supprimé",
        service_create_failed: "Impossible d'ajouter le service",
        service_update_failed: "Impossible de modifier le service",
        service_delete_failed: "Impossible de supprimer le service"
      },

      confirm: {
        delete_title: "Supprimer la réservation",
        delete_message: "Voulez-vous supprimer la réservation de {{name}} ?",
        delete_sub: "Cette action est irréversible.",
        delete_button: "Supprimer",
          table_created: "Table {{number}} ajoutée",
  table_updated: "Table {{number}} modifiée",
  table_deleted: "Table {{number}} supprimée",
  table_create_failed: "Impossible d'ajouter la table",
  table_update_failed: "Impossible de modifier la table",
  table_delete_failed: "Impossible de supprimer la table",
  table_activated: "Table {{number}} activée",
  table_deactivated: "Table {{number}} désactivée",
  table_toggle_failed: "Impossible de changer le statut de la table",
        delete_service_title: "Supprimer le service",
        delete_service_message: "Voulez-vous supprimer '{{name}}' ?",
        delete_service_sub: "Les réservations existantes ne seront pas affectées.",
        delete_service_button: "Supprimer"
      },

      common: {
        client: "ce client"
      },

      errors: {
        load_blocked_dates: "Impossible de charger les dates bloquées",
        block_failed: "Impossible de bloquer les dates",
        unblock_failed: "Impossible de débloquer la date",
        load_reservations: "Impossible de charger les réservations",
        fetch_reports: "Impossible de charger les rapports",
        fetch_stats: "Impossible de charger les statistiques",
        load_tables: "Impossible de charger les tables",
        fetch_services: "Impossible de charger les services"
      },

      block: {
        multiple_title: "Bloquer plusieurs dates",
        multiple_message: "Vous allez bloquer {{count}} dates.",
        multiple_sub: "Cette action peut prendre un moment.",
        confirm: "Confirmer",
        success_one: "Date bloquée avec succès",
        success_many: "{{count}} dates bloquées avec succès"
      },
      unblock: {
        title: "Débloquer la date",
        message: "Voulez-vous débloquer {{date}} ?",
        confirm: "Débloquer",
        success: "Date débloquée"
      },

      summary_title: "Résumé général",
      summary_subtitle: "Données filtrées",
      summary_total: "Total",
      summary_confirmed: "Confirmées",
      summary_pending: "En attente",
      summary_cancelled: "Annulées",
      summary_avg_guests: "Moy. pers.",
      guests_label: "pers.",

      name: "Nom",
      time: "Heure",
      guests: "Personnes",
      service: "Service",
      status: "Statut",
      confirmed: "Confirmées",
      pending: "En attente",
      cancelled: "Annulées",
      no_reservations: "Aucune réservation",
      reservations_appear_here: "Les réservations apparaîtront ici",
      view_all_reservations: "Voir toutes les réservations",
      all_reservations: "Toutes les réservations",

      services_subtitle: "Gérez les formules proposées aux clients lors de la réservation.",
      add_service: "Ajouter un service",
      edit_service: "Modifier le service",
      configured_services: "Services configurés",
      price: "Prix",
      capacity: "Capacité",
      duration: "Durée",
      free: "Gratuit",

      reports_title: "Rapports",
      reports_subtitle: "Analytiques complètes de vos réservations",
      btn_export_pdf: "Exporter PDF",
      btn_generating: "Génération…",

      chart_hour_title: "Par heure",
      chart_hour_subtitle: "Créneaux les plus demandés",
      chart_day_title: "Par jour",
      chart_day_subtitle: "Jours les plus chargés",
      chart_service_title: "Par service",
      chart_service_subtitle: "Répartition des formules",
      chart_guests_title: "Par couverts",
      chart_guests_subtitle: "Taille des groupes",
      chart_week_title: "Par semaine",
      chart_week_subtitle: "Activité hebdomadaire",
      chart_month_title: "Par mois",
      chart_month_subtitle: "Activité mensuelle",
      chart_year_title: "Par année",
      chart_year_subtitle: "Historique annuel",
      chart_total: "Total",
      services_label: "services",
      no_data: "Aucune donnée"
    }
  },

  ar: {
    translation: {
      dashboard: "لوحة التحكم",
      reservations: "الحجوزات",
      services: "الخدمات",
      logout: "تسجيل الخروج",
      language: "اللغة",
      expand: "توسيع",
      collapse: "تصغير",
      english: "الإنجليزية",
      french: "الفرنسية",
      arabic: "العربية",
      loading: "جاري التحميل...",

      toast: {
        reservation_created: "تم إنشاء الحجز لـ {{name}}",
        reservation_create_failed: "تعذر إنشاء الحجز",
        status_updated: "تم تحديث الحالة بنجاح",
        status_update_failed: "تعذر تحديث الحالة",
        reservation_deleted: "تم حذف الحجز",
        reservation_delete_failed: "تعذر حذف الحجز",
          table_created: "تمت إضافة الطاولة {{number}}",
  table_updated: "تم تعديل الطاولة {{number}}",
  table_deleted: "تم حذف الطاولة {{number}}",
  table_create_failed: "تعذر إضافة الطاولة",
  table_update_failed: "تعذر تعديل الطاولة",
  table_delete_failed: "تعذر حذف الطاولة",
  table_activated: "تم تفعيل الطاولة {{number}}",
  table_deactivated: "تم تعطيل الطاولة {{number}}",
  table_toggle_failed: "تعذر تغيير حالة الطاولة",

        service_created: "تمت إضافة الخدمة '{{name}}'",
        service_updated: "تم تعديل الخدمة '{{name}}'",
        service_deleted: "تم حذف الخدمة '{{name}}'",
        service_create_failed: "تعذر إضافة الخدمة",
        service_update_failed: "تعذر تعديل الخدمة",
        service_delete_failed: "تعذر حذف الخدمة"
      },

      confirm: {
        delete_title: "حذف الحجز",
        delete_message: "هل تريد حذف الحجز الخاص بـ {{name}}؟",
        delete_sub: "هذا الإجراء لا يمكن التراجع عنه.",
        delete_button: "حذف",
          delete_table_title: "حذف الطاولة",
  delete_table_message: "هل تريد حذف الطاولة {{number}}؟",
  delete_table_sub: "هذا الإجراء لا يمكن التراجع عنه.",
  delete_table_button: "حذف",

        delete_service_title: "حذف الخدمة",
        delete_service_message: "هل تريد حذف '{{name}}'؟",
        delete_service_sub: "لن تتأثر الحجوزات الموجودة.",
        delete_service_button: "حذف"
      },

      common: {
        client: "هذا العميل"
      },

      errors: {
        load_blocked_dates: "تعذر تحميل التواريخ المحجوزة",
        block_failed: "فشل في حظر التواريخ",
        unblock_failed: "فشل في إلغاء الحظر",
        load_reservations: "تعذر تحميل الحجوزات",
        fetch_reports: "فشل في تحميل التقارير",
        fetch_stats: "فشل في تحميل الإحصائيات",
        fetch_services: "تعذر تحميل الخدمات",
        load_tables: "تعذر تحميل الطاولات"
      },

      block: {
        multiple_title: "حظر عدة تواريخ",
        multiple_message: "أنت على وشك حظر {{count}} تواريخ",
        multiple_sub: "قد تستغرق هذه العملية بعض الوقت",
        confirm: "تأكيد",
        success_one: "تم حظر التاريخ بنجاح",
        success_many: "تم حظر {{count}} تواريخ بنجاح"
      },
      unblock: {
        title: "إلغاء حظر التاريخ",
        message: "هل تريد إلغاء حظر {{date}}؟",
        confirm: "إلغاء الحظر",
        success: "تم إلغاء الحظر"
      },

      summary_title: "الملخص العام",
      summary_subtitle: "البيانات المفلترة",
      summary_total: "المجموع",
      summary_confirmed: "تم التأكيد",
      summary_pending: "قيد الانتظار",
      summary_cancelled: "ملغاة",
      summary_avg_guests: "متوسط الضيوف",
      guests_label: "ضيوف",

      name: "الاسم",
      time: "الوقت",
      guests: "الضيوف",
      service: "الخدمة",
      status: "الحالة",
      confirmed: "تم التأكيد",
      pending: "قيد الانتظار",
      cancelled: "ملغاة",
      no_reservations: "لا توجد حجوزات",

      services_subtitle: "إدارة الصيغ المقدمة للعملاء أثناء الحجز.",
      add_service: "إضافة خدمة",
      edit_service: "تعديل الخدمة",
      configured_services: "الخدمات المُعدة",
      price: "السعر",
      capacity: "القدرة الاستيعابية",
      duration: "المدة",
      free: "مجاني",

      reports_title: "التقارير",
      reports_subtitle: "التحليلات وملخصات الحجوزات",
      btn_export_pdf: "تصدير PDF",
      btn_generating: "جارٍ الإنشاء…",

      chart_hour_title: "حسب الساعة",
      chart_hour_subtitle: "أكثر الفترات طلباً",
      chart_day_title: "حسب اليوم",
      chart_day_subtitle: "أكثر الأيام ازدحاماً",
      chart_service_title: "حسب الخدمة",
      chart_service_subtitle: "تفصيل الخدمات",
      chart_guests_title: "حسب الضيوف",
      chart_guests_subtitle: "حجم المجموعة",
      chart_week_title: "حسب الأسبوع",
      chart_week_subtitle: "النشاط الأسبوعي",
      chart_month_title: "حسب الشهر",
      chart_month_subtitle: "النشاط الشهري",
      chart_year_title: "حسب السنة",
      chart_year_subtitle: "السجل السنوي",
      chart_total: "المجموع",
      services_label: "الخدمات",
      no_data: "لا توجد بيانات"
    }
  }
}

// ================= INIT I18N =================
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18n