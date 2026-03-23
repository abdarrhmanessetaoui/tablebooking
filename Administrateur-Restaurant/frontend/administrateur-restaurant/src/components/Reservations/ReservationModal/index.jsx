import { useState } from 'react'
import { createPortal } from 'react-dom'
import useModalData   from '../../../hooks/Reservations/useModalData.js'
import useTimeSlots   from '../../../hooks/Reservations/useTimeSlots.js'
import ModalHeader    from './ModalHeader.jsx'
import ViewMode       from './modes/ViewMode.jsx'
import EditMode       from './modes/EditMode.jsx'
import StepService    from './steps/StepService.jsx'
import StepDateTime   from './steps/StepDateTime.jsx'
import StepContact    from './steps/StepContact.jsx'
import { overlayStyle, panelStyle } from '../../../styles/reservations/modal.styles.js'

export default function ReservationModal({
  modalMode,
  editing = false,
  form = {},
  setForm = () => {},
  handleSubmit = () => {},
  handleCreate = () => {},
  handleDelete = () => {},
  setModalMode = () => {}
}) {
  const [step, setStep] = useState(1)

  const close = () => {
    setModalMode?.(null)
    setStep(1)
  }

  const { services = [], allOH = [], workingDates = [], blockedDates = [] } = useModalData() || {}
  const { selectedSvc, maxGuests, disabledDays, timeSlots, openDaysLabel } = useTimeSlots({
    form, setForm, services, allOH, workingDates
  })

  return createPortal(
    <div style={overlayStyle}>
      <div style={panelStyle}>
        <ModalHeader modalMode={modalMode} step={step} editing={editing} onClose={close} />

        {/* Progress bar */}
        {modalMode === 'create' && (
          <div style={{ display:'flex', height:3 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{
                flex:1,
                background: s <= step ? '#c8a97e' : '#e8e0d8',
                transition:'background 0.3s'
              }} />
            ))}
          </div>
        )}

        <div style={{ padding:'24px 26px', display:'flex', flexDirection:'column', gap:20 }}>
          {/* View Mode */}
          {modalMode === 'view' && editing && (
            <ViewMode
              editing={editing}
              setForm={setForm}
              setModalMode={setModalMode}
              handleDelete={handleDelete}
            />
          )}

          {/* Edit Mode */}
          {modalMode === 'edit' && (
            <EditMode
              editing={editing}
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              onClose={close}
            />
          )}

          {/* Create Mode Steps */}
          {modalMode === 'create' && step === 1 && (
            <StepService
              form={form}
              setForm={setForm}
              services={services}
              selectedSvc={selectedSvc}
              maxGuests={maxGuests}
              openDaysLabel={openDaysLabel}
              onNext={() => {
                if (!form?.service) { alert('Veuillez choisir une formule.'); return }
                if (!form?.guests) { alert('Veuillez choisir le nombre de personnes.'); return }
                setStep(2)
              }}
            />
          )}

          {modalMode === 'create' && step === 2 && (
            <StepDateTime
              form={form}
              setForm={setForm}
              blockedDates={blockedDates}
              disabledDays={disabledDays}
              timeSlots={timeSlots}
              selectedSvc={selectedSvc}
              onBack={() => setStep(1)}
              onNext={() => {
                if (!form?.date) { alert('Veuillez choisir une date.'); return }
                if (!form?.start_time) { alert('Veuillez choisir une heure.'); return }
                setStep(3)
              }}
            />
          )}

          {modalMode === 'create' && step === 3 && (
            <StepContact
              form={form}
              setForm={setForm}
              onBack={() => setStep(2)}
              onSubmit={() => {
                if (!form?.name) { alert('Le nom est obligatoire.'); return }
                handleCreate?.()
                setStep(1)
              }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}