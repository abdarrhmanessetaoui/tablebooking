import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Utensils, Users, Clock, DollarSign, FileDown, X, Check } from 'lucide-react'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { getToken } from '../utils/auth'
import { toast }   from '../components/ui/Toast'
import { confirm } from '../components/ui/ConfirmDialog'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const BORDER  = '#2b2118'
const CREAM   = '#faf8f5'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const API     = 'http://localhost:8000/api/services'

const hdrs = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

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
    }}>{children}</label>
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

function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const bg    = primary ? (hov ? DARK : GOLD) : (hov ? GOLD : DARK)
  const color = primary ? (hov ? GOLD : DARK) : '#fff'
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '10px 16px', background: bg, border: 'none', color,
        fontSize: 13, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, color 0.15s',
        fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 40,
      }}>
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

function ServiceForm({ initial = EMPTY, onSave, saving, editingName, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const fo = e => e.target.style.borderColor = GOLD
  const bl = e => e.target.style.borderColor = BORDER
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, overflow: 'hidden' }}>
      {/* Form header bar */}
      <div style={{
        padding: '12px 16px',
        background: DARK,
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
          onClick={() => valid && onSave(form)}
          disabled={!valid || saving}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '15px',
            background: DARK, border: 'none',
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
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf6ec'; e.currentTarget.style.color = GOLD_DK; e.currentTarget.style.borderColor = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK; e.currentTarget.style.borderColor = BORDER }}
          >
            <X size={13} strokeWidth={2.5} /> Annuler la modification
          </button>
        )}
      </div>
    </div>
  )
}

