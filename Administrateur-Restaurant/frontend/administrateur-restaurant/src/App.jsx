import { Route, Routes } from "react-router-dom"
import Login from "./components/login"

function App() {
 

  return (
    <>
    {/* Header — full width, no container */}
    <header className="w-full flex items-center px-8 py-3" style={{ backgroundColor: '#1e1208' }}>
      <img src="/tablebooking.png" alt="TableBooking Logo" className="h-10 object-contain" />
    </header>

    {/* Routes — login handles its own full-screen background */}
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </>
  )
}

export default App
