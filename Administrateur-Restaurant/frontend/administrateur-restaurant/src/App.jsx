import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, lazy, Suspense } from 'react'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import Layout         from './components/Layout'
import ToastContainer from './components/ui/Toast'
import ConfirmDialog  from './components/ui/ConfirmDialog'
import Spinner        from './components/Dashboard/Spinner'

// Lazy loaded pages for performance
const Login        = lazy(() => import('./pages/login'))
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Reservations = lazy(() => import('./pages/Reservations'))
const BlockedDates = lazy(() => import('./pages/BlockedDates'))
const Calendar     = lazy(() => import('./pages/Calendar'))
const Reports      = lazy(() => import('./pages/Reports'))
const Settings     = lazy(() => import('./pages/Settings'))
const Services     = lazy(() => import('./pages/Services'))
const Tables       = lazy(() => import('./pages/Tables'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

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
        
        <Suspense fallback={<Spinner fullPage delay={0} />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/password-reset/:token" element={<ResetPassword />} />
            
            {/* Authenticated Routes with Layout */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard"     element={<Dashboard />} />
              <Route path="/reservations"  element={<Reservations />} />
              <Route path="/blocked-dates" element={<BlockedDates />} />
              <Route path="/calendar"      element={<Calendar />} />
              <Route path="/reports"       element={<Reports />} />
              <Route path="/services"      element={<Services />} />
              <Route path="/tables"        element={<Tables />} />
              <Route path="/settings"      element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
