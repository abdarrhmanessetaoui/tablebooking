import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Utensils, Users, Clock, DollarSign } from 'lucide-react'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { getToken } from '../utils/auth'
import { toast }   from '../components/ui/Toast'
import { confirm } from '../components/ui/ConfirmDialog'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const API  = 'http://localhost:8000/api/services'

const headers = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
})

const EMPTY = { name: '', price: '', capacity: '', duration: '' }

function Field({ label, icon: Icon, value, onChange, type = 'text', suffix }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, fontWeight: 900, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Icon size={13} strokeWidth={2.5} color="#bbb"
            style={{ position: 'absolute', left: 11, pointerEvents: 'none' }} />
        )}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', padding: `10px 12px 10px ${Icon ? '32px' : '12px'}`,
            paddingRight: suffix ? 36 : 12,
            background: '#fff', border: '2px solid #e8e0d8',
            fontSize: 13, fontWeight: 600, color: DARK,
            fontFamily: 'inherit', outline: 'none', borderRadius: 0,
            boxSizing: 'border-box',
          }}
          onFocus={e  => e.target.style.borderColor = DARK}
          onBlur={e   => e.target.style.borderColor = '#e8e0d8'}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 11, fontSize: 11, fontWeight: 700, color: '#bbb' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function ServiceForm({ initial = EMPTY, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name.trim() && form.price !== '' && form.capacity !== '' && form.duration !== ''

  return (
    <div style={{
      background: '#fff', border: `2px solid ${DARK}`,
      padding: '20px 20px 16px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Nom du service" icon={Utensils} value={form.name} onChange={set('name')} />
        </div>
        <Field label="Prix"     icon={DollarSign} value={form.price}    onChange={set('price')}    type="number" suffix="dh" />
        <Field label="Capacité" icon={Users}      value={form.capacity} onChange={set('capacity')} type="number" suffix="pers." />
        <Field label="Durée"    icon={Clock}      value={form.duration} onChange={set('duration')} type="number" suffix="min" />
      </div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', background: '#fff',
          border: '2px solid #e8e0d8', color: '#888',
          fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <X size={13} strokeWidth={2.5} /> Annuler
        </button>
        <button onClick={() => valid && onSave(form)} disabled={!valid || saving} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px',
          background: valid ? DARK : '#e8e0d8',
          border: 'none',
          color: valid ? GOLD : '#bbb',
          fontSize: 12, fontWeight: 800,
          cursor: valid ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', transition: 'all 0.15s',
        }}>
          <Check size={13} strokeWidth={2.5} />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

function ServiceCard({ svc, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: `2px solid ${hov ? DARK : '#e8e0d8'}`,
        transition: 'border-color 0.15s',
        display: 'grid', gridTemplateColumns: '3px 1fr auto',
      }}
    >
      <div style={{ background: GOLD }} />
      <div style={{ padding: '16px 18px' }}>
        <p style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
          {svc.name}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { Icon: DollarSign, value: svc.price > 0 ? `${svc.price} dh` : 'Gratuit', gold: true },
            { Icon: Users,      value: `${svc.capacity} pers. max` },
            { Icon: Clock,      value: `${svc.duration} min` },
          ].map(({ Icon, value, gold }, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px',
              background: gold ? '#fdf6ec' : '#f5f0eb',
              fontSize: 11, fontWeight: 700,
              color: gold ? '#a8834e' : DARK,
            }}>
              <Icon size={11} strokeWidth={2.5} color={gold ? GOLD : DARK} />
              {value}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e8e0d8' }}>
        <button onClick={() => onEdit(svc)} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px', background: 'none', border: 'none',
          borderBottom: '1px solid #e8e0d8',
          color: '#888', cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#888' }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(svc)} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px', background: 'none', border: 'none',
          color: '#ccc', cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fdf0f0'; e.currentTarget.style.color = '#b94040' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#ccc' }}
        >
          <Trash2 size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  const [services,  setServices]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [editingSvc, setEditingSvc] = useState(null)
  const [saving,    setSaving]    = useState(false)

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

  useEffect(() => { fetchServices() }, [])

  async function handleSave(form) {
    setSaving(true)
    try {
      const res = await fetch(API, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({
          name:     form.name,
          price:    parseFloat(form.price)    || 0,
          capacity: parseInt(form.capacity)   || 1,
          duration: parseInt(form.duration)   || 60,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setServices(prev => [...prev, data])
      setShowForm(false)
      toast(`Service "${form.name}" ajouté`, 'success')
    } catch {
      toast('Impossible d\'ajouter le service', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(form) {
    setSaving(true)
    try {
      const res = await fetch(`${API}/${editingSvc.idx}`, {
        method: 'PUT', headers: headers(),
        body: JSON.stringify({
          name:     form.name,
          price:    parseFloat(form.price)    || 0,
          capacity: parseInt(form.capacity)   || 1,
          duration: parseInt(form.duration)   || 60,
        }),
      })
      if (!res.ok) throw new Error()
      setServices(prev => prev.map(s =>
        s.idx === editingSvc.idx
          ? { ...s, name: form.name, price: parseFloat(form.price), capacity: String(form.capacity), duration: String(form.duration) }
          : s
      ))
      setEditingSvc(null)
      toast(`Service "${form.name}" modifié`, 'success')
    } catch {
      toast('Impossible de modifier le service', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(svc) {
    const ok = await confirm({
      title:        'Supprimer le service',
      message:      `Voulez-vous supprimer "${svc.name}" ?`,
      sub:          'Les réservations existantes ne seront pas affectées.',
      confirmLabel: 'Supprimer',
      type:         'danger',
    })
    if (!ok) return
    try {
      await fetch(`${API}/${svc.idx}`, { method: 'DELETE', headers: headers() })
      setServices(prev => prev.filter(s => s.idx !== svc.idx))
      toast(`Service "${svc.name}" supprimé`, 'warning')
    } catch {
      toast('Impossible de supprimer le service', 'error')
    }
  }

  if (loading) return <Spinner />

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .btn-label     { display: none !important; }
          .page-subtitle { display: none !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#faf8f5',
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(16px,3vw,40px) clamp(12px,3vw,36px)',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
        <FadeUp delay={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
                Services
              </h1>
              <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD }}>
                {services.length} service{services.length !== 1 ? 's' : ''} configuré{services.length !== 1 ? 's' : ''}
              </p>
            </div>
            {!showForm && !editingSvc && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '11px 20px', background: DARK, border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = DARK }}
                onMouseLeave={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = '#fff' }}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span className="btn-label">Nouveau service</span>
              </button>
            )}
          </div>
        </FadeUp>

        {/* DIVIDER */}
        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, marginBottom: 24 }} />
        </FadeUp>

        {/* ERROR */}
        {error && (
          <FadeUp delay={15}>
            <div style={{ marginBottom: 16, padding: '11px 16px', background: '#fdf0f0', borderLeft: '3px solid #b94040', fontSize: 12, fontWeight: 700, color: '#b94040' }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* ADD FORM */}
        {showForm && (
          <FadeUp delay={0}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 900, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Nouveau service
              </p>
              <ServiceForm
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
                saving={saving}
              />
            </div>
          </FadeUp>
        )}

        {/* LIST */}
        <FadeUp delay={20}>
          {services.length === 0 && !showForm ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <Utensils size={40} color="rgba(43,33,24,0.1)" strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 16px' }} />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'rgba(43,33,24,0.2)' }}>Aucun service configuré</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.15)' }}>Ajoutez votre premier service</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {services.map(svc => (
                editingSvc?.idx === svc.idx ? (
                  <div key={svc.idx}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 900, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Modifier — {svc.name}
                    </p>
                    <ServiceForm
                      key={svc.idx}
                      initial={{ name: svc.name, price: svc.price, capacity: svc.capacity, duration: svc.duration }}
                      onSave={handleUpdate}
                      onCancel={() => setEditingSvc(null)}
                      saving={saving}
                    />
                  </div>
                ) : (
                  <ServiceCard
                    key={svc.idx}
                    svc={svc}
                    onEdit={s => { setShowForm(false); setEditingSvc(s) }}
                    onDelete={handleDelete}
                  />
                )
              ))}
            </div>
          )}
        </FadeUp>
      </div>
    </>
  )
}