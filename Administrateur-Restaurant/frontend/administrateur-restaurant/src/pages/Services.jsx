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
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const API     = 'http://localhost:8000/api/services'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const EMPTY = { name: '', price: '', capacity: '', duration: '' }

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

function Field({ label, icon: Icon, value, onChange, type = 'text', suffix, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 10, fontWeight: 900,
        color: focused ? GOLD : GOLD_DK,
        textTransform: 'uppercase', letterSpacing: '0.15em', transition: 'color 0.15s'
      }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Icon size={13} strokeWidth={2.5} color={focused ? GOLD : GOLD_DK}
            style={{ position: 'absolute', left: 11, pointerEvents: 'none', transition: 'color 0.15s' }} />
        )}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: `10px 12px 10px ${Icon ? '32px' : '12px'}`,
            paddingRight: suffix ? 42 : 12,
            background: '#fff',
            border: `2px solid ${focused ? DARK : '#e8e0d8'}`,
            fontSize: 13, fontWeight: 600, color: DARK,
            fontFamily: 'inherit', outline: 'none', borderRadius: 0,
            boxSizing: 'border-box', transition: 'border-color 0.15s',
            WebkitAppearance: 'none',
          }}
        />
        {suffix && (
          <span style={{
            position: 'absolute', right: 11,
            fontSize: 11, fontWeight: 800,
            color: focused ? GOLD_DK : GOLD_DK,
            transition: 'color 0.15s', pointerEvents: 'none',
          }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function ServiceFormPanel({ initial = EMPTY, onSave, saving, editingName }) {
  const [form, setForm] = useState(initial)
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Nom du service" icon={Utensils} value={form.name} onChange={set('name')} placeholder="Ex: A la Carte" />
      <Field label="Prix"          icon={DollarSign} value={form.price} onChange={set('price')} type="number" suffix="dh" placeholder="0" />
      <Field label="Capacité max"  icon={Users}      value={form.capacity} onChange={set('capacity')} type="number" suffix="pers." placeholder="15" />
      <Field label="Durée"         icon={Clock}      value={form.duration} onChange={set('duration')} type="number" suffix="min" placeholder="60" />

      <button
        onClick={() => valid && onSave(form)}
        disabled={!valid || saving}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px 20px', marginTop: 4,
          background: valid && !saving ? DARK : GOLD,
          border: 'none',
          color: valid && !saving ? GOLD : DARK,
          fontSize: 13, fontWeight: 800,
          cursor: valid && !saving ? 'pointer' : 'not-allowed',
          opacity: saving ? 0.7 : 1,
          fontFamily: 'inherit', transition: 'all 0.15s', width: '100%',
        }}
        onMouseEnter={e => { if (valid && !saving) { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = DARK } }}
        onMouseLeave={e => { if (valid && !saving) { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD } }}
      >
        {saving ? <span>Enregistrement…</span>
          : editingName ? <><Check size={15} strokeWidth={2.5} /> Modifier "{editingName}"</>
          : <><Plus size={15} strokeWidth={2.5} /> Ajouter le service</>
        }
      </button>
    </div>
  )
}

