import { useState } from 'react'
import { flightService } from '../services/flightService'
import { Search, Compass, DollarSign, RotateCcw, AlertCircle, Trash2 } from 'lucide-react'

export default function FlightSearch() {
  const [activeTab, setActiveTab] = useState('code')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [codeQuery, setCodeQuery] = useState('')
  const [carrierQuery, setCarrierQuery] = useState('')
  const [routeQuery, setRouteQuery] = useState({ source: '', destination: '' })
  const [priceQuery, setPriceQuery] = useState({ min: '', max: '' })

  const handleReset = () => {
    setResults([])
    setSearched(false)
    setError('')
    setCodeQuery('')
    setCarrierQuery('')
    setRouteQuery({ source: '', destination: '' })
    setPriceQuery({ min: '', max: '' })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setSearched(false)
    setLoading(true)

    try {
      let data = []
      if (activeTab === 'code') {
        if (!codeQuery.trim()) {
          setError('Flight code query cannot be empty')
          setLoading(false)
          return
        }
        try {
          const single = await flightService.findByCode(codeQuery.trim())
          data = single ? [single] : []
        } catch (err) {
          if (err.response && err.response.status === 404) {
            data = []
          } else {
            throw err;
          }
        }
      } else if (activeTab === 'carrier') {
        if (!carrierQuery.trim()) {
          setError('Carrier name cannot be empty')
          setLoading(false)
          return
        }
        data = await flightService.findByCarrier(carrierQuery.trim())
      } else if (activeTab === 'route') {
        if (!routeQuery.source.trim() || !routeQuery.destination.trim()) {
          setError('Both source and destination routes are required')
          setLoading(false)
          return
        }
        data = await flightService.findByRoute(routeQuery.source.trim(), routeQuery.destination.trim())
      } else if (activeTab === 'price') {
        const minVal = parseFloat(priceQuery.min)
        const maxVal = parseFloat(priceQuery.max)
        if (isNaN(minVal) || isNaN(maxVal) || minVal < 0 || maxVal < 0) {
          setError('Minimum and maximum ticket prices must be positive numbers')
          setLoading(false)
          return
        }
        if (minVal > maxVal) {
          setError('Minimum price cannot be greater than maximum price')
          setLoading(false)
          return
        }
        data = await flightService.findByPriceRange(minVal, maxVal)
      }

      setResults(data)
      setSearched(true)
    } catch (err) {
      setError('An error occurred while communicating with the flight database.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to delete flight ${code}?`)) return
    try {
      await flightService.deleteFlight(code)
      setResults((prev) => prev.filter((f) => f.code !== code))
    } catch (err) {
      alert('Failed to delete flight schedule.')
    }
  }

  return (
    <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-white">Search Hub</h1>
        <p class="text-slate-400 mt-1 text-sm">Query unique flight paths, price windows, carrier portfolios, and codes</p>
      </div>

      <div class="glass-card rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div class="flex flex-wrap gap-2 border-b border-slate-800 pb-5">
          {[
            { id: 'code', label: 'Flight Code', icon: Search },
            { id: 'carrier', label: 'Airline / Carrier', icon: Search },
            { id: 'route', label: 'Route (Src ➔ Dest)', icon: Compass },
            { id: 'price', label: 'Price Range', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setError('')
                }}
                class={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon class="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {error && (
          <div class="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} class="flex flex-col md:flex-row md:items-end gap-5">
          <div class="flex-1">
            {activeTab === 'code' && (
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enter Flight Code
                </label>
                <input
                  type="text"
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  placeholder="e.g. AA-101"
                  class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                  required
                />
              </div>
            )}

            {activeTab === 'carrier' && (
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enter Airline Carrier
                </label>
                <input
                  type="text"
                  value={carrierQuery}
                  onChange={(e) => setCarrierQuery(e.target.value)}
                  placeholder="e.g. Air India"
                  class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                  required
                />
              </div>
            )}

            {activeTab === 'route' && (
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Source Route
                  </label>
                  <input
                    type="text"
                    value={routeQuery.source}
                    onChange={(e) => setRouteQuery((prev) => ({ ...prev, source: e.target.value }))}
                    placeholder="e.g. Nagpur"
                    class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Destination Route
                  </label>
                  <input
                    type="text"
                    value={routeQuery.destination}
                    onChange={(e) => setRouteQuery((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Pune"
                    class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'price' && (
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Minimum Price (INR)
                  </label>
                  <input
                    type="number"
                    value={priceQuery.min}
                    onChange={(e) => setPriceQuery((prev) => ({ ...prev, min: e.target.value }))}
                    placeholder="Min e.g. 1000"
                    class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Maximum Price (INR)
                  </label>
                  <input
                    type="number"
                    value={priceQuery.max}
                    onChange={(e) => setPriceQuery((prev) => ({ ...prev, max: e.target.value }))}
                    placeholder="Max e.g. 5000"
                    class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              <Search class="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              class="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RotateCcw class="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Search Results ({results.length})</h3>
          </div>

          {results.length === 0 ? (
            <div class="glass-card rounded-3xl py-12 px-4 text-center">
              <Compass class="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p class="text-slate-300 font-medium">No Matching Flights Found</p>
              <p class="text-slate-500 text-xs mt-1">Adjust search parameters or select a different tab option.</p>
            </div>
          ) : (
            <div class="glass-card rounded-3xl overflow-hidden border border-slate-800">
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
                    {results.map((flight) => (
                      <tr key={flight.id} class="hover:bg-slate-800/20 transition-all">
                        <td class="px-6 py-4.5">
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
                        <td class="px-6 py-4.5 text-right">
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
      )}
    </div>
  )
}
