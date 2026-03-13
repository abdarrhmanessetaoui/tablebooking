import useTimeSlots from '../hooks/useTimeSlots'
import { CalendarClock, Save } from 'lucide-react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#faf8f5'
const BORDER  = '#2b2118'
const GREEN   = '#16a34a'
const GREEN_BG= '#f0f7f0'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'

function Label({ children }) {
  return (
    <p style={{
      margin: '0 0 8px', fontSize: 9, fontWeight: 900, color: DARK,
      letterSpacing: '0.18em', textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}

function TimeInput({ value, onChange, max }) {
  return (
    <input
      type="number" min="0" max={max}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: 52, textAlign: 'center',
        border: `2px solid ${BORDER}`,
        padding: '10px 6px',
        fontSize: 15, fontWeight: 900, color: DARK,
        fontFamily: 'inherit', outline: 'none',
        background: '#fff', borderRadius: 0,
        WebkitAppearance: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = BORDER}
    />
  )
}

export default function Settings() {
  const {
    allOH, workingDates, activeOH, setActiveOH,
    loading, saving, error, success,
    updateOH, toggleWorkingDay, handleSave,
    DAYS,
  } = useTimeSlots()

  return (
    <div style={{
      background: CREAM,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
      boxSizing: 'border-box', width: '100%', maxWidth: 780,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── Page header ── */}
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
          Paramètres
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
          Gérez les horaires d'ouverture et les jours de service.
        </p>
      </div>

      <div style={{ height: 2, background: DARK, margin: '16px 0 28px' }} />

      {/* ── Alerts ── */}
      {success && (
        <div style={{ marginBottom: 20, padding: '11px 16px', background: GREEN_BG, borderLeft: `3px solid ${GREEN}`, fontSize: 12, fontWeight: 700, color: GREEN }}>
          ✓ Enregistré avec succès.
        </div>
      )}
      {error && (
        <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: GOLD_DK }}>
          <div style={{
            width: 16, height: 16,
            border: `2.5px solid ${GOLD}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }} />
          Chargement…
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* ── SECTION: Jours de travail ── */}
          <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

            {/* Section header */}
            <div style={{ padding: '12px 16px', background: DARK, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarClock size={14} strokeWidth={2.5} color={GOLD} />
              <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Jours de travail
              </span>
            </div>

            <div style={{ padding: 'clamp(14px,4vw,24px)' }}>
              <Label>Sélectionnez les jours d'ouverture</Label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {DAYS.map((day, i) => {
                  const active = workingDates[i]
                  return (
                    <button
                      key={day}
                      onClick={() => toggleWorkingDay(i)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '10px 14px', minWidth: 54,
                        background: active ? DARK : '#fff',
                        border: `2px solid ${active ? DARK : '#e8e0d8'}`,
                        color: active ? GOLD : '#aaa',
                        cursor: 'pointer', transition: 'all 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.borderColor = DARK
                          e.currentTarget.style.color = DARK
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.borderColor = '#e8e0d8'
                          e.currentTarget.style.color = '#aaa'
                        }
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {day.slice(0, 3)}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, marginTop: 3, opacity: 0.7 }}>
                        {active ? 'Ouvert' : 'Fermé'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── SECTION: Horaires de service ── */}
          <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

            {/* Section header */}
            <div style={{ padding: '12px 16px', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarClock size={14} strokeWidth={2.5} color={GOLD} />
                <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Horaires de service
                </span>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px',
                  background: saving ? '#3d2d1e' : GOLD,
                  border: 'none',
                  color: saving ? GOLD : DARK,
                  fontSize: 11, fontWeight: 900,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = GOLD_DK }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = GOLD }}
              >
                <Save size={12} strokeWidth={2.5} />
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>

            <div style={{ padding: 'clamp(14px,4vw,24px)' }}>

              {/* Service tabs */}
              <Label>Service</Label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
                {allOH.map((oh, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveOH(i)}
                    style={{
                      padding: '8px 16px',
                      background: activeOH === i ? DARK : '#fff',
                      border: `2px solid ${activeOH === i ? DARK : '#e8e0d8'}`,
                      color: activeOH === i ? GOLD : '#888',
                      fontSize: 12, fontWeight: 800,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s', letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => {
                      if (activeOH !== i) {
                        e.currentTarget.style.borderColor = DARK
                        e.currentTarget.style.color = DARK
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeOH !== i) {
                        e.currentTarget.style.borderColor = '#e8e0d8'
                        e.currentTarget.style.color = '#888'
                      }
                    }}
                  >
                    {oh.name}
                  </button>
                ))}
              </div>

              {/* Hour editor */}
              {allOH[activeOH] && (
                <div style={{ background: CREAM, border: `1.5px solid #e8e0d8`, padding: 'clamp(14px,3vw,24px)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>

                    {/* Open */}
                    <div>
                      <Label>Ouverture</Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TimeInput
                          max={23}
                          value={allOH[activeOH].openhours[0]?.h1}
                          onChange={v => updateOH(activeOH, 'h1', v)}
                        />
                        <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK, lineHeight: 1 }}>:</span>
                        <TimeInput
                          max={59}
                          value={allOH[activeOH].openhours[0]?.m1}
                          onChange={v => updateOH(activeOH, 'm1', v)}
                        />
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ paddingBottom: 12, fontSize: 20, color: '#ccc', fontWeight: 900, lineHeight: 1 }}>→</div>

                    {/* Close */}
                    <div>
                      <Label>Fermeture</Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TimeInput
                          max={23}
                          value={allOH[activeOH].openhours[0]?.h2}
                          onChange={v => updateOH(activeOH, 'h2', v)}
                        />
                        <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK, lineHeight: 1 }}>:</span>
                        <TimeInput
                          max={59}
                          value={allOH[activeOH].openhours[0]?.m2}
                          onChange={v => updateOH(activeOH, 'm2', v)}
                        />
                      </div>
                    </div>

                    {/* Preview pill */}
                    <div>
                      <Label>Aperçu</Label>
                      <div style={{
                        padding: '10px 16px',
                        background: DARK,
                        fontSize: 14, fontWeight: 900, color: GOLD,
                        letterSpacing: '0.06em', whiteSpace: 'nowrap',
                      }}>
                        {String(allOH[activeOH].openhours[0]?.h1 ?? 0).padStart(2, '0')}:
                        {String(allOH[activeOH].openhours[0]?.m1 ?? 0).padStart(2, '0')}
                        {' — '}
                        {String(allOH[activeOH].openhours[0]?.h2 ?? 0).padStart(2, '0')}:
                        {String(allOH[activeOH].openhours[0]?.m2 ?? 0).padStart(2, '0')}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}