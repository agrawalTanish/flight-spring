import { useState, useEffect } from 'react'
import { Plane, PlusCircle, Search, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const [activeHash, setActiveHash] = useState('#dashboard')

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || '#dashboard')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isActive = (hash) => activeHash === hash

  const navLinkClass = (hash) => 
    `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive(hash)
        ? 'bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-blue-500/5 shadow-inner'
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
    }`

  return (
    <nav className="sticky top-0 z-50 glass-card bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#dashboard" onClick={() => setActiveHash('#dashboard')} className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                <Plane className="w-6 h-6 rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-blue-600 bg-clip-text text-transparent">
                DDFlights
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a href="#dashboard" onClick={() => setActiveHash('#dashboard')} className={navLinkClass('#dashboard')}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </a>

            <a href="#add-flight" onClick={() => setActiveHash('#add-flight')} className={navLinkClass('#add-flight')}>
              <PlusCircle className="w-4 h-4" />
              <span>Add Flight</span>
            </a>

            <a href="#search" onClick={() => setActiveHash('#search')} className={navLinkClass('#search')}>
              <Search className="w-4 h-4" />
              <span>Search Hub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
