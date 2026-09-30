import React from "react"

export default function MapFilterToolbar({
  selectedRisk,
  onSelectRisk,
  selectedTimeRange,
  onSelectTimeRange,
  selectedClassification,
  onSelectClassification,
  showHeatmap,
  onToggleHeatmap,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl border border-[#1e3445] bg-[#0d1726]/95 backdrop-blur-md text-xs text-[#94a3b8] shadow-lg">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[180px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter zones by area or type..."
          className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:border-[#20e0c0] focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Risk Filter */}
      <div className="flex items-center gap-1 bg-[#08121f] p-1 rounded-xl border border-[#1e3445]">
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Risk:</span>
        {["ALL", "LOW", "MODERATE", "HIGH", "CRITICAL"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => onSelectRisk(lvl)}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              selectedRisk === lvl
                ? "bg-[#1e3445] text-white shadow-sm"
                : "text-[#94a3b8] hover:text-white"
            }`}
          >
            {lvl === "ALL" ? "All" : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center gap-1 bg-[#08121f] p-1 rounded-xl border border-[#1e3445]">
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Time:</span>
        {[
          { id: "all", label: "All Time" },
          { id: "24h", label: "24h" },
          { id: "7d", label: "7 Days" },
          { id: "30d", label: "30 Days" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTimeRange(t.id)}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              selectedTimeRange === t.id
                ? "bg-[#1e3445] text-white shadow-sm"
                : "text-[#94a3b8] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Event Classification Filter */}
      <div className="flex items-center gap-1 bg-[#08121f] p-1 rounded-xl border border-[#1e3445]">
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Signal:</span>
        {[
          { id: "all", label: "All" },
          { id: "CORROBORATED", label: "⚡ Corroborated" },
          { id: "MEASURED", label: "📡 Measured" },
          { id: "CITIZEN_REPORTED", label: "👥 Reports" }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectClassification(c.id)}
            className={`px-2 py-1 rounded-lg font-medium transition ${
              selectedClassification === c.id
                ? "bg-[#1e3445] text-[#20e0c0] shadow-sm"
                : "text-[#94a3b8] hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Heatmap Toggle */}
      <button
        onClick={onToggleHeatmap}
        className={`px-3 py-1.5 rounded-xl font-semibold border transition flex items-center gap-1.5 ${
          showHeatmap
            ? "bg-[#20e0c0]/15 text-[#20e0c0] border-[#20e0c0]/40"
            : "bg-[#08121f] text-[#64748b] border-[#1e3445] hover:text-white"
        }`}
      >
        <span>🔥</span>
        <span>Heatmap {showHeatmap ? "ON" : "OFF"}</span>
      </button>
    </div>
  )
}
