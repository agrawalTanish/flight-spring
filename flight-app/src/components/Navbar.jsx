import { Link, useLocation } from 'react-router-dom'
import { Plane, PlusCircle, Search, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav class="sticky top-0 z-50 glass-card bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <Link to="/" class="flex items-center gap-2 group">
              <div class="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
                <Plane class="w-6 h-6 rotate-45" />
              </div>
              <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                AeroFlow
              </span>
            </Link>
          </div>

          <div class="flex items-center gap-2">
            <Link
              to="/"
              class={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-indigo-500/5 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <LayoutDashboard class="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/add"
              class={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/add')
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-indigo-500/5 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <PlusCircle class="w-4 h-4" />
              <span>Add Flight</span>
            </Link>

            <Link
              to="/search"
              class={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/search')
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-indigo-500/5 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Search class="w-4 h-4" />
              <span>Search Hub</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
