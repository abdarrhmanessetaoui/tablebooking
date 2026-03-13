import { useState } from 'react'
import { Plus, Check, X, Utensils } from 'lucide-react'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
const BORDER = '#2b2118'

const EMPTY = { name: '', price: '', capacity: '', duration: '' }

const inp = {
  padding: '12px 14px',
  border: `2px solid ${BORDER}`,
  fontSize: 14, fontWeight: 700, color: DARK,
  fontFamily: 'inherit', outline: 'none', background: '#fff',
  transition: 'border-color 0.15s',
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

export default function ServiceForm({ initial = EMPTY, onSave, saving, editingName, onCancel }) {
  const [form, setForm] = useState(initial)
  const set  = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo   = e => e.target.style.borderColor = GOLD
  const bl   = e => e.target.style.borderColor = BORDER
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  async function handleSubmit() {
    if (!valid || saving) return
    await onSave(form, () => setForm(EMPTY))
  }

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>

      {/* Header bar */}
      <div style={{
        padding: '12px 16px', background: DARK,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Utensils size={14} strokeWidth={2.5} color={GOLD} />
        <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {editingName ? `Modifier — ${editingName}` : 'Nouveau service'}
        </span>
      </div>

      <div style={{ padding: 'clamp(14px,4vw,24px)', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Field label="Nom du service">
          <input
            type="text" value={form.name} placeholder="Ex: A la Carte"
            onChange={e => set('name')(e.target.value)}
            style={inp} onFocus={fo} onBlur={bl}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Prix (dh)">
            <input
              type="number" value={form.price} placeholder="0"
              onChange={e => set('price')(e.target.value)}
              style={inp} onFocus={fo} onBlur={bl}
            />
          </Field>
          <Field label="Capacité (pers.)">
            <input
              type="number" value={form.capacity} placeholder="15"
              onChange={e => set('capacity')(e.target.value)}
              style={inp} onFocus={fo} onBlur={bl}
            />
          </Field>
        </div>

        <Field label="Durée (min)">
          <input
            type="number" value={form.duration} placeholder="60"
            onChange={e => set('duration')(e.target.value)}
            style={inp} onFocus={fo} onBlur={bl}
          />
        </Field>

        <button
          onClick={handleSubmit}
          disabled={!valid || saving}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '15px', background: DARK, border: 'none',
            color: valid && !saving ? GOLD : '#fff',
            fontSize: 14, fontWeight: 800,
            cursor: valid && !saving ? 'pointer' : 'not-allowed',
            opacity: !valid || saving ? 0.45 : 1,
            transition: 'background 0.15s, opacity 0.15s',
            fontFamily: 'inherit', width: '100%', minHeight: 50,
          }}
          onMouseEnter={e => { if (valid && !saving) e.currentTarget.style.background = '#3d2d1e' }}
          onMouseLeave={e => { e.currentTarget.style.background = DARK }}
        >
          {saving
            ? 'Enregistrement…'
            : editingName
              ? <><Check size={15} strokeWidth={2.5} /> Enregistrer les modifications</>
              : <><Plus size={15} strokeWidth={2.5} /> Ajouter le service</>
          }
        </button>

        {editingName && (
          <button onClick={onCancel} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px', background: 'none', border: `1.5px solid ${BORDER}`,
            fontSize: 12, fontWeight: 800, color: DARK,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', width: '100%',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf6ec'; e.currentTarget.style.color = '#a8834e'; e.currentTarget.style.borderColor = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK; e.currentTarget.style.borderColor = BORDER }}
          >
            <X size={13} strokeWidth={2.5} /> Annuler la modification
          </button>
        )}

      </div>
    </div>
  )
}