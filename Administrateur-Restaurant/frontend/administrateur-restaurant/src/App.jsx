import { Route, Routes } from "react-router-dom"


function App() {
 

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <h1>Administrateur Restaurant</h1>
      </div>
      <div className="max-w-7xl mt-6">
      <Routes></Routes>
        <Route path="/login" element={<Login />} />
      </div>
    </>
  )
}

export default App
