import React from "react"

export default function CitizenMapCard({ zone, onClose, onReportClick }) {
  if (!zone) return null

  const getRiskColor = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return {
          bg: "bg-red-500/15",
          border: "border-red-500/40",
          text: "text-red-400",
          badge: "bg-red-500",
          icon: "🔴",
          label: "Critical Risk Zone"
        }
      case "HIGH":
        return {
          bg: "bg-orange-500/15",
          border: "border-orange-500/40",
          text: "text-orange-400",
          badge: "bg-orange-500",
          icon: "🟠",
          label: "High Risk Zone"
        }
      case "MODERATE":
        return {
          bg: "bg-yellow-500/15",
          border: "border-yellow-500/40",
          text: "text-yellow-400",
          badge: "bg-yellow-500",
          icon: "🟡",
          label: "Moderate Risk Zone"
        }
      default:
        return {
          bg: "bg-emerald-500/15",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          badge: "bg-emerald-500",
          icon: "🟢",
          label: "Low / Normal Zone"
        }
    }
  }

  const style = getRiskColor(zone.risk)

  return (
    <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-96 z-30 rounded-2xl border border-[#1e3445] bg-[#0d1726]/95 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{style.icon}</span>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}>
              {zone.risk} Risk
            </span>
            <h3 className="mt-1 text-base font-bold text-white leading-tight">
              {zone.location}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#64748b] hover:text-white transition p-1 rounded-lg hover:bg-[#1e3445]"
          title="Close card"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 space-y-2.5 text-xs text-[#94a3b8]">
        <div className="flex justify-between border-b border-[#1e3445]/60 pb-2">
          <span className="text-[#64748b] font-medium">Pollution Type:</span>
          <span className="font-semibold text-white">{zone.pollution_type}</span>
        </div>

        <div className="flex justify-between border-b border-[#1e3445]/60 pb-2">
          <span className="text-[#64748b] font-medium">Reports Nearby:</span>
          <span className="font-semibold text-[#20e0c0]">{zone.reports_nearby} verified complaints</span>
        </div>

        <div className="flex justify-between border-b border-[#1e3445]/60 pb-2">
          <span className="text-[#64748b] font-medium">Last Updated:</span>
          <span className="text-white">{zone.last_updated}</span>
        </div>

        <div className="flex justify-between border-b border-[#1e3445]/60 pb-2">
          <span className="text-[#64748b] font-medium">Investigation Status:</span>
          <span className="font-semibold text-[#38bdf8]">{zone.status}</span>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#08121f] border border-[#1e3445]">
          <p className="text-[11px] font-semibold text-[#20e0c0] uppercase tracking-wider mb-1">
            Public Health Advisory
          </p>
          <p className="text-xs text-[#e2e8f0] leading-relaxed">
            {zone.advisory}
          </p>
        </div>
      </div>

      {onReportClick && (
        <button
          onClick={onReportClick}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#00bfa6] to-[#20e0c0] py-2.5 text-xs font-bold text-[#06101e] shadow-lg shadow-[#00bfa6]/20 transition hover:brightness-110"
        >
          Report Incident In This Area →
        </button>
      )}
    </div>
  )
}
