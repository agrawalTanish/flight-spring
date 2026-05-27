import Navbar from './components/Navbar'
import FlightList from './components/FlightList'
import FlightForm from './components/FlightForm'
import FlightSearch from './components/FlightSearch'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans scroll-smooth">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <section id="dashboard" className="scroll-mt-20 border-b border-slate-200 bg-white/50 pb-16">
          <FlightList />
        </section>
        
        <section id="add-flight" className="scroll-mt-20 border-b border-slate-200 bg-[#f8fafc] py-16">
          <FlightForm />
        </section>
        
        <section id="search" className="scroll-mt-20 bg-white/50 py-16">
          <FlightSearch />
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} DDFlights Airways. All rights reserved. Target Platform: Spring Boot & React.</p>
        </div>
      </footer>
    </div>
  )
}
