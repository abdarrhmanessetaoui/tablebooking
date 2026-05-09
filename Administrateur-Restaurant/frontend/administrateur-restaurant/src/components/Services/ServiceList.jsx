import { useState } from 'react'
import { Pencil, Trash2, Utensils, Users, Clock, DollarSign } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DARK    = '#2D2926'
const LIGHT_BROWN    = '#C19A6B'
const BORDER  = '#E5E0DA'
const RED     = '#EF4444'

function ServiceRow({ svc, isEditing, onEdit, onDelete }) {
  const { t } = useTranslation()
  const DAYS_SHORT = [
    t('services_module.dim_short'), t('services_module.lun_short'), t('services_module.mar_short'),
    t('services_module.mer_short'), t('services_module.jeu_short'), t('services_module.ven_short'),
    t('services_module.sam_short')
  ]
  const availDays   = svc.available_days ?? [0,1,2,3,4,5,6]
  const allDays     = availDays.length === 7

  const colStyle = { padding: '16px 12px', minWidth: 0, display: 'flex', alignItems: 'center' }
  const dataTextStyle = { fontSize: '13px', fontWeight: '800', color: DARK }

  return (
    <div className="svc-row" style={{
      display: 'grid', gridTemplateColumns: '1.5fr 80px 100px 80px 1.5fr auto',
      background: isEditing ? '#FAF7F4' : '#ffffff',
      transition: 'none',
      alignItems: 'center',
    }}>
      {/* Column 1: Name */}
      <div style={{ ...colStyle, paddingLeft: '20px' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: DARK }}>
          {svc.name}
        </p>
      </div>

      {/* Column 2: Price */}
      <div style={colStyle}>
        <span style={dataTextStyle}>
          {Number(svc.price) > 0 ? `${svc.price} dh` : t('services_module.free')}
        </span>
      </div>

      {/* Column 3: Capacity */}
      <div style={colStyle}>
        <span style={dataTextStyle}>
          {svc.capacity}
        </span>
      </div>

      {/* Column 4: Duration */}
      <div style={colStyle}>
        <span style={dataTextStyle}>
          {svc.duration} MIN
        </span>
      </div>

      {/* Column 5: Days row */}
      <div style={{ ...colStyle, gap: 4, flexWrap: 'wrap' }}>
        {allDays ? (
          <span style={{ fontSize: '10px', fontWeight: '900', color: LIGHT_BROWN, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('services_module.every_day')}
          </span>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            {DAYS_SHORT.filter((_, i) => availDays.includes(i)).map((day, i) => (
              <span key={i} style={{
                fontSize: '10px', fontWeight: '900', color: LIGHT_BROWN,
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                {day}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Column 6: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}>
        <button onClick={() => onEdit(svc)} title={t('services_module.edit')}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '12px',
            background: LIGHT_BROWN, border: 'none', color: '#fff',
            cursor: 'pointer', transition: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(svc)} title={t('services_module.delete')}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '12px',
            background: RED, border: 'none', color: '#fff',
            cursor: 'pointer', transition: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default function ServiceList({ services, editingSvc, onEdit, onDelete }) {
  const { t } = useTranslation()
  if (services.length === 0) {
    return (
      <div style={{ padding: '64px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
        <Utensils size={40} color={BORDER} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 16px' }} />
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: DARK }}>{t('services_module.no_services_configured')}</p>
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: DARK, fontWeight: '800' }}>
          {t('services_module.use_form_to_add')}
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px', border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: 'none' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 80px 100px 80px 1.5fr auto',
        padding: '12px 20px', background: LIGHT_BROWN, borderBottom: 'none',
        borderTopLeftRadius: '12px', borderTopRightRadius: '12px'
      }}>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('services_module.service_name_col')}</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRIX</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CAPACITÉ</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DURÉE</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('services_module.available_days')}</span>
        <span style={{ fontSize: '10px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', paddingRight: '20px' }}>{t('services_module.actions')}</span>
      </div>
      {services.map((svc) => (
        <ServiceRow
          key={svc.idx} svc={svc}
          isEditing={editingSvc?.idx === svc.idx}
          onEdit={onEdit} onDelete={onDelete}
        />
      ))}
    </div>
  )
}
