import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import Reservations from './pages/Reservations'
import BlockedDates from './pages/BlockedDates'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

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
        <Route path="/blocked-dates" element={
          <ProtectedRoute><Layout><BlockedDates /></Layout></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App