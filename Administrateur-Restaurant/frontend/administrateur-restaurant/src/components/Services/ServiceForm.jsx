import { useState, useEffect } from 'react'


const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const BORDER  = '#2b2118'

const EMPTY = { name: '', price: '', capacity: '', duration: '', available_days: [0,1,2,3,4,5,6] }

const DAYS = [
  { idx: 0, short: 'Dim', full: 'Dimanche' },
  { idx: 1, short: 'Lun', full: 'Lundi' },
  { idx: 2, short: 'Mar', full: 'Mardi' },
  { idx: 3, short: 'Mer', full: 'Mercredi' },
  { idx: 4, short: 'Jeu', full: 'Jeudi' },
  { idx: 5, short: 'Ven', full: 'Vendredi' },
  { idx: 6, short: 'Sam', full: 'Samedi' },
]

const inp = {
  padding: '12px 14px',
  border: `2px solid ${BORDER}`,
  fontSize: 14, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'none',
  width: '100%', boxSizing: 'border-box',
  minWidth: 0, WebkitAppearance: 'none', borderRadius: 0,
}

function Label({ children }) {
  return (
    <label style={{
      fontSize: 9, fontWeight: 900, color: DARK,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      display: 'block', marginBottom: 6,
    }}>
      {children}
    </label>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function DayPicker({ value = [0,1,2,3,4,5,6], onChange }) {
  function toggle(idx) {
    if (value.includes(idx)) {
      if (value.length === 1) return  // keep at least 1
      onChange(value.filter(d => d !== idx))
    } else {
      onChange([...value, idx].sort((a, b) => a - b))
    }
  }

  return (
    <div>
      <Label>Jours disponibles</Label>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
        {DAYS.map(d => {
          const active = value.includes(d.idx)
          return (
            <button key={d.idx} type="button"
              onClick={() => toggle(d.idx)}
              title={d.full}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '10px 10px', minWidth: 44, gap: 2,
                background: active ? DARK : '#FFFFFF',
                border: `2px solid ${DARK}`,
                color: active ? GOLD : DARK,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {d.short}
              </span>
            </button>
          )
        })}
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 10, fontWeight: 700, color: GOLD_DK }}>
        {value.length === 7
          ? 'Disponible tous les jours'
          : `Disponible ${value.length} jour${value.length > 1 ? 's' : ''} / semaine — ${value.map(i => DAYS[i].full).join(', ')}`
        }
      </p>
    </div>
  )
}

export default function ServiceForm({ initial = EMPTY, onSave, saving, editingName, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })

  // Re-sync form whenever the edited service changes (or editing starts/stops)
  useEffect(() => {
    setForm({
      ...EMPTY,
      ...initial,
      // Ensure available_days is always a proper array
      available_days: Array.isArray(initial?.available_days)
        ? initial.available_days
        : [0, 1, 2, 3, 4, 5, 6],
    })
  }, [initial?.idx, editingName])  // triggers on service switch AND on cancel (editingName → undefined)

  const set   = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo    = e => e.target.style.borderColor = GOLD
  const bl    = e => e.target.style.borderColor = BORDER
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm(EMPTY))
  }

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 16px', background: DARK, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {editingName ? `Modifier — ${editingName}` : 'Nouveau service'}
        </span>
      </div>

      <div style={{ padding: 'clamp(14px,4vw,24px)', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Field label="Nom du service">
          <input type="text" value={form.name} placeholder="Ex: Couscous du Vendredi"
            onChange={e => set('name')(e.target.value)}
            style={inp} onFocus={fo} onBlur={bl}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Prix (dh)">
            <input type="number" value={form.price} placeholder="0"
              onChange={e => set('price')(e.target.value)} style={inp} onFocus={fo} onBlur={bl} />
          </Field>
          <Field label="Capacité (pers.)">
            <input type="number" value={form.capacity} placeholder="15"
              onChange={e => set('capacity')(e.target.value)} style={inp} onFocus={fo} onBlur={bl} />
          </Field>
        </div>

        <Field label="Durée (min)">
          <input type="number" value={form.duration} placeholder="60"
            onChange={e => set('duration')(e.target.value)} style={inp} onFocus={fo} onBlur={bl} />
        </Field>

        {/* Days picker */}
        <div style={{ padding: '14px', background: '#FFFFFF', border: `2px solid ${DARK}` }}>
          <DayPicker
            value={form.available_days ?? [0,1,2,3,4,5,6]}
            onChange={v => set('available_days')(v)}
          />
        </div>

        <button onClick={handleSubmit} disabled={!valid || saving}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '15px', background: DARK, border: 'none',
            color: GOLD,
            fontSize: 14, fontWeight: 900,
            cursor: valid && !saving ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', width: '100%', minHeight: 50,
            textTransform: 'uppercase'
          }}
        >
          {saving ? 'Enregistrement…'
            : editingName
              ? 'Enregistrer'
              : 'Ajouter le service'
          }
        </button>

        {editingName && (
          <button onClick={onCancel} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px', background: GOLD, border: `none`,
            fontSize: 12, fontWeight: 900, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit', width: '100%',
            textTransform: 'uppercase'
          }}>
            Annuler
          </button>
        )}

      </div>
    </div>
  )
}