function ServiceRow({ svc, isEditing, onEdit, onDelete, idx }) {
  const bg = isEditing ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '3px 1fr auto',
      background: bg,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${isEditing ? GOLD : BORDER}`,
      transition: 'background 0.12s',
    }}
      className="svc-row"
    >
      {/* left accent */}
      <div />

      {/* content */}
      <div style={{ padding: '14px 16px', minWidth: 0 }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
          {svc.name}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 800, color: GOLD_DK }}>
            <DollarSign size={10} strokeWidth={2.5} color={GOLD} />
            {Number(svc.price) > 0 ? `${svc.price} dh` : 'Gratuit'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 700, color: GOLD_DK }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {svc.capacity} pers. max
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 700, color: GOLD_DK }}>
            <Clock size={10} strokeWidth={2.5} color={GOLD} />
            {svc.duration} min
          </span>
        </div>
      </div>

      {/* actions */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid #e8e0d8` }}>
        <button onClick={() => onEdit(svc)} title="Modifier"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px', background: isEditing ? '#fdf6ec' : 'none',
            border: 'none', borderBottom: '1px solid #e8e0d8',
            color: isEditing ? GOLD : DARK, cursor: 'pointer', transition: 'all 0.15s',
            minHeight: 44,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = isEditing ? '#fdf6ec' : 'none'; e.currentTarget.style.color = isEditing ? GOLD : DARK }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(svc)} title="Supprimer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px', background: 'none',
            border: 'none', color: DARK, cursor: 'pointer', transition: 'all 0.15s',
            minHeight: 44,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = RED_BG; e.currentTarget.style.color = RED }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK }}
        >
          <Trash2 size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  const [services,   setServices]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [editingSvc, setEditingSvc] = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [exporting,  setExporting]  = useState(false)

  useEffect(() => { fetchServices() }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: hdrs() })
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      setError('Impossible de charger les services.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(form) {
    setSaving(true)
    try {
      if (editingSvc) {
        await fetch(`${API}/${editingSvc.idx}`, {
          method: 'PUT', headers: hdrs(),
          body: JSON.stringify({ name: form.name, price: parseFloat(form.price) || 0, capacity: parseInt(form.capacity) || 1, duration: parseInt(form.duration) || 60 }),
        })
        setServices(prev => prev.map(s =>
          s.idx === editingSvc.idx
            ? { ...s, name: form.name, price: parseFloat(form.price), capacity: String(form.capacity), duration: String(form.duration) }
            : s
        ))
        toast(`Service "${form.name}" modifié`, 'success')
        setEditingSvc(null)
      } else {
        const res  = await fetch(API, {
          method: 'POST', headers: hdrs(),
          body: JSON.stringify({ name: form.name, price: parseFloat(form.price) || 0, capacity: parseInt(form.capacity) || 1, duration: parseInt(form.duration) || 60 }),
        })
        const data = await res.json()
        setServices(prev => [...prev, data])
        toast(`Service "${form.name}" ajouté`, 'success')
      }
    } catch {
      toast(editingSvc ? 'Impossible de modifier' : "Impossible d'ajouter", 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(svc) {
    const ok = await confirm({
      title: 'Supprimer le service',
      message: `Voulez-vous supprimer "${svc.name}" ?`,
      sub: 'Les réservations existantes ne seront pas affectées.',
      confirmLabel: 'Supprimer', type: 'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${svc.idx}`, { method: 'DELETE', headers: hdrs() })
      setServices(prev => prev.filter(s => s.idx !== svc.idx))
      if (editingSvc?.idx === svc.idx) setEditingSvc(null)
      toast(`Service "${svc.name}" supprimé`, 'warning')
    } catch {
      toast('Impossible de supprimer', 'error')
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      if (!window.jspdf) await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        s.onload = res; s.onerror = rej; document.head.appendChild(s)
      })
      const { jsPDF } = window.jspdf
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      doc.setFillColor(43,33,24); doc.rect(0,0,210,32,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(200,169,126)
      doc.text('TableBooking.ma',20,14)
      doc.setFontSize(9); doc.setTextColor(255,255,255); doc.text('Services',20,22)
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.text(dateStr,190,22,{align:'right'})
      doc.setTextColor(43,33,24); doc.setFontSize(20); doc.text('Services',20,48)
      doc.setFontSize(10); doc.setTextColor(200,169,126)
      doc.text(`${services.length} service${services.length!==1?'s':''}`,20,56)
      doc.setDrawColor(43,33,24); doc.setLineWidth(0.5); doc.line(20,61,190,61)
      let y = 70
      doc.setFillColor(43,33,24); doc.rect(20,y,170,9,'F')
      doc.setTextColor(200,169,126); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text('NOM',24,y+6); doc.text('PRIX',90,y+6); doc.text('CAPACITÉ',130,y+6); doc.text('DURÉE',165,y+6)
      y += 9
      services.forEach((svc,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,9,'F')
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(svc.name||'—',24,y+6)
        doc.text(Number(svc.price)>0?`${svc.price} dh`:'Gratuit',90,y+6)
        doc.text(`${svc.capacity} pers.`,130,y+6)
        doc.text(`${svc.duration} min`,165,y+6)
        y+=9
      })
      const pH = doc.internal.pageSize.height
      doc.setFillColor(200,169,126); doc.rect(0,pH-10,210,10,'F')
      doc.setTextColor(43,33,24); doc.setFontSize(7); doc.setFont('helvetica','bold')
      doc.text('TableBooking.ma',20,pH-4); doc.text(dateStr,190,pH-4,{align:'right'})
      doc.save(`services_${new Date().toISOString().slice(0,10)}.pdf`)
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
        .svc-layout { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 960px) {
          .svc-layout      { grid-template-columns: 380px 1fr; gap: 48px; align-items: start; }
          .svc-form-sticky { position: sticky; top: 24px; }
          .svc-mob-divider { display: none !important; }
        }
        @media (hover: hover) { .svc-row:hover { background: #fdf6ec !important; } }
      `}</style>

      <div style={{
        background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%', overflowX: 'hidden',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Services
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                Gérez les formules proposées aux clients lors de la réservation.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
              <Btn icon={FileDown} primary onClick={handleExport} disabled={exporting}>
                {exporting ? 'Génération…' : 'Exporter PDF'}
              </Btn>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 28px' }} />
        </FadeUp>

        {error && (
          <FadeUp delay={15}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={20}>
          <div className="svc-layout">

            {/* LEFT — form */}
            <div className="svc-form-sticky" style={{ minWidth: 0 }}>
              <h2 style={{ margin: '0 0 5px', fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                {editingSvc ? 'Modifier le service' : 'Ajouter un service'}
              </h2>
              <p className="page-subtitle" style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                {editingSvc ? `Modification de "${editingSvc.name}"` : 'Remplissez les champs ci-dessous'}
              </p>

              <ServiceForm
                key={editingSvc?.idx ?? 'new'}
                initial={editingSvc
                  ? { name: editingSvc.name, price: editingSvc.price, capacity: editingSvc.capacity, duration: editingSvc.duration }
                  : EMPTY
                }
                onSave={handleSave}
                saving={saving}
                editingName={editingSvc?.name ?? null}
                onCancel={() => setEditingSvc(null)}
              />
            </div>

            {/* RIGHT — list */}
            <div>
              <div className="svc-mob-divider" style={{ height: 2, background: DARK, margin: '32px 0 28px' }} />

              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(15px,2.5vw,22px)', fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
                  Services configurés
                </h2>
                <span style={{ padding: '4px 10px', background: DARK, fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.05em', flexShrink: 0 }}>
                  {services.length}
                </span>
              </div>

              {services.length === 0 ? (
                <div style={{ padding: '56px 16px', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
                  <Utensils size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK }}>Aucun service configuré</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: DARK }}>
                    Utilisez le formulaire pour ajouter un service.
                  </p>
                </div>
              ) : (
                <>
                  {/* List header */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    padding: '10px 16px', background: DARK, alignItems: 'center',
                    borderBottom: `1px solid ${BORDER}`,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Nom du service</span>
                    <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Actions</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {services.map((svc, i) => (
                      <ServiceRow
                        key={svc.idx}
                        svc={svc}
                        idx={i}
                        isEditing={editingSvc?.idx === svc.idx}
                        onEdit={s => setEditingSvc(s)}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </FadeUp>
      </div>
    </>
  )
}