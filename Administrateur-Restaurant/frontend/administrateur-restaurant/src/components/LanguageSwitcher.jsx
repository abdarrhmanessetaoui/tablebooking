import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'
import { DARK, LIGHT_BROWN as LB, BORDER as BD, WHITE, RADIUS } from '../styles/dashboard/tokens'

const LIGHT_BROWN = LB
const BORDER = BD

/**
 * Reusable LanguageSwitcher component
 * @param {boolean} collapsed - If true, shows only icon (useful for sidebar)
 * @param {string} position - 'top' or 'bottom' for the dropdown menu
 */
export default function LanguageSwitcher({ collapsed = false, position = 'top', inline = false }) {
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

  if (inline) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <select
          value={currentLang}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            background: WHITE,
            color: DARK,
            border: `1.5px solid ${BORDER}`,
            borderRadius: RADIUS.sm,
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            minWidth: '140px',
            fontFamily: 'inherit'
          }}
        >
          {langs.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // ... rest of existing code ...
  const menuBg      = WHITE
  const menuBorder  = BORDER
  const menuItemColor = DARK
  const menuItemHov = '#FAF7F4'
  const activeColor = LIGHT_BROWN

  const menuStyle = {
    position: 'absolute',
    [position === 'top' ? 'bottom' : 'top']: '100%',
    [position === 'top' ? 'marginBottom' : 'marginTop']: 8,
    ...(i18n.language === 'ar' ? { right: 0 } : { left: 0 }),
    background: menuBg,
    border: `1px solid ${menuBorder}`,
    borderRadius: RADIUS.sm,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 160,
    padding: 6,
    boxShadow: 'none',
    overflow: 'hidden',
  }

  const hovBgColor       = '#FAF7F4'

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
                  background: hovItem === i ? menuItemHov : 'transparent',
                  color: currentLang === l.code ? activeColor : menuItemColor,
                  border: 'none',
                  borderRadius: RADIUS.sm,
                  padding: '10px 14px',
                  textAlign: i18n.language === 'ar' ? 'right' : 'left',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: currentLang === l.code ? 800 : 600,
                  fontFamily: 'inherit',
                  transition: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   {l.label}
                </div>
                {currentLang === l.code && <Check size={14} strokeWidth={2.5} />}
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
          gap: collapsed ? 0 : 12,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '12px 0' : '10px 14px',
          background: open ? hovBgColor : hovBtn ? hovBgColor : 'transparent',
          border: 'none',
          borderRadius: RADIUS.sm,
          color: DARK,
          cursor: 'pointer',
          transition: 'none',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'inherit', opacity: 0.4 }}>
          <Globe size={20} strokeWidth={1.5} />
        </span>
        {!collapsed && <span style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('language')}</span>}
      </button>
    </div>
  )
}
