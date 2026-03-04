import { Route, Routes } from "react-router-dom"
import Login from "./components/login"

function App() {
 

  return (
    <>
    <header className="w-full flex items-center px-8 py-3" style={{ backgroundColor: '#1e1208' }}>
      <img src="images/tablebooking.png" alt="TableBooking Logo" className="h-10 object-contain" />
    </header>
    <Routes>
      <Route path="/login" element={<Login />} />
      
    </Routes>
  </>
  )
}

export default App
