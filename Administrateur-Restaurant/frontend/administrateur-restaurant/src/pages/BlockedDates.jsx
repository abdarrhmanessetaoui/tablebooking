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
      minHeight: '100vh', background: '#fff',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } .bd-wrap { max-width: 1020px; margin: 0 auto; padding: clamp(28px,4vw,56px) clamp(20px,3.5vw,48px); }`}</style>

      <div className="bd-wrap">

        {/* ── PAGE HEADER ── */}
        <FadeUp delay={0}>
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:52 }}>
            <div>
              <h1 style={{ margin:0, fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:DARK, letterSpacing:'-2px', lineHeight:1 }}>
                Dates bloquées
              </h1>
              <p style={{ margin:'7px 0 0', fontSize:13, fontWeight:700, color:GOLD }}>
                Les dates bloquées ne peuvent pas être réservées par les clients.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* ── ERROR ── */}
        {error && (
          <FadeUp delay={10}>
            <div style={{ marginBottom:32, padding:'12px 18px', borderLeft:`3px solid #b94040`, background:'#fdf0f0', fontSize:13, fontWeight:700, color:'#b94040' }}>
              {error}
            </div>
          </FadeUp>
        )}

        {/* ── BLOQUER UNE DATE ── */}
        <FadeUp delay={30}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>
              Bloquer une date
            </h2>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>
              Sélectionnez une date à bloquer pour les clients
            </p>
          </div>
          <BlockedDateForm
            form={form}
            setForm={setForm}
            handleBlock={handleBlock}
            submitting={submitting}
          />
        </FadeUp>

        {/* ── DIVIDER ── */}
        <FadeUp delay={60}>
          <div style={{ height:2, background:DARK, margin:'52px 0' }} />
        </FadeUp>

        {/* ── LIST ── */}
        <FadeUp delay={80}>
          <div style={{ marginBottom:28 }}>
            <h2 style={{ margin:0, fontSize:'clamp(20px,2.5vw,28px)', fontWeight:900, color:DARK, letterSpacing:'-0.8px' }}>
              Dates bloquées
            </h2>
            <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:700, color:GOLD }}>
              {blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} bloquée{blockedDates.length !== 1 ? 's' : ''}
            </p>
          </div>
          <BlockedDateList
            blockedDates={blockedDates}
            handleUnblock={handleUnblock}
          />
        </FadeUp>

      </div>
    </div>
  )
}