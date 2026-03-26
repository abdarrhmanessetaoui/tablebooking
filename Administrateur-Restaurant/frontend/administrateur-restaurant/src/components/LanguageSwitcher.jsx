import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const CREAM = '#ffffff'

/**
 * Reusable LanguageSwitcher component
 * @param {boolean} collapsed - If true, shows only icon (useful for sidebar)
 * @param {string} position - 'top' or 'bottom' for the dropdown menu
 */
export default function LanguageSwitcher({ collapsed = false, position = 'top', dark = false }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [hovBtn, setHovBtn] = useState(false)
  const [hovItem, setHovItem] = useState(null)

  const langs = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'ar', label: 'العربية', short: 'AR' }
  ]

  const currentLang = i18n.language || 'fr'

  const handleSelect = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    setOpen(false)
  }

  const menuStyle = {
    position: 'absolute',
    [position === 'top' ? 'bottom' : 'top']: '100%',
    [position === 'top' ? 'marginBottom' : 'marginTop']: 8,
    left: collapsed ? '50%' : 0,
    transform: collapsed ? 'translateX(-50%)' : 'none',
    background: DARK,
    border: `2px solid ${GOLD}`,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 140,
    padding: 4,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
  }

  const defaultTextColor = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const hovBgColor      = dark ? 'rgba(200,169,126,0.1)' : 'rgba(200,169,126,0.08)'

  return (
    <div style={{ position: 'relative', width: collapsed ? 'auto' : '100%' }}>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setOpen(false)} />
          <div style={menuStyle}>
            {langs.map((l, i) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                onMouseEnter={() => setHovItem(i)}
                onMouseLeave={() => setHovItem(null)}
                style={{
                  background: hovItem === i ? 'rgba(200,169,126,0.15)' : 'transparent',
                  color: currentLang === l.code ? GOLD : 'rgba(255,255,255,0.8)',
                  border: 'none',
                  padding: '10px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <span style={{ 
                     fontSize: 10, 
                     width: 22, height: 22, 
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     borderRadius: '50%', background: currentLang === l.code ? GOLD : 'rgba(200,169,126,0.3)',
                     color: currentLang === l.code ? DARK : CREAM,
                     fontWeight: 900
                   }}>
                     {l.short}
                   </span>
                   {l.label}
                </div>
                {currentLang === l.code && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovBtn(true)}
        onMouseLeave={() => setHovBtn(false)}
        title={t('language')}
        style={{
          width: collapsed ? 44 : '100%',
          height: collapsed ? 44 : 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 13,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '10px 12px',
          background: open ? 'rgba(200,169,126,0.15)' : hovBtn ? hovBgColor : 'transparent',
          border: 'none',
          color: open || hovBtn ? GOLD : defaultTextColor,
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 4
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'inherit' }}>
          <Globe size={20} strokeWidth={2} />
        </span>
        {!collapsed && <span style={{ textAlign: 'left', flex: 1 }}>{t('language')}</span>}
      </button>
    </div>
  )
}
