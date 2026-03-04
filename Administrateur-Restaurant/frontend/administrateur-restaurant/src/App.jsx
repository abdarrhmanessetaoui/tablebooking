import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## 🚀 Quick Start Checklist
```
1. php artisan migrate
2. Create user via tinker (see step 3 above)
3. php artisan serve          → runs on :8000
4. npm run dev                → runs React on :5173
5. Login with admin@example.com / password123