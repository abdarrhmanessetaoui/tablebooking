import { useTranslation } from 'react-i18next'
import { B } from '../../utils/brand'

export default function Spinner() {
  const { t } = useTranslation()
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: B.pageBg, gap: 16,
    }}>
      <div className="circular-spinner" style={{
        width: 36, height: 36,
        border: `3px solid #EBEBEB`,
        borderTop: `3px solid ${B.brown}`,
        borderRadius: '50%',
        animation: 'sp 0.75s linear infinite',
      }} />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: B.inkMute }}>
        {t('loading')}
      </p>
      <style>{`
        @keyframes sp { to { transform: rotate(360deg) } }
        .circular-spinner { border-radius: 50% !important; }
      `}</style>
    </div>
  )
}