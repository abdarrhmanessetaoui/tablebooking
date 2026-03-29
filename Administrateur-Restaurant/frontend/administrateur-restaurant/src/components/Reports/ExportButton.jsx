import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import '../../styles/Reports/ExportButton.css'

export default function ExportButton({ onClick, disabled, exporting }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)

  return (
    <button
      className={`export-btn${hov ? ' export-btn--hov' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <FileDown size={15} strokeWidth={2.2} />
      <span className="btn-label">
        {exporting ? t('reports_module.export_generating') : t('reports_module.export_pdf')}
      </span>
    </button>
  )
}