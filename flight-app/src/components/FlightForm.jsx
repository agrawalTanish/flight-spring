import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { flightService } from '../services/flightService'
import { Plane, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

export default function FlightForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: '',
    carrier: '',
    source: '',
    destination: '',
    cost: '',
  })
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
      await flightService.save({
        ...formData,
        cost: parseFloat(formData.cost),
      })
      setSuccess('Flight schedule added successfully!')
      setFormData({
        code: '',
        carrier: '',
        source: '',
        destination: '',
        cost: '',
      })
      setTimeout(() => navigate('/'), 2000)
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
    <div class="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <div class="glass-card glow-indigo rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>

        <div class="flex items-center gap-3 mb-8">
          <div class="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
            <Plane class="w-6 h-6 rotate-45" />
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Register Flight</h2>
            <p class="text-slate-400 text-sm mt-0.5">Insert flight details to schedule a new route</p>
          </div>
        </div>

        {error && (
          <div class="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div class="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle class="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success} Redirecting to dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Flight Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. AA-102"
                class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Carrier / Airline</label>
              <input
                type="text"
                name="carrier"
                value={formData.carrier}
                onChange={handleChange}
                placeholder="e.g. American Airlines"
                class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Source</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="e.g. Nagpur"
                class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Pune"
                class="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Ticket Cost (INR)</label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g. 3500"
                step="0.01"
                class="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 scale-100 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{loading ? 'Registering...' : 'Register Flight'}</span>
            <ArrowRight class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
