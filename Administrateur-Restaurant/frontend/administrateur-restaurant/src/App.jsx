import { Route, Routes } from "react-router-dom"
import Login from "./components/login"

function App() {
 

  return (
    <>
<div className="max-w-7xl mx-auto mt-6">
  <h1>Administrateur Restaurant</h1>
  <Routes>
    <Route path="/login" element={<Login />} />
  </Routes>
</div>
    </>
  )
}

export default App
