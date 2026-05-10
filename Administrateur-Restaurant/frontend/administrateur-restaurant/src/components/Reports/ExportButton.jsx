import { FileDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/ExportButton.css'

export default function ExportButton({ onClick, disabled, exporting }) {
  const { t } = useTranslation()

  return (
    <button
      className="export-btn"
      onClick={onClick}
      disabled={disabled}
    >
      <FileDown size={15} strokeWidth={2.5} />
      <span className="btn-label">
        {exporting ? t('reports_module.export_generating') : t('reports_module.export_pdf')}
      </span>
    </button>
  )
}
