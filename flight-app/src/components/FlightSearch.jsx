import { useState } from 'react'
import { flightService } from '../services/flightService'
import { Search, Compass, DollarSign, RotateCcw, AlertCircle, Trash2, Ticket } from 'lucide-react'
import BoardingPassModal from './BoardingPassModal'

export default function FlightSearch() {
  const [activeTab, setActiveTab] = useState('code')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            throw err
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

  const handleViewTicket = (flight) => {
    setSelectedFlight(flight)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Search Hub</h1>
        <p className="text-slate-400 mt-1 text-sm">Query unique flight paths, price windows, carrier portfolios, and codes</p>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5">
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-white hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-5">
          <div className="flex-1">
            {activeTab === 'code' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enter Flight Code
                </label>
                <input
                  type="text"
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  placeholder="e.g. AA-101"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
            )}

            {activeTab === 'carrier' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Enter Airline Carrier
                </label>
                <input
                  type="text"
                  value={carrierQuery}
                  onChange={(e) => setCarrierQuery(e.target.value)}
                  placeholder="e.g. Air India"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                  required
                />
              </div>
            )}

            {activeTab === 'route' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Source Route
                  </label>
                  <input
                    type="text"
                    value={routeQuery.source}
                    onChange={(e) => setRouteQuery((prev) => ({ ...prev, source: e.target.value }))}
                    placeholder="e.g. Nagpur"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Destination Route
                  </label>
                  <input
                    type="text"
                    value={routeQuery.destination}
                    onChange={(e) => setRouteQuery((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Pune"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'price' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Minimum Price (INR)
                  </label>
                  <input
                    type="number"
                    value={priceQuery.min}
                    onChange={(e) => setPriceQuery((prev) => ({ ...prev, min: e.target.value }))}
                    placeholder="Min e.g. 1000"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Maximum Price (INR)
                  </label>
                  <input
                    type="number"
                    value={priceQuery.max}
                    onChange={(e) => setPriceQuery((prev) => ({ ...prev, max: e.target.value }))}
                    placeholder="Max e.g. 5000"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-700 text-slate-600 font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Search Results ({results.length})</h3>
          </div>

          {results.length === 0 ? (
            <div className="glass-card rounded-3xl py-12 px-4 text-center">
              <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No Matching Flights Found</p>
              <p className="text-slate-400 text-xs mt-1">Adjust search parameters or select a different tab option.</p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Flight Code</th>
                      <th className="px-6 py-4">Carrier / Airline</th>
                      <th className="px-6 py-4">Route</th>
                      <th className="px-6 py-4">Ticket Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {results.map((flight) => (
                      <tr key={flight.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/10">
                            {flight.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">{flight.carrier}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">{flight.source}</span>
                            <span className="text-blue-500/70">➔</span>
                            <span className="font-semibold text-slate-800">{flight.destination}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-semibold text-sm">
                          ₹{flight.cost.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewTicket(flight)}
                              title="View Boarding Pass"
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all scale-100 hover:scale-105 active:scale-95"
                            >
                              <Ticket className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(flight.code)}
                              title="Delete Flight"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all scale-100 hover:scale-105 active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      <BoardingPassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flight={selectedFlight}
        passengerName="DDFlights Passenger"
      />
    </div>
  )
}
