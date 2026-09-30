import React from "react"

export default function CitizenReportDetailsModal({
  report,
  onClose,
  onUpdateStatus
}) {
  if (!report) return null

  const getRiskBadge = (risk) => {
    switch ((risk || "").toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/40",
          text: "text-red-400",
          icon: "🔴",
          label: "Critical"
        }
      case "high":
        return {
          bg: "bg-orange-500/20",
          border: "border-orange-500/40",
          text: "text-orange-400",
          icon: "🟠",
          label: "High"
        }
      case "moderate":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/40",
          text: "text-yellow-400",
          icon: "🟡",
          label: "Moderate"
        }
      default:
        return {
          bg: "bg-emerald-500/20",
          border: "border-emerald-500/40",
          text: "text-emerald-400",
          icon: "🟢",
          label: "Low / Normal"
        }
    }
  }

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "resolved":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      case "in progress":
      case "investigating":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400"
      case "under review":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400"
      default:
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
    }
  }

  const riskStyle = getRiskBadge(report.risk)
  const reportType = report.pollution_type || report.type || report.pollutionType || "Air Pollution"
  const rawDate = report.timestamp || report.createdAt || report.submittedAt || report.date || report.updatedAt
  let formattedDate = rawDate || "Date unavailable"
  if (rawDate) {
    try {
      const parsed = new Date(rawDate)
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toLocaleString()
      }
    } catch {
      formattedDate = rawDate
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#1e3445] bg-[#0d1726] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e3445] bg-[#08121f]">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#1e3445] px-3 py-1 font-mono text-xs font-bold text-[#38bdf8]">
              Report #{report.id}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskStyle.bg} ${riskStyle.border} ${riskStyle.text}`}>
              <span>{riskStyle.icon}</span>
              <span>{riskStyle.label} Risk</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(report.status)}`}>
              {report.status || "Pending"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#1e3445] hover:text-white transition"
            title="Close details"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Location & Type */}
          <div>
            <p className="text-xs uppercase tracking-wider text-[#64748b]">Incident Type</p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {reportType}
            </h2>
            <p className="mt-2 text-sm text-[#cbd5e1] flex items-center gap-1.5">
              <span className="text-[#38bdf8]">📍</span>
              <span className="font-medium">{report.location || "Location not specified"}</span>
            </p>
            {report.latitude != null && report.longitude != null && (
              <p className="mt-1 font-mono text-xs text-[#64748b]">
                GPS Coordinates: {Number(report.latitude).toFixed(6)}, {Number(report.longitude).toFixed(6)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-1.5">
              Citizen Description
            </p>
            <p className="text-sm text-[#e2e8f0] leading-relaxed italic">
              "{report.description || "No description provided."}"
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#1e3445]/60 bg-[#08121f] p-3">
              <span className="text-[#64748b] block">Submitted By</span>
              <span className="font-semibold text-white mt-1 block">
                {report.userName || "Public Citizen"}
              </span>
              {report.email && (
                <span className="text-[11px] text-[#64748b] truncate block mt-0.5">
                  {report.email}
                </span>
              )}
            </div>

            <div className="rounded-xl border border-[#1e3445]/60 bg-[#08121f] p-3">
              <span className="text-[#64748b] block">Submitted At</span>
              <span className="font-semibold text-white mt-1 block">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Status Update Action */}
          <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] mb-3">
              Update Investigation Status
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["Under Review", "Pending", "In Progress", "Resolved"].map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => onUpdateStatus(report.id, statusOption)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    (report.status || "").toLowerCase() === statusOption.toLowerCase()
                      ? "bg-[#38bdf8] text-[#050b14] border-[#38bdf8] shadow-md"
                      : "bg-[#0d1726] text-[#94a3b8] border-[#1e3445] hover:text-white hover:border-[#38bdf8]/40"
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e3445] bg-[#08121f] flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#1e3445] px-5 py-2 text-xs font-bold text-white hover:bg-[#263e52] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
