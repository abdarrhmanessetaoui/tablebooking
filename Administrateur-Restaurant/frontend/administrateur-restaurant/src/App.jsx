import { Route, Routes } from "react-router-dom"
import Login from "./components/login"

function App() {
 

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1>Administrateur Restaurant</h1>
      </div>
      <div className="bg-blue-500 text-white text-4xl p-10">
      Tailwind Khddam
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
