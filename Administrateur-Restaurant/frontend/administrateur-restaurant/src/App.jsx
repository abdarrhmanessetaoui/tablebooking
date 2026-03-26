import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login        from './pages/login'
import Dashboard    from './pages/Dashboard'
import Reservations from './pages/Reservations'
import BlockedDates from './pages/BlockedDates'
import Calendar     from './pages/Calendar'
import Reports      from './pages/Reports'
import Settings     from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import Layout         from './components/Layout'
import ToastContainer from './components/ui/Toast'
import ConfirmDialog  from './components/ui/ConfirmDialog'
import Services from './pages/Services'
import Tables from './pages/Tables'

import { useEffect } from 'react'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
  }, [i18n.language])

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <BrowserRouter>
        <ToastContainer />
        <ConfirmDialog />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard"     element={<ProtectedRoute><Layout><Dashboard    /></Layout></ProtectedRoute>} />
          <Route path="/reservations"  element={<ProtectedRoute><Layout><Reservations /></Layout></ProtectedRoute>} />
          <Route path="/blocked-dates" element={<ProtectedRoute><Layout><BlockedDates /></Layout></ProtectedRoute>} />
          <Route path="/calendar"      element={<ProtectedRoute><Layout><Calendar     /></Layout></ProtectedRoute>} />
          <Route path="/reports"       element={<ProtectedRoute><Layout><Reports      /></Layout></ProtectedRoute>} />
          <Route path="/services"     element={<ProtectedRoute><Layout><Services     /></Layout></ProtectedRoute>} />
          <Route path="/tables" element={<ProtectedRoute><Layout><Tables /></Layout></ProtectedRoute>} />
          <Route path="/settings"      element={<ProtectedRoute><Layout><Settings     /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App