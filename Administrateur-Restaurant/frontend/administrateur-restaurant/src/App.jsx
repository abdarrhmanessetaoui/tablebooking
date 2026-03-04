import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Reservations from './pages/Reservations'
import BlockedDates from './pages/BlockedDates'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        } />

        <Route path="/reservations" element={
          <ProtectedRoute><Layout><Reservations /></Layout></ProtectedRoute>
        } />
                <Route path="/calendar" element={
  <ProtectedRoute><Layout><Calendar /></Layout></ProtectedRoute>
} />
        <Route path="/blocked-dates" element={
          <ProtectedRoute><Layout><BlockedDates /></Layout></ProtectedRoute>
        } />
        <Route path="/reports" element={
  <ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App