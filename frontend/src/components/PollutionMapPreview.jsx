function PollutionMapPreview() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-[#1e3445] bg-[#0a1421] shadow-[0_0_60px_rgba(0,191,166,0.08)]">

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(32,224,192,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(32,224,192,0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Atmospheric glow */}
      <div className="absolute left-1/4 top-1/4 h-52 w-52 rounded-full bg-[#00bfa6]/15 blur-[90px]" />

      <div className="absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-[#38bdf8]/10 blur-[100px]" />

      {/* Map roads */}
      <div className="absolute left-[20%] top-[-10%] h-[120%] w-3 rotate-[18deg] bg-[#26384a]" />

      <div className="absolute left-[-10%] top-[50%] h-3 w-[120%] rotate-[-8deg] bg-[#26384a]" />

      <div className="absolute left-[55%] top-[-10%] h-[120%] w-2 rotate-[-35deg] bg-[#26384a]" />

      <div className="absolute left-[10%] top-[65%] h-2 w-[100%] rotate-[25deg] bg-[#26384a]" />

      {/* Pollution zones */}

      {/* Low */}
      <div className="absolute left-[18%] top-[25%] h-32 w-32 rounded-full bg-[#22c55e]/20 blur-2xl" />

      {/* Moderate */}
      <div className="absolute right-[18%] top-[20%] h-36 w-36 rounded-full bg-[#eab308]/20 blur-2xl" />

      {/* High */}
      <div className="absolute left-[55%] top-[55%] h-44 w-44 rounded-full bg-[#f97316]/20 blur-3xl" />

      {/* Critical */}
      <div className="absolute left-[35%] bottom-[15%] h-40 w-40 rounded-full bg-[#ef4444]/20 blur-3xl" />

      {/* Header card */}
      <div className="absolute left-6 top-6 rounded-xl border border-[#1e3445] bg-[#0d1726]/95 px-5 py-4 backdrop-blur-md">

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#20e0c0]" />

          <span className="text-xs font-semibold uppercase tracking-wider text-[#20e0c0]">
            Live Environmental Data
          </span>
        </div>

        <p className="mt-2 text-lg font-bold text-[#f8fafc]">
          Regional Air Quality
        </p>

        <p className="mt-1 text-xs text-[#64748b]">
          Updated moments ago
        </p>

      </div>

      {/* Markers */}

      <div className="absolute left-[25%] top-[42%]">
        <div className="h-4 w-4 rounded-full border-2 border-[#f8fafc] bg-[#22c55e] shadow-[0_0_18px_rgba(34,197,94,0.8)]" />
      </div>

      <div className="absolute right-[22%] top-[36%]">
        <div className="h-4 w-4 rounded-full border-2 border-[#f8fafc] bg-[#eab308] shadow-[0_0_18px_rgba(234,179,8,0.8)]" />
      </div>

      <div className="absolute left-[60%] top-[62%]">
        <div className="h-5 w-5 rounded-full border-2 border-[#f8fafc] bg-[#f97316] shadow-[0_0_22px_rgba(249,115,22,0.8)]" />
      </div>

      <div className="absolute left-[40%] bottom-[22%]">
        <div className="h-5 w-5 rounded-full border-2 border-[#f8fafc] bg-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.9)]" />
      </div>

      {/* Current location */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#0d1726] bg-[#00bfa6] shadow-[0_0_35px_rgba(0,191,166,0.6)]">

          <div className="h-3 w-3 rounded-full bg-white" />

        </div>

        <div className="mt-3 whitespace-nowrap rounded-lg border border-[#1e3445] bg-[#0d1726] px-3 py-1.5 text-center text-xs font-medium text-[#f8fafc]">
          Your location
        </div>

      </div>

      {/* Pollution stats */}
      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">

        <div className="rounded-xl border border-[#1e3445] bg-[#0d1726]/95 p-4 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-[#64748b]">
            PM2.5
          </p>

          <p className="mt-1 text-xl font-bold text-[#20e0c0]">
            32
          </p>

          <p className="text-[10px] text-[#64748b]">
            µg/m³
          </p>
        </div>

        <div className="rounded-xl border border-[#1e3445] bg-[#0d1726]/95 p-4 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-[#64748b]">
            PM10
          </p>

          <p className="mt-1 text-xl font-bold text-[#f8fafc]">
            54
          </p>

          <p className="text-[10px] text-[#64748b]">
            µg/m³
          </p>
        </div>

        <div className="rounded-xl border border-[#1e3445] bg-[#0d1726]/95 p-4 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-wider text-[#64748b]">
            NO₂
          </p>

          <p className="mt-1 text-xl font-bold text-[#38bdf8]">
            21
          </p>

          <p className="text-[10px] text-[#64748b]">
            µg/m³
          </p>
        </div>

      </div>

    </div>
  )
}

export default PollutionMapPreview