function ServiceCard({ svc, onEdit, onDelete, isEditing }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: isEditing ? '#fdf6ec' : '#fff',
        border: `2px solid ${isEditing ? GOLD : hov ? DARK : '#e8e0d8'}`,
        transition: 'border-color 0.15s, background 0.15s',
        display: 'grid', gridTemplateColumns: '3px 1fr auto',
      }}
    >
      {/* Gold left bar */}
      <div style={{ background: isEditing ? GOLD : GOLD, transition: 'background 0.15s' }} />

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
          {svc.name}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', background: '#fdf6ec',
            fontSize: 11, fontWeight: 800, color: GOLD_DK,
          }}>
            <DollarSign size={10} strokeWidth={2.5} color={GOLD} />
            {svc.price > 0 ? `${svc.price} dh` : 'Gratuit'}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', background: '#fdf6ec',
            fontSize: 11, fontWeight: 700, color: GOLD_DK,
          }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {svc.capacity} pers. max
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', background: '#fdf6ec',
            fontSize: 11, fontWeight: 700, color: GOLD_DK,
          }}>
            <Clock size={10} strokeWidth={2.5} color={GOLD} />
            {svc.duration} min
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid #e8e0d8` }}>
        <button onClick={() => onEdit(svc)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 16px',
            background: isEditing ? '#fdf6ec' : 'none',
            border: 'none', borderBottom: '1px solid #e8e0d8',
            color: isEditing ? GOLD : GOLD_DK,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = isEditing ? '#fdf6ec' : 'none'; e.currentTarget.style.color = isEditing ? GOLD : GOLD_DK }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(svc)}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 16px', background: 'none', border: 'none',
            color: GOLD_DK, cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = RED_BG; e.currentTarget.style.color = RED }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = GOLD_DK }}
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

  // ✅ FIXED: useEffect not useState
  useEffect(() => { fetchServices() }, [])

  async function fetchServices() {
    setLoading(true)
    try {
      const res  = await fetch(API, { headers: headers() })
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
          method: 'PUT', headers: headers(),
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
          method: 'POST', headers: headers(),
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
      confirmLabel: 'Supprimer',
      type: 'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${svc.idx}`, { method: 'DELETE', headers: headers() })
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
      doc.text('NOM',24,y+6); doc.text('PRIX',100,y+6); doc.text('CAPACITÉ',130,y+6); doc.text('DURÉE',165,y+6)
      y += 9
      services.forEach((svc,i) => {
        if (y>270) { doc.addPage(); y=20 }
        doc.setFillColor(i%2===0?255:250,i%2===0?255:248,i%2===0?255:245); doc.rect(20,y,170,9,'F')
        doc.setTextColor(43,33,24); doc.setFontSize(9); doc.setFont('helvetica','normal')
        doc.text(svc.name||'—',24,y+6)
        doc.text(svc.price>0?`${svc.price} dh`:'Gratuit',100,y+6)
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
          .svc-layout      { grid-template-columns: 360px 1fr; gap: 48px; align-items: start; }
          .svc-form-sticky { position: sticky; top: 24px; }
          .svc-mob-divider { display: none !important; }
        }
      `}</style>

      <div style={{
        background: '#faf8f5',
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

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 28px' }} />
        </FadeUp>

        {/* ERROR */}
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
                {editingSvc ? 'Modifier le service' : 'Nouveau service'}
              </h2>
              <p className="page-subtitle" style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
                {editingSvc ? `Modification de "${editingSvc.name}"` : 'Remplissez les champs ci-dessous'}
              </p>

              <ServiceFormPanel
                key={editingSvc?.idx ?? 'new'}
                initial={editingSvc
                  ? { name: editingSvc.name, price: editingSvc.price, capacity: editingSvc.capacity, duration: editingSvc.duration }
                  : EMPTY
                }
                onSave={handleSave}
                saving={saving}
                editingName={editingSvc?.name ?? null}
              />

              {editingSvc && (
                <button onClick={() => setEditingSvc(null)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  marginTop: 8, width: '100%', padding: '11px',
                  background: 'none', border: `2px solid #e8e0d8`,
                  fontSize: 12, fontWeight: 800, color: GOLD_DK,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = DARK; e.currentTarget.style.color = DARK }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e0d8'; e.currentTarget.style.color = GOLD_DK }}
                >
                  <X size={13} strokeWidth={2.5} /> Annuler la modification
                </button>
              )}
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
                <div style={{ padding: '56px 0', textAlign: 'center', border: `2px dashed ${GOLD}` }}>
                  <Utensils size={36} color={GOLD} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: DARK }}>Aucun service configuré</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>Ajoutez votre premier service à gauche</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {services.map(svc => (
                    <ServiceCard
                      key={svc.idx}
                      svc={svc}
                      isEditing={editingSvc?.idx === svc.idx}
                      onEdit={s => setEditingSvc(s)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </FadeUp>
      </div>
    </>
  )
}