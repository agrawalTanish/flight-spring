import { useMemo } from 'react'
import { X, Printer, Plane, Calendar, CreditCard, Bookmark } from 'lucide-react'

// Helper to get realistic airport codes
const getAirportCode = (city) => {
  if (!city) return 'N/A'
  const normalized = city.trim().toLowerCase()
  const mappings = {
    nagpur: 'NAG',
    pune: 'PNQ',
    mumbai: 'BOM',
    delhi: 'DEL',
    bangalore: 'BLR',
    bengaluru: 'BLR',
    hyderabad: 'HYD',
    chennai: 'MAA',
    kolkata: 'CCU',
    goa: 'GOI',
    ahmedabad: 'AMD',
    kochi: 'COK',
    london: 'LHR',
    paris: 'CDG',
    'new york': 'JFK',
    singapore: 'SIN',
    dubai: 'DXB',
  }
  return mappings[normalized] || city.substring(0, 3).toUpperCase()
}

export default function BoardingPassModal({ isOpen, onClose, flight, passengerName }) {
  if (!isOpen || !flight) return null

  // Memoize random details so they remain constant during the modal's open state
  const ticketDetails = useMemo(() => {
    const gates = ['A-12', 'A-18', 'B-04', 'B-09', 'C-02', 'C-15']
    const randomGate = gates[Math.floor(Math.random() * gates.length)]
    
    const seatRow = Math.floor(Math.random() * 30) + 1
    const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]
    const randomSeat = `${seatRow.toString().padStart(2, '0')}${seatLetter}`
    
    const randomHour = Math.floor(Math.random() * 12) + 1
    const randomMinute = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)]
    const randomAmpm = Math.random() > 0.5 ? 'AM' : 'PM'
    const randomTime = `${randomHour}:${randomMinute} ${randomAmpm}`

    // Class based on ticket cost
    let flightClass = 'ECONOMY'
    let classColor = 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-600'
    if (flight.cost > 10000) {
      flightClass = 'FIRST CLASS'
      classColor = 'from-amber-500/25 to-yellow-600/15 border-amber-500/30 text-amber-300'
    } else if (flight.cost > 5000) {
      flightClass = 'BUSINESS CLASS'
      classColor = 'from-sky-500/25 to-purple-600/15 border-sky-500/30 text-purple-300'
    }

    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    return {
      gate: randomGate,
      seat: randomSeat,
      boardingTime: randomTime,
      flightClass,
      classColor,
      date: today
    }
  }, [flight.code, flight.cost])

  const srcCode = getAirportCode(flight.source)
  const destCode = getAirportCode(flight.destination)
  const displayName = passengerName ? passengerName.trim() : 'DDFlights Explorer'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm no-print">
      <div className="relative w-full max-w-4xl bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/15 text-blue-400 rounded-lg">
              <Plane className="w-4 h-4 rotate-45" />
            </span>
            <h3 className="font-bold text-slate-900 text-lg">DDFlights Boarding Pass Voucher</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable container for the ticket content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
          
          {/* Printable Ticket Area */}
          <div className="printable-ticket ticket-container flex flex-col md:flex-row bg-white border border-slate-200/80 rounded-3xl shadow-lg relative">
            
            {/* Ticket Punches (Inner Circles) */}
            <div className="ticket-punch-left hidden md:block"></div>
            <div className="ticket-punch-right hidden md:block"></div>

            {/* MAIN TICKET BODY (Left Section) */}
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-dashed border-slate-200 relative">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${ticketDetails.classColor}`}>
                    {ticketDetails.flightClass}
                  </span>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-3 tracking-wide">{flight.carrier}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">OPERATED BY DDFlights</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-400 font-bold tracking-wider px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    {flight.code}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-medium">{ticketDetails.date}</p>
                </div>
              </div>

              {/* Flight Route Visual */}
              <div className="grid grid-cols-7 items-center gap-2 mb-8 bg-slate-50/40 p-4 rounded-2xl border border-slate-900/60">
                <div className="col-span-2">
                  <h5 className="text-3xl md:text-4xl font-black text-slate-900 leading-none tracking-tight">{srcCode}</h5>
                  <p className="text-xs text-slate-400 mt-1.5 truncate font-medium">{flight.source}</p>
                </div>
                <div className="col-span-3 flex flex-col items-center justify-center relative px-2">
                  <div className="w-full border-t-2 border-dashed border-blue-500/35 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full border border-blue-500/20 text-blue-400">
                      <Plane className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <h5 className="text-3xl md:text-4xl font-black text-slate-900 leading-none tracking-tight">{destCode}</h5>
                  <p className="text-xs text-slate-400 mt-1.5 truncate font-medium">{flight.destination}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Passenger Name</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 truncate">{displayName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Boarding Time</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{ticketDetails.boardingTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gate</p>
                  <p className="font-bold text-blue-400 text-sm mt-0.5">{ticketDetails.gate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Seat Number</p>
                  <p className="font-bold text-sky-400 text-sm mt-0.5">{ticketDetails.seat}</p>
                </div>
              </div>
            </div>

            {/* TICKET STUB (Right Section) */}
            <div className="w-full md:w-72 p-6 md:p-8 flex flex-col justify-between bg-slate-50/20">
              <div>
                <div className="flex justify-between items-center gap-2 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Passenger Receipt</span>
                  <span className="text-xs font-bold text-slate-400">{flight.code}</span>
                </div>
                
                <h5 className="font-bold text-slate-800 text-base truncate">{displayName}</h5>
                
                <div className="mt-4 space-y-3 bg-white/40 p-3.5 rounded-xl border border-slate-950/50">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-semibold text-slate-600">{srcCode} ➔ {destCode}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Gate / Seat:</span>
                    <span className="font-semibold text-slate-600">{ticketDetails.gate} / {ticketDetails.seat}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Fare Total:</span>
                    <span className="font-bold text-blue-400">₹{flight.cost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* barcode block */}
              <div className="mt-8 flex flex-col items-center">
                <div className="h-10 w-full flex items-center justify-between text-slate-400 px-2 opacity-85">
                  {[...Array(26)].map((_, i) => {
                    const widths = [1, 2, 3, 4]
                    const randomWidth = widths[Math.floor((Math.sin(i + 5) + 1) * 2) % 4]
                    return (
                      <span
                        key={i}
                        className="barcode-line"
                        style={{
                          width: `${randomWidth}px`,
                          marginRight: i % 3 === 0 ? '2px' : '1px'
                        }}
                      ></span>
                    )
                  })}
                </div>
                <p className="text-[9px] font-mono tracking-widest text-slate-600 mt-2">DDF-{flight.code}-{ticketDetails.seat}</p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white text-sm font-semibold transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 text-sm font-semibold shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  )
}
