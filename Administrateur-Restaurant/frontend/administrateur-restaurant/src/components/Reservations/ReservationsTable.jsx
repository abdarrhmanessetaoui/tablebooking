import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const STATUS = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', color: '#a8834e', label: 'En attente' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040', label: 'Annulée'    },
}

function ActionBtn({ onClick, icon: Icon, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: danger
          ? (hov ? '#b94040' : '#fdf0f0')
          : (hov ? DARK : '#f5f0eb'),
        border: 'none', cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <Icon size={14} strokeWidth={2.5}
        color={danger ? (hov ? '#fff' : '#b94040') : (hov ? GOLD : DARK)} />
    </button>
  )
}

export default function ReservationsTable({ reservations, openView, openEdit, handleDelete }) {
  const cols = ['Nom', 'Téléphone', 'Date', 'Heure', 'Couverts', 'Service', 'Statut', 'Actions']

  return (
    <div style={{ background: '#fff', overflow: 'auto', fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
        <thead>
          <tr style={{ background: DARK }}>
            {cols.map(c => (
              <th key={c} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => {
            const s = STATUS[r.status] || { bg: '#f5f5f5', color: '#888', label: r.status || '—' }
            return (
              <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#faf8f5', borderBottom: '1px solid #f0ebe4' }}>
                <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 800, color: DARK }}>{r.name || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: '#888' }}>{r.phone || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: DARK }}>{r.date || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: DARK }}>{r.start_time || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: DARK, textAlign: 'center' }}>{r.guests || '—'}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: '#888' }}>{r.service || '—'}</td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', background: s.bg, fontSize: 11, fontWeight: 900, color: s.color }}>
                    {s.label}
                  </span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <ActionBtn icon={Eye}    onClick={() => openView(r)} />
                    <ActionBtn icon={Pencil} onClick={() => openEdit(r)} />
                    <ActionBtn icon={Trash2} onClick={() => handleDelete(r.id)} danger />
                  </div>
                </td>
              </tr>
            )
          })}
          {reservations.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#bbb' }}>
                Aucune réservation trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}