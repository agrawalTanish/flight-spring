import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { flightService } from '../services/flightService'
import { Trash2, ShieldAlert, PlaneTakeoff, Info, ArrowUpRight, DollarSign } from 'lucide-react'

export default function FlightList() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFlights = async () => {
    try {
      setLoading(true)
      const data = await flightService.list()
      setFlights(data)
    } catch (err) {
      setError('Could not connect to flight database. Ensure the Spring Boot backend is active.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to delete flight ${code}?`)) return
    try {
      await flightService.deleteFlight(code)
      setFlights((prev) => prev.filter((f) => f.code !== code))
    } catch (err) {
      alert('Failed to delete flight schedule.')
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const averageCost = flights.length
    ? (flights.reduce((acc, curr) => acc + curr.cost, 0) / flights.length).toFixed(2)
    : 0

  const cheapestFlight = flights.length
    ? flights.reduce((prev, curr) => (prev.cost < curr.cost ? prev : curr))
    : null

  return (
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">Flight Control Center</h1>
          <p class="text-slate-400 mt-1 text-sm md:text-base">Real-time scheduling logs, routing metrics, and operations dashboard</p>
        </div>
        <Link
          to="/add"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/35 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Schedule New Flight</span>
          <ArrowUpRight class="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div class="flex items-start gap-3 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <ShieldAlert class="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-sm">Database Connectivity Issue</h4>
            <p class="text-rose-400/80 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} class="h-32 glass-card rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Flights</p>
            <p class="text-3xl font-extrabold text-white mt-2">{flights.length}</p>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <PlaneTakeoff class="w-4 h-4" />
              <span>Active schedules in database</span>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-violet-500/10 rounded-full blur-xl"></div>
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Average Ticket Cost</p>
            <p class="text-3xl font-extrabold text-white mt-2">₹{averageCost}</p>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-violet-400 font-medium">
              <DollarSign class="w-4 h-4" />
              <span>Mean ticket routing price</span>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cheapest Route</p>
            <p class="text-3xl font-extrabold text-white mt-2">
              {cheapestFlight ? `₹${cheapestFlight.cost}` : 'N/A'}
            </p>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Info class="w-4 h-4" />
              <span class="truncate">
                {cheapestFlight ? `${cheapestFlight.source} ➔ ${cheapestFlight.destination} (${cheapestFlight.code})` : 'No routes registered'}
              </span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div class="h-64 glass-card rounded-3xl animate-pulse"></div>
      ) : flights.length === 0 ? (
        <div class="glass-card rounded-3xl py-16 px-4 text-center">
          <PlaneTakeoff class="w-12 h-12 text-slate-600 mx-auto rotate-45 mb-4" />
          <h3 class="text-lg font-bold text-white">No Flights Scheduled</h3>
          <p class="text-slate-400 text-sm mt-1">Get started by creating a new unique flight schedule.</p>
          <Link
            to="/add"
            class="inline-flex items-center gap-1.5 px-4 py-2 mt-6 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/25 text-sm font-semibold hover:bg-indigo-600 hover:text-white hover:scale-105 transition-all"
          >
            Schedule First Flight
          </Link>
        </div>
      ) : (
        <div class="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-800">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/60 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th class="px-6 py-4">Flight Code</th>
                  <th class="px-6 py-4">Carrier / Airline</th>
                  <th class="px-6 py-4">Route</th>
                  <th class="px-6 py-4">Ticket Price</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                {flights.map((flight) => (
                  <tr key={flight.id} class="hover:bg-slate-800/20 transition-all group">
                    <td class="px-6 py-4.5 whitespace-nowrap">
                      <span class="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/10">
                        {flight.code}
                      </span>
                    </td>
                    <td class="px-6 py-4.5 font-medium text-slate-200">
                      {flight.carrier}
                    </td>
                    <td class="px-6 py-4.5">
                      <div class="flex items-center gap-2 text-sm text-slate-300">
                        <span class="font-semibold text-slate-200">{flight.source}</span>
                        <span class="text-slate-500">➔</span>
                        <span class="font-semibold text-slate-200">{flight.destination}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4.5 text-slate-300 font-semibold text-sm">
                      ₹{flight.cost.toLocaleString('en-IN')}
                    </td>
                    <td class="px-6 py-4.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(flight.code)}
                        class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all scale-100 hover:scale-105 active:scale-95"
                      >
                        <Trash2 class="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
