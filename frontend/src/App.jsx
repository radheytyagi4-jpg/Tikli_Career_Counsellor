
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingPage.jsx'
import TikliAI from './pages/TikliAI.jsx'
import Login from './pages/Login.jsx'
import Chats from './pages/Chats.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/TikliAI" element={<TikliAI />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Chats" element={<Chats/>} />
    </Routes>
  )
}

export default App