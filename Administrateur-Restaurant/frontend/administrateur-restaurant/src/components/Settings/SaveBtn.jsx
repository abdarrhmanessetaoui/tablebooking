import { useState } from 'react'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DK } from './constants'

export default function SaveBtn({ onClick, saving }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={saving}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={t('settings_module.save_btn')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: saving ? '#3d2d1e' : hov ? LIGHT_BROWN_DK : LIGHT_BROWN,
        border: 'none',
        color: DARK,
        fontSize: 11,
        fontWeight: 900,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1,
        fontFamily: 'inherit',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transition: 'background 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <Save size={12} strokeWidth={2.5} />
      <span className="save-btn-label">
        {saving ? t('settings_module.saving') : t('settings_module.save_btn')}
      </span>
    </button>
  )
}
