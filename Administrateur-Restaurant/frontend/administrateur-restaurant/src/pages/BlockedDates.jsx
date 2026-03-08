import { useState } from 'react'
import { CalendarOff } from 'lucide-react'
import useBlockedDates from '../hooks/useBlockedDates'
import BlockedDateForm from '../components/BlockedDateForm'
import BlockedDateList from '../components/BlockedDateList'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

export default function BlockedDates() {
  const {
    blockedDates, loading, error,
    form, setForm,
    submitting,
    handleBlock, handleUnblock,
  } = useBlockedDates()

  if (loading) return <Spinner />

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      padding: 'clamp(28px,4vw,56px) clamp(20px,3.5vw,48px)',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <FadeUp delay={0}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:40, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
              <CalendarOff size={28} strokeWidth={2} color={DARK} />
              <h1 style={{ margin:0, fontSize:'clamp(28px,4vw,42px)', fontWeight:900, color:DARK, letterSpacing:'-1.5px', lineHeight:1 }}>
                Dates bloquées
              </h1>
            </div>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:GOLD }}>
              Les dates bloquées ne peuvent pas être réservées par les clients.
            </p>
          </div>
        </div>
      </FadeUp>

      {/* ── Divider ── */}
      <FadeUp delay={20}>
        <div style={{ height:2, background:DARK, marginBottom:48 }} />
      </FadeUp>

      {/* ── Error ── */}
      {error && (
        <FadeUp delay={30}>
          <div style={{ marginBottom:24, padding:'12px 18px', background:'#fdf0f0', borderLeft:`3px solid #b94040`, fontSize:13, fontWeight:700, color:'#b94040' }}>
            {error}
          </div>
        </FadeUp>
      )}

      {/* ── Form ── */}
      <FadeUp delay={50}>
        <div style={{ marginBottom:16 }}>
          <h2 style={{ margin:'0 0 6px', fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>
            Bloquer une date
          </h2>
          <p style={{ margin:0, fontSize:12, fontWeight:700, color:GOLD }}>
            Sélectionnez une date ou une période à bloquer
          </p>
        </div>
        <div style={{ marginTop:24 }}>
          <BlockedDateForm
            form={form}
            setForm={setForm}
            handleBlock={handleBlock}
            submitting={submitting}
          />
        </div>
      </FadeUp>

      {/* ── Divider ── */}
      <FadeUp delay={80}>
        <div style={{ height:2, background:DARK, margin:'48px 0' }} />
      </FadeUp>

      {/* ── List ── */}
      <FadeUp delay={100}>
        <div style={{ marginBottom:28 }}>
          <h2 style={{ margin:'0 0 6px', fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>
            Dates bloquées
          </h2>
          <p style={{ margin:0, fontSize:12, fontWeight:700, color:GOLD }}>
            {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} bloquée{blockedDates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <BlockedDateList
          blockedDates={blockedDates}
          handleUnblock={handleUnblock}
        />
      </FadeUp>

    </div>
  )
}