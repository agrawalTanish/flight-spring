import { useState } from 'react'
import { flightService } from '../services/flightService'
import { Plane, AlertTriangle, CheckCircle, ArrowRight, Save } from 'lucide-react'
import BoardingPassModal from './BoardingPassModal'

export default function FlightForm() {
  const [formData, setFormData] = useState({
    code: '',
    carrier: '',
    source: '',
    destination: '',
    cost: '',
  })
  const [passengerName, setPassengerName] = useState('')
  const [registeredFlight, setRegisteredFlight] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const codeRegex = /^[A-Z]{2}-\d{3,4}$/
    if (!codeRegex.test(formData.code)) {
      setError('Flight code must match format XX-123 or XX-1234 (e.g. AI-101 or AA-1234)')
      return false
    }
    if (!formData.carrier.trim()) {
      setError('Carrier is required')
      return false
    }
    if (!formData.source.trim()) {
      setError('Source is required')
      return false
    }
    if (!formData.destination.trim()) {
      setError('Destination is required')
      return false
    }
    if (parseFloat(formData.cost) <= 0 || isNaN(parseFloat(formData.cost))) {
      setError('Cost must be a positive number')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const flightToSave = {
        ...formData,
        cost: parseFloat(formData.cost),
      }
      await flightService.save(flightToSave)
      
      setSuccess('Flight schedule added successfully! Generating boarding pass...')
      setRegisteredFlight(flightToSave)
      setIsModalOpen(true)
      
      setFormData({
        code: '',
        carrier: '',
        source: '',
        destination: '',
        cost: '',
      })
      setPassengerName('')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to save flight. Please verify if database is active or check duplicate code.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      
      <div className="mb-8 pl-4 border-l-4 border-blue-500">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Add New Flight</h2>
        <p className="text-slate-500 mt-1">Fill out the boarding pass to register a new route schedule</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="ticket-container flex flex-col md:flex-row bg-white border border-slate-200 rounded-3xl shadow-xl relative overflow-hidden transition-all hover:shadow-2xl hover:border-blue-200">
        
        {/* Ticket Punches (Inner Circles) */}
        <div className="ticket-punch-left hidden md:block"></div>
        <div className="ticket-punch-right hidden md:block"></div>

        {/* MAIN TICKET BODY (Left Section - Inputs) */}
        <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-dashed border-slate-300 relative bg-slate-50/50">
          
          <div className="flex items-center gap-2 mb-8">
            <span className="p-2 bg-blue-100 text-blue-600 rounded-xl border border-blue-200">
              <Plane className="w-5 h-5 rotate-45" />
            </span>
            <span className="font-bold text-slate-700 tracking-widest uppercase text-sm">Official Flight Registry</span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Flight Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. AA-102"
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold placeholder-slate-300 focus:ring-0 text-lg"
                  required
                />
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Carrier / Airline</label>
                <input
                  type="text"
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleChange}
                  placeholder="e.g. American Airlines"
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold placeholder-slate-300 focus:ring-0 text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center bg-blue-100 rounded-full w-8 h-8 border border-blue-200">
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Source Route</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. Nagpur"
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold placeholder-slate-300 focus:ring-0 text-lg"
                  required
                />
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Destination Route</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold placeholder-slate-300 focus:ring-0 text-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all relative">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Ticket Cost (INR)</label>
                <div className="flex items-center">
                  <span className="text-slate-400 font-bold mr-1">₹</span>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="e.g. 3500"
                    step="0.01"
                    className="w-full bg-transparent border-none p-0 text-blue-600 font-bold placeholder-blue-300 focus:ring-0 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-200 shadow-inner focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-[10px] uppercase font-bold text-blue-500 tracking-wider mb-1">Passenger Name (Optional)</label>
                <input
                  type="text"
                  name="passengerName"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Personalize boarding pass"
                  className="w-full bg-transparent border-none p-0 text-slate-900 font-bold placeholder-blue-300/60 focus:ring-0 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TICKET STUB (Right Section - Submit) */}
        <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-center bg-slate-50 border-l border-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)] z-10">
          
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-blue-100 mb-4 border border-blue-200">
              <Save className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Confirm Details</h3>
            <p className="text-xs text-slate-500 mt-2">Verify the inputs on the boarding pass and click confirm to register the flight to the database.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider"
          >
            <span>{loading ? 'Processing...' : 'Issue Ticket'}</span>
            <Plane className="w-4 h-4" />
          </button>
          
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-full flex items-center justify-between text-slate-300 opacity-60">
              {[...Array(20)].map((_, i) => (
                <span
                  key={i}
                  className="inline-block bg-current h-full"
                  style={{
                    width: `${[1, 2, 3, 4][Math.floor((Math.sin(i * 13) + 1) * 2) % 4]}px`,
                    marginRight: '2px'
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>

      </form>

      <BoardingPassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flight={registeredFlight}
        passengerName={passengerName}
      />
    </div>
  )
}
