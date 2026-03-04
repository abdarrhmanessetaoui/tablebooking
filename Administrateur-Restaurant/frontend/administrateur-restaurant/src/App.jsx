import { Route, Routes } from "react-router-dom"
import Login from "./components/login"

function App() {
 

  return (
    <>
<div className="max-w-6xl mx-auto">
  <header className="w-full flex items-center px-8 py-3" style={{ backgroundColor: '#1e1208' }}>
    <img src="/tablebooking.png" alt="TableBooking Logo" className="h-10 object-contain" />
  </header>
</div>
      <div className="max-w-7xl mt-6">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
