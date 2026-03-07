import { useState } from 'react'
import { Pencil } from 'lucide-react'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const STATUS = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', color: '#a8834e', label: 'En attente' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040', label: 'Annulée'    },
}

function EditBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px',
        background: hov ? DARK : '#f5f0eb',
        border: 'none', borderRadius: 0,
        fontSize: 12, fontWeight: 800,
        color: hov ? GOLD : DARK,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      <Pencil size={12} strokeWidth={2.5} />
      Modifier
    </button>
  )
}

export default function ReservationsTable({ reservations, openEdit }) {
  const cols = ['Nom', 'Téléphone', 'Date', 'Heure', 'Couverts', 'Service', 'Statut', '']

  return (
    <div style={{
      background: '#fff',
      overflow: 'auto',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr style={{ background: DARK }}>
            {cols.map(c => (
              <th key={c} style={{
                padding: '13px 18px', textAlign: 'left',
                fontSize: 10, fontWeight: 900, color: GOLD,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r, i) => {
            const s = STATUS[r.status] || { bg: '#f5f5f5', color: '#888', label: r.status || '—' }
            return (
              <tr
                key={r.id}
                style={{
                  background: i % 2 === 0 ? '#fff' : '#faf8f5',
                  borderBottom: '1px solid #f0ebe4',
                }}
              >
                <td style={{ padding: '14px 18px', fontSize: 14, fontWeight: 800, color: DARK }}>{r.name || '—'}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 600, color: '#888' }}>{r.phone || '—'}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: DARK }}>{r.date || '—'}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: DARK }}>{r.start_time || '—'}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700, color: DARK, textAlign: 'center' }}>{r.guests || '—'}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 600, color: '#888' }}>{r.service || '—'}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: s.bg,
                    fontSize: 11, fontWeight: 900,
                    color: s.color, letterSpacing: '0.04em',
                  }}>
                    {s.label}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <EditBtn onClick={() => openEdit(r)} />
                </td>
              </tr>
            )
          })}

          {reservations.length === 0 && (
            <tr>
              <td colSpan={8} style={{
                padding: '48px 24px', textAlign: 'center',
                fontSize: 14, fontWeight: 700, color: '#bbb',
              }}>
                Aucune réservation trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}