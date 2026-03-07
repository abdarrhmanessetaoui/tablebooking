import { useState, useEffect } from "react"
import { CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react"
import Card from "./Card"
import useCountUp from "../../hooks/Dashboard/useCountUp"

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {

  const n  = useCountUp(value, 800, 150)
  const c  = useCountUp(confirmed, 700, 320)
  const p  = useCountUp(pending, 700, 400)
  const ca = useCountUp(cancelled, 700, 480)

  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setBar(rate), 900)
    return () => clearTimeout(t)
  }, [rate])

  return (
    <Card onClick={onClick}>

      {/* header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>

          <span className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
            En direct · Aujourd'hui
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition">
          Voir tout
          <ChevronRight size={16}/>
        </div>

      </div>

      {/* big number */}
      <div className="flex items-end gap-4 mb-8">

        <span className="text-[88px] font-black leading-none text-gray-900 tracking-tight tabular-nums">
          {n}
        </span>

        <div className="pb-2">
          <p className="text-lg font-semibold text-gray-900">
            réservations
          </p>
          <p className="text-sm text-gray-400">
            ce soir
          </p>
        </div>

      </div>

      {/* status cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">

        <StatusBox
          icon={CheckCircle2}
          value={c}
          label="Confirmées"
          color="emerald"
        />

        <StatusBox
          icon={Clock}
          value={p}
          label="En attente"
          color="amber"
        />

        <StatusBox
          icon={XCircle}
          value={ca}
          label="Annulées"
          color="red"
        />

      </div>

      {/* progress */}
      <div>

        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">
            Taux de confirmation
          </span>

          <span className="font-bold text-gray-900">
            {rate}%
          </span>
        </div>

        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-amber-900 to-amber-500 transition-all duration-1000 ease-out"
            style={{ width: `${bar}%` }}
          />

        </div>

      </div>

    </Card>
  )
}


function StatusBox({ icon: Icon, value, label, color }) {

  const colors = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    red: "bg-red-50 border-red-200 text-red-700"
  }

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>

      <Icon size={18} className="mb-2"/>

      <p className="text-2xl font-bold text-gray-900 tabular-nums">
        {value}
      </p>

      <p className="text-xs font-semibold">
        {label}
      </p>

    </div>
  )
}