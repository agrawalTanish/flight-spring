import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import FlightList from './components/FlightList'
import FlightForm from './components/FlightForm'
import FlightSearch from './components/FlightSearch'

export default function App() {
  return (
    <div class="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      <Navbar />
      
      <main class="flex-grow py-6">
        <Routes>
          <Route path="/" element={<FlightList />} />
          <Route path="/add" element={<FlightForm />} />
          <Route path="/search" element={<FlightSearch />} />
        </Routes>
      </main>

      <footer class="border-t border-slate-900 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} AeroFlow Aviation. All rights reserved. Target Platform: Spring Boot & React.</p>
        </div>
      </footer>
    </div>
  )
}
