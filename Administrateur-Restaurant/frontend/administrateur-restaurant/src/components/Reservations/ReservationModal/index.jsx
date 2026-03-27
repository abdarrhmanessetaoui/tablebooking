import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import useModalData   from '../../../hooks/Reservations/useModalData'
import useTimeSlots   from '../../../hooks/Reservations/useTimeSlots'
import ModalHeader    from './ModalHeader'
import ViewMode       from './modes/ViewMode'
import EditMode       from './modes/EditMode'
import StepService    from './steps/StepService'
import StepDateTime   from './steps/StepDateTime'
import StepContact    from './steps/StepContact'
import { overlayStyle, panelStyle } from '../../../styles/reservations/modal.styles'

export default function ReservationModal({ modalMode, editing, form, setForm, handleSubmit, handleCreate, handleDelete, setModalMode }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const close = () => { setModalMode(null); setStep(1) }

  const { services, allOH, workingDates, blockedDates } = useModalData()
  const { selectedSvc, maxGuests, disabledDays, timeSlots, openDaysLabel } = useTimeSlots({ form, setForm, services, allOH, workingDates })

  return createPortal(
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <ModalHeader modalMode={modalMode} step={step} editing={editing} onClose={close} />

        {/* Progress bar */}
        {modalMode === 'create' && (
          <div style={{ display:'flex', height:3 }}>
            {[1,2,3].map(s => <div key={s} style={{ flex:1, background:s<=step?'#c8a97e':'#e8e0d8', transition:'background 0.3s' }} />)}
          </div>
        )}

        <div style={{ padding:'24px 26px', display:'flex', flexDirection:'column', gap:20 }}>
          {modalMode==='view' && editing && (
            <ViewMode editing={editing} setForm={setForm} setModalMode={setModalMode} handleDelete={handleDelete} />
          )}
          {modalMode==='edit' && (
            <EditMode editing={editing} form={form} setForm={setForm} handleSubmit={handleSubmit} onClose={close} />
          )}
          {modalMode==='create' && step===1 && (
            <StepService form={form} setForm={setForm} services={services} selectedSvc={selectedSvc} maxGuests={maxGuests} openDaysLabel={openDaysLabel}
              onNext={() => { if(!form.service){alert(t('choose_formula_alert'));return} if(!form.guests){alert(t('choose_guests_alert'));return} setStep(2) }} />
          )}
          {modalMode==='create' && step===2 && (
            <StepDateTime form={form} setForm={setForm} blockedDates={blockedDates} disabledDays={disabledDays} timeSlots={timeSlots} selectedSvc={selectedSvc}
              onBack={() => setStep(1)}
              onNext={() => { if(!form.date){alert(t('choose_date_alert'));return} if(!form.start_time){alert(t('choose_time_alert'));return} setStep(3) }} />
          )}
          {modalMode==='create' && step===3 && (
            <StepContact form={form} setForm={setForm} onBack={() => setStep(2)}
              onSubmit={() => { if(!form.name){alert(t('name_required_alert'));return} handleCreate(); setStep(1) }} />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
