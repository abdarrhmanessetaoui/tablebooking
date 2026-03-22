import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  X, User, Phone, Mail, Users, Utensils, FileText,
  CalendarDays, Clock, Trash2, ChevronLeft, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { getToken } from '../../utils/auth'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BASE      = 'http://localhost:8000/api'

const STATUS_CONFIG = {
  Confirmed: { bg: '#f0fdf4', color: '#16a34a', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', color: GOLD_DARK,  label: 'En attente' },
  Cancelled: { bg: '#fef2f2', color: '#dc2626',  label: 'Annulée'   },
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  border: `2px solid #e8e0d8`, background: '#fff',
  padding: '10px 14px', fontSize: 14, fontWeight: 600,
  color: DARK, fontFamily: 'inherit', outline: 'none',
}

// ── Generate time slots from open hours ────────────────────────────
function generateSlotsFromOH(oh, durationMin = 30) {
  if (!oh) return []
  const h1  = parseInt(oh.h1 ?? 12)
  const m1  = parseInt(oh.m1 ?? 0)
  const h2  = parseInt(oh.h2 ?? 23)
  const m2  = parseInt(oh.m2 ?? 0)
  const dur = Math.max(15, parseInt(durationMin) || 30)
  const start = h1 * 60 + m1
  const end   = h2 * 60 + m2
  const slots = []
  for (let t = start; t + dur <= end; t += dur) {
    const hh = Math.floor(t / 60)
    const mm = t % 60
    slots.push(`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`)
  }
  return slots
}

// ── Mini Calendar ──────────────────────────────────────────────────
// disabledDays uses JS convention: 0=Sun, 1=Mon...6=Sat
function Calendar({ value, onChange, blockedDates, disabledDays = [] }) {
  const today = new Date(); today.setHours(0,0,0,0)
  const init  = value ? new Date(value + 'T00:00:00') : today
  const [cur, setCur] = useState({ y: init.getFullYear(), m: init.getMonth() })

  const MONTHS   = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
  const DAY_HDRS = ['L','M','M','J','V','S','D']

  const dim   = (y,m) => new Date(y,m+1,0).getDate()
  const first = (y,m) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1 }
  const toISO = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  const todayISO = today.toISOString().slice(0,10)

  const cells = []
  for (let i=0; i<first(cur.y,cur.m); i++) cells.push(null)
  for (let d=1; d<=dim(cur.y,cur.m); d++) cells.push(d)

  function prev() { setCur(c => c.m===0 ? {y:c.y-1,m:11} : {y:c.y,m:c.m-1}) }
  function next() { setCur(c => c.m===11? {y:c.y+1,m:0}  : {y:c.y,m:c.m+1}) }

  function pick(day) {
    const iso   = toISO(cur.y, cur.m, day)
    const dt    = new Date(iso + 'T00:00:00')
    const jsDay = dt.getDay() // 0=Sun..6=Sat — same convention as disabledDays
    if (dt < today) return
    if (blockedDates.includes(iso)) return
    if (disabledDays.includes(jsDay)) return
    onChange(iso)
  }

  return (
    <div style={{ border:`2px solid #e8e0d8`, background:'#fff' }}>
      <div style={{ background:DARK, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px' }}>
        <button onClick={prev} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          <ChevronLeft size={16} color={GOLD} />
        </button>
        <span style={{ fontSize:13, fontWeight:900, color:'#fff' }}>
          {MONTHS[cur.m]} {cur.y}
        </span>
        <button onClick={next} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', padding:4 }}>
          <ChevronRight size={16} color={GOLD} />
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'#faf8f5', borderBottom:`1px solid #e8e0d8` }}>
        {DAY_HDRS.map((d,i) => (
          <div key={i} style={{ padding:'6px 0', textAlign:'center', fontSize:10, fontWeight:900, color:GOLD_DARK }}>{d}</div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'6px 4px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const iso    = toISO(cur.y, cur.m, day)
          const dt     = new Date(iso + 'T00:00:00')
          const jsDay  = dt.getDay() // 0=Sun..6=Sat
          const isPast = dt < today
          const isBlk  = blockedDates.includes(iso)
          const isOff  = disabledDays.includes(jsDay)   // ← FIX: jsDay, not appDay
          const isSel  = iso === value
          const isTdy  = iso === todayISO
          const disabled = isPast || isBlk || isOff

          return (
            <button key={day} onClick={() => pick(day)} disabled={disabled}
              style={{
                padding:'7px 0', border:'none', borderRadius:2,
                background: isSel ? DARK : (isBlk||isOff) ? '#fdf0f0' : 'transparent',
                color: isSel ? GOLD : (isBlk||isOff) ? '#e0a0a0' : isPast ? '#ccc' : isTdy ? GOLD_DARK : DARK,
                fontSize:13, fontWeight: (isSel||isTdy) ? 900 : 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                textDecoration: (isBlk||isOff) ? 'line-through' : 'none',
                opacity: isOff ? 0.4 : 1,
                position:'relative', transition:'background 0.1s',
              }}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div style={{ padding:'6px 12px 10px', borderTop:`1px solid #f0ebe4`, display:'flex', gap:12, flexWrap:'wrap' }}>
        <span style={{ fontSize:10, fontWeight:700, color:'#b94040', display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#b94040', display:'inline-block' }} />
          Bloqué / Fermé
        </span>
        <span style={{ fontSize:10, fontWeight:700, color:GOLD_DARK, display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:GOLD_DARK, display:'inline-block' }} />
          Aujourd'hui
        </span>
      </div>
    </div>
  )
}

// ── Time Slot picker ───────────────────────────────────────────────
function TimeSlots({ value, onChange, slots }) {
  if (!slots.length) return (
    <div style={{ padding:'12px 14px', background:'#fdf6ec', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:GOLD_DARK, display:'flex', alignItems:'center', gap:8 }}>
      <AlertTriangle size={13} strokeWidth={2.5} />
      Aucun créneau disponible pour ce service ce jour-là.
    </div>
  )
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:4 }}>
      {slots.map(slot => {
        const active = value === slot
        return (
          <button key={slot} onClick={() => onChange(slot)}
            style={{
              padding:'7px 13px', background: active ? DARK : GOLD,
              border: 'none', borderRadius: 999,
              fontSize:12, fontWeight:800, color: active ? GOLD : DARK,
              cursor:'pointer', transition:'background 0.15s, color 0.15s',
            }}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

// ── Info row (view mode) ───────────────────────────────────────────
function InfoRow({ icon:Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
      <div style={{ width:32, height:32, background:'#f5f0eb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={14} color={GOLD_DARK} strokeWidth={2} />
      </div>
      <div>
        <p style={{ margin:0, fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.1em' }}>{label}</p>
        <p style={{ margin:'2px 0 0', fontSize:14, fontWeight:800, color:DARK }}>{value}</p>
      </div>
    </div>
  )
}

function Label({ text }) {
  return <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:900, color:DARK, letterSpacing:'0.12em', textTransform:'uppercase' }}>{text}</p>
}

function TextInput({ label, value, onChange, type='text', required }) {
  return (
    <div>
      <Label text={label + (required ? ' *' : '')} />
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = GOLD}
        onBlur={e => e.target.style.borderColor = '#e8e0d8'}
      />
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function ReservationModal({
  modalMode, editing, form, setForm,
  handleSubmit, handleCreate, handleDelete, setModalMode,
}) {
  const [hovSave,      setHovSave]      = useState(false)
  const [hovDel,       setHovDel]       = useState(false)
  const [services,     setServices]     = useState([])
  const [blockedDates, setBlockedDates] = useState([])
  const [allOH,        setAllOH]        = useState([])
  const [workingDates, setWorkingDates] = useState([true,true,true,true,true,true,true])
  const [step,         setStep]         = useState(1)

  const close = () => { setModalMode(null); setStep(1) }

  // ── Fetch services + time-slots + blocked dates ────────────────
  useEffect(() => {
    const h = { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
    Promise.all([
      fetch(`${BASE}/restaurant/services`, { headers: h }).then(r => r.json()),
      fetch(`${BASE}/time-slots`,          { headers: h }).then(r => r.json()),
      fetch(`${BASE}/admin/blocked-dates`, { headers: h }).then(r => r.json()),
    ]).then(([svcs, slots, blocked]) => {
      setServices(Array.isArray(svcs) ? svcs : [])
      setAllOH(slots?.allOH ?? [])
      setWorkingDates(slots?.working_dates ?? [true,true,true,true,true,true,true])
      setBlockedDates(Array.isArray(blocked) ? blocked.map(x => x.date) : [])
    }).catch(() => {})
  }, [])

  // ── Disabled days — JS convention (0=Sun..6=Sat) ──────────────
  // This is the convention used by available_days, working_dates, and openhours
  const disabledDays = useMemo(() => {
    const svc       = services.find(s => s.name === form.service)
    const availDays = svc?.available_days ?? [0,1,2,3,4,5,6] // JS: 0=Sun..6=Sat

    return [0,1,2,3,4,5,6].filter(jsDay => {
      const isWorking = workingDates[jsDay] ?? true // working_dates: JS convention ✓
      const inService = availDays.includes(jsDay)   // available_days: JS convention ✓
      return !inService || !isWorking
    })
  }, [form.service, services, workingDates])

  // ── Time slots — use jsDay to index openhours ─────────────────
  // openhours[0]=Sun, openhours[1]=Mon... (JS convention, same as PHP range(0,6))
  const timeSlots = useMemo(() => {
    if (!form.date || !form.service) return []
    const svc = services.find(s => s.name === form.service)
    if (!svc) return []

    const jsDay   = new Date(form.date + 'T00:00:00').getDay() // 0=Sun..6=Sat ← KEY FIX
    const ohIndex = svc.ohindex ?? 0
    const oh      = allOH[ohIndex]
    if (!oh) return []

    // ← FIX: use jsDay directly — openhours uses same JS convention
    const daySlot = oh.openhours?.[jsDay] ?? oh.openhours?.[0]
    if (!daySlot) return []

    return generateSlotsFromOH(daySlot, svc.duration ?? 30)
  }, [form.date, form.service, services, allOH])

  // Reset start_time when slot no longer valid
  useEffect(() => {
    if (form.start_time && timeSlots.length && !timeSlots.includes(form.start_time)) {
      setForm(f => ({ ...f, start_time: '' }))
    }
  }, [timeSlots]) // eslint-disable-line

  const titles = { view:'Détail', edit:'Modifier le statut', create:'Nouvelle réservation' }

  return createPortal(
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(43,33,24,0.6)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:16,
      fontFamily:"'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      <div style={{
        background:'#fff', width:'100%', maxWidth:480,
        maxHeight:'92vh', overflow:'auto',
        display:'flex', flexDirection:'column',
        boxShadow:'0 24px 64px rgba(43,33,24,0.35)',
      }}>

        {/* Header */}
        <div style={{ background:DARK, padding:'20px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <p style={{ margin:0, fontSize:10, fontWeight:700, color:GOLD, letterSpacing:'0.16em', textTransform:'uppercase' }}>
              {titles[modalMode]}{modalMode === 'create' && ` — Étape ${step}/3`}
            </p>
            <h2 style={{ margin:'3px 0 0', fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>
              {modalMode === 'create'
                ? (step===1 ? 'Formule & couverts' : step===2 ? 'Date & heure' : 'Coordonnées')
                : (editing?.name || '—')
              }
            </h2>
          </div>
          <button onClick={close} style={{ background:'rgba(255,255,255,0.1)', border:'none', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <X size={17} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Progress bar */}
        {modalMode === 'create' && (
          <div style={{ display:'flex', height:3 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ flex:1, background: s<=step ? GOLD : '#e8e0d8', transition:'background 0.3s' }} />
            ))}
          </div>
        )}

        <div style={{ padding:'24px 26px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* ── VIEW ── */}
          {modalMode === 'view' && editing && (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <InfoRow icon={User}         label="Nom"      value={editing.name}       />
                <InfoRow icon={Phone}        label="Tél"      value={editing.phone}      />
                <InfoRow icon={Mail}         label="Email"    value={editing.email}      />
                <InfoRow icon={CalendarDays} label="Date"     value={editing.date}       />
                <InfoRow icon={Clock}        label="Heure"    value={editing.start_time} />
                <InfoRow icon={Users}        label="Couverts" value={editing.guests}     />
                <InfoRow icon={Utensils}     label="Service"  value={editing.service}    />
                <InfoRow icon={FileText}     label="Notes"    value={editing.notes}      />
              </div>
              {editing.status && (() => {
                const s = STATUS_CONFIG[editing.status] || { bg:'#f5f5f5', color:'#888', label: editing.status }
                return (
                  <div style={{ padding:'10px 16px', background:s.bg, display:'inline-flex' }}>
                    <span style={{ fontSize:12, fontWeight:900, color:s.color }}>{s.label}</span>
                  </div>
                )
              })()}
              <div style={{ height:2, background:'#f0ebe4' }} />
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { setForm({...editing}); setModalMode('edit') }}
                  style={{ flex:1, padding:'12px', background:DARK, border:'none', fontSize:13, fontWeight:800, color:GOLD, cursor:'pointer' }}>
                  Modifier le statut
                </button>
                <button onClick={() => handleDelete(editing.id)}
                  onMouseEnter={() => setHovDel(true)} onMouseLeave={() => setHovDel(false)}
                  style={{ padding:'12px 16px', background:hovDel?'#dc2626':'#fef2f2', border:'none', cursor:'pointer', transition:'background 0.15s', display:'flex', alignItems:'center' }}>
                  <Trash2 size={16} strokeWidth={2.5} color={hovDel?'#fff':'#dc2626'} />
                </button>
              </div>
            </>
          )}

          {/* ── EDIT ── */}
          {modalMode === 'edit' && (
            <>
              <div style={{ background:'#faf8f5', padding:'14px 18px', display:'flex', flexDirection:'column', gap:8 }}>
                {[['Date',editing?.date],['Heure',editing?.start_time],['Couverts',editing?.guests]].map(([l,v]) => v ? (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
                  </div>
                ) : null)}
              </div>
              <div>
                <Label text="Statut" />
                <div style={{ display:'flex', gap:6 }}>
                  {['Confirmed','Pending','Cancelled'].map(s => {
                    const active = form.status === s
                    return (
                      <button key={s} onClick={() => setForm({...form, status:s})}
                        style={{ flex:1, padding:'11px 6px', background:active?DARK:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:active?GOLD:'#888', cursor:'pointer', transition:'all 0.15s' }}>
                        {STATUS_CONFIG[s]?.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={close} style={{ flex:1, padding:'12px', background:'#f5f0eb', border:'none', fontSize:13, fontWeight:800, color:DARK, cursor:'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleSubmit}
                  onMouseEnter={() => setHovSave(true)} onMouseLeave={() => setHovSave(false)}
                  style={{ flex:2, padding:'12px', background:hovSave?GOLD_DARK:GOLD, border:'none', fontSize:14, fontWeight:900, color:DARK, cursor:'pointer', transition:'background 0.15s' }}>
                  Enregistrer
                </button>
              </div>
            </>
          )}

          {/* ── CREATE STEP 1 ── */}
          {modalMode === 'create' && step === 1 && (
            <>
              <div>
                <Label text="Nos Formules" />
                <select value={form.service ?? ''}
                  onChange={e => setForm({...form, service:e.target.value, date:'', start_time:''})}
                  style={{ ...inputStyle, appearance:'none', cursor:'pointer', fontSize:15 }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#e8e0d8'}
                >
                  <option value="">— Choisir une formule —</option>
                  {services.map(s => (
                    <option key={s.name} value={s.name}>
                      {s.name}{Number(s.price)>0 ? ` — ${s.price} dh` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label text="Nombre de personnes" />
                <select value={form.guests ?? ''}
                  onChange={e => setForm({...form, guests:e.target.value})}
                  style={{ ...inputStyle, appearance:'none', cursor:'pointer', fontSize:15 }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#e8e0d8'}
                >
                  <option value="">— Choisir —</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
                    <option key={n} value={n}>{n} personne{n>1?'s':''}</option>
                  ))}
                </select>
              </div>

              {/* Show service hours info */}
              {form.service && (() => {
                const svc = services.find(s => s.name === form.service)
                if (!svc) return null
                const oh = allOH[svc.ohindex ?? 0]
                if (!oh) return null
                const days = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
                // available days in JS convention
                const availJsDays = svc.available_days ?? [0,1,2,3,4,5,6]
                const openDays = availJsDays
                  .filter(d => workingDates[d] !== false)
                  .map(d => days[d])
                  .join(', ')
                return (
                  <div style={{ padding:'10px 14px', background:'#faf8f5', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:DARK }}>
                    <div>⏱ Durée : {svc.duration} min</div>
                    {openDays && <div style={{ marginTop:4, color:GOLD_DARK }}>📅 Disponible : {openDays}</div>}
                  </div>
                )
              })()}

              <button
                onClick={() => {
                  if (!form.guests) { alert('Veuillez choisir le nombre de personnes.'); return }
                  setStep(2)
                }}
                style={{ padding:'14px', background:GOLD, border:'none', fontSize:14, fontWeight:900, color:DARK, cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                Suivant →
              </button>
            </>
          )}

          {/* ── CREATE STEP 2 ── */}
          {modalMode === 'create' && step === 2 && (
            <>
              {!form.service && (
                <div style={{ padding:'10px 14px', background:'#fdf6ec', borderLeft:`3px solid ${GOLD}`, fontSize:12, fontWeight:700, color:GOLD_DARK }}>
                  Sélectionnez d'abord une formule à l'étape précédente.
                </div>
              )}

              <Calendar
                value={form.date}
                onChange={v => setForm({...form, date:v, start_time:''})}
                blockedDates={blockedDates}
                disabledDays={disabledDays}
              />

              {form.date && (
                <div>
                  <Label text={`Heure — ${new Date(form.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}`} />
                  {form.service ? (
                    <>
                      <TimeSlots
                        value={form.start_time}
                        onChange={v => setForm({...form, start_time:v})}
                        slots={timeSlots}
                      />
                      {timeSlots.length > 0 && (
                        <p style={{ margin:'8px 0 0', fontSize:11, fontWeight:600, color:'rgba(43,33,24,0.4)' }}>
                          {timeSlots.length} créneaux disponibles · intervalles de {services.find(s=>s.name===form.service)?.duration ?? 30} min
                        </p>
                      )}
                    </>
                  ) : (
                    <div style={{ padding:'10px 14px', background:'#faf8f5', fontSize:12, fontWeight:700, color:'rgba(43,33,24,0.4)' }}>
                      Choisissez d'abord une formule à l'étape précédente.
                    </div>
                  )}
                </div>
              )}

              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setStep(1)} style={{ flex:1, padding:'12px', background:'#f5f0eb', border:'none', fontSize:13, fontWeight:800, color:DARK, cursor:'pointer' }}>
                  ← Retour
                </button>
                <button
                  onClick={() => {
                    if (!form.date)       { alert('Veuillez choisir une date.'); return }
                    if (!form.start_time) { alert('Veuillez choisir une heure.'); return }
                    setStep(3)
                  }}
                  style={{ flex:2, padding:'12px', background:GOLD, border:'none', fontSize:14, fontWeight:900, color:DARK, cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  Suivant →
                </button>
              </div>
            </>
          )}

          {/* ── CREATE STEP 3 ── */}
          {modalMode === 'create' && step === 3 && (
            <>
              <div style={{ background:'#faf8f5', padding:'14px 18px', display:'flex', flexDirection:'column', gap:8, borderLeft:`3px solid ${GOLD}` }}>
                {[
                  ['Service',  form.service   || '—'],
                  ['Couverts', form.guests ? `${form.guests} personne${form.guests>1?'s':''}` : '—'],
                  ['Date',     form.date       || '—'],
                  ['Heure',    form.start_time || '—'],
                ].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#aaa' }}>{l}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:DARK }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <TextInput label="Nom et prénom" value={form.name}  onChange={v => setForm({...form, name:v})}  required />
                <TextInput label="Téléphone"     value={form.phone} onChange={v => setForm({...form, phone:v})} />
                <TextInput label="Email"         value={form.email} onChange={v => setForm({...form, email:v})} type="email" />
              </div>

              <div>
                <Label text="Demande spéciale (optionnel)" />
                <textarea value={form.notes ?? ''} onChange={e => setForm({...form, notes:e.target.value})}
                  rows={2} style={{ ...inputStyle, resize:'vertical' }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#e8e0d8'}
                />
              </div>

              <div>
                <Label text="Statut" />
                <div style={{ display:'flex', gap:6 }}>
                  {['Confirmed','Pending','Cancelled'].map(s => {
                    const active = form.status === s
                    return (
                      <button key={s} onClick={() => setForm({...form, status:s})}
                        style={{ flex:1, padding:'10px 4px', background:active?DARK:'#f5f0eb', border:'none', fontSize:12, fontWeight:900, color:active?GOLD:'#888', cursor:'pointer', transition:'all 0.15s' }}>
                        {STATUS_CONFIG[s]?.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => setStep(2)} style={{ flex:1, padding:'12px', background:'#f5f0eb', border:'none', fontSize:13, fontWeight:800, color:DARK, cursor:'pointer' }}>
                  ← Retour
                </button>
                <button
                  onClick={() => {
                    if (!form.name) { alert('Le nom est obligatoire.'); return }
                    handleCreate()
                    setStep(1)
                  }}
                  onMouseEnter={() => setHovSave(true)} onMouseLeave={() => setHovSave(false)}
                  style={{ flex:2, padding:'12px', background:hovSave?GOLD_DARK:GOLD, border:'none', fontSize:14, fontWeight:900, color:DARK, cursor:'pointer', transition:'background 0.15s' }}
                >
                  Créer la réservation
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>,
    document.body
  )
}