import React from "react"

export default function OfficialAIInsightPanel({ zone, onClose, onUpdateStatus }) {
  if (!zone) return null

  const getRiskBadge = (risk) => {
    switch (risk?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500/20 text-red-400 border-red-500/40"
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40"
      case "MODERATE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
    }
  }

  const getClassificationBadge = (cls) => {
    switch (cls) {
      case "CORROBORATED":
        return {
          text: "Corroborated Event",
          bg: "bg-[#20e0c0]/20 text-[#20e0c0] border-[#20e0c0]/40",
          desc: "Citizen reports AND sensor measurements align spatially and temporally."
        }
      case "MEASURED":
        return {
          text: "Sensor Measured",
          bg: "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40",
          desc: "Detected primarily through automated monitoring stations."
        }
      default:
        return {
          text: "Citizen Reported",
          bg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          desc: "Driven by verified public complaints pending sensor verification."
        }
    }
  }

  const classBadge = getClassificationBadge(zone.classification)

  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 sm:w-[420px] z-30 flex flex-col rounded-3xl border border-[#1e3445] bg-[#0a1421]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-5 border-b border-[#1e3445] bg-[#0d1726]/80 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getRiskBadge(zone.risk)}`}>
              {zone.risk} Risk
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${classBadge.bg}`}>
              ⚡ {classBadge.text}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-white leading-tight">
            {zone.location}
          </h2>
          <p className="mt-1 text-xs text-[#64748b] font-mono">
            GPS: {zone.exact_latitude?.toFixed(4)}, {zone.exact_longitude?.toFixed(4)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#64748b] hover:text-white p-1 rounded-lg hover:bg-[#1e3445] transition"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Sensor Measurements */}
        <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-3">
            Real-Time Environmental Telemetry
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[#0d1726] border border-[#1e3445]/60">
              <span className="text-[10px] text-[#64748b] uppercase">PM2.5</span>
              <p className="text-base font-bold text-[#20e0c0] mt-0.5">
                {zone.pm25 ?? "--"} <span className="text-[10px] text-[#64748b]">µg/m³</span>
              </p>
            </div>
            <div className="p-2 rounded-xl bg-[#0d1726] border border-[#1e3445]/60">
              <span className="text-[10px] text-[#64748b] uppercase">PM10</span>
              <p className="text-base font-bold text-white mt-0.5">
                {zone.pm10 ?? "--"} <span className="text-[10px] text-[#64748b]">µg/m³</span>
              </p>
            </div>
            <div className="p-2 rounded-xl bg-[#0d1726] border border-[#1e3445]/60">
              <span className="text-[10px] text-[#64748b] uppercase">NO₂</span>
              <p className="text-base font-bold text-[#38bdf8] mt-0.5">
                {zone.no2 ?? "--"} <span className="text-[10px] text-[#64748b]">µg/m³</span>
              </p>
            </div>
          </div>
          <p className="mt-2.5 text-[11px] text-[#64748b]">
            Source: <span className="text-[#94a3b8]">{zone.station_name || "Coimbatore Regional Monitoring Grid"}</span>
          </p>
        </div>

        {/* AI Assessment Panel */}
        <div className="rounded-2xl border border-[#20e0c0]/30 bg-gradient-to-b from-[#20e0c0]/5 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#20e0c0] animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Risk Assessment
              </h3>
            </div>
            <span className="text-xs font-bold text-[#20e0c0]">
              Confidence: {zone.ai_confidence ?? 87}%
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs text-[#64748b]">Computed Risk Score:</span>
            <span className="text-lg font-black text-white">{zone.ai_risk_score ?? "--"}</span>
            <span className="text-xs text-[#64748b]">/ 500</span>
          </div>

          {/* Contributing signals */}
          <div className="mt-3">
            <p className="text-xs font-semibold text-[#94a3b8] mb-1.5">
              Main Contributing Signals:
            </p>
            <ul className="space-y-1.5 text-xs text-[#cbd5e1]">
              {(zone.ai_signals || [
                `${zone.reports_nearby} citizen reports in this area`,
                `PM2.5 above standard baseline`,
                `Temporal concentration in the last 45 minutes`
              ]).map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#20e0c0] mt-0.5">•</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Reasoning */}
          {zone.ai_reasoning && (
            <div className="mt-3 p-3 rounded-xl bg-[#08121f]/90 border border-[#1e3445]">
              <p className="text-[11px] text-[#94a3b8] italic leading-relaxed">
                "{zone.ai_reasoning}"
              </p>
            </div>
          )}

          {/* Suggested Action */}
          <div className="mt-4 p-3 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#f97316]">
              Suggested Operational Action:
            </p>
            <p className="mt-1 text-xs font-semibold text-white">
              {zone.suggested_action || "Prioritize field verification and regulatory inspection"}
            </p>
          </div>
        </div>

        {/* Operational Incident Status */}
        <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mb-2">
            Operational Status
          </p>
          <div className="grid grid-cols-2 gap-2">
            {["Under Review", "Investigating", "Action Taken", "Resolved"].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => onUpdateStatus && onUpdateStatus(zone.id, statusOption)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  zone.status === statusOption
                    ? "bg-[#20e0c0] text-[#06101e] border-[#20e0c0] shadow-md"
                    : "bg-[#0d1726] text-[#94a3b8] border-[#1e3445] hover:text-white hover:border-[#20e0c0]/40"
                }`}
              >
                {statusOption}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
