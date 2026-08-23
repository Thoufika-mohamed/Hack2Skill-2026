import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function RoleSelection() {
  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <Navbar />

      <main className="relative min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-[-150px] top-20 h-96 w-96 rounded-full bg-[#00bfa6]/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-150px] top-40 h-96 w-96 rounded-full bg-[#38bdf8]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">

          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#1e3445] bg-[#0d1726] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#20e0c0]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">
                Choose your experience
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-bold sm:text-5xl lg:text-6xl">
              How will you use{" "}
              <span className="text-[#20e0c0]">
                AeroShield
              </span>
              ?
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#94a3b8]">
              Choose your role to continue to the AeroShield experience
              designed for you.
            </p>

          </div>

          {/* Cards */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-7 md:grid-cols-2">

            {/* ================= PUBLIC ================= */}
            <div className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-9 transition duration-300 hover:-translate-y-1 hover:border-[#20e0c0]/70 hover:shadow-[0_0_45px_rgba(32,224,192,0.1)]">

              {/* Public Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#20e0c0]/30 bg-[#20e0c0]/10 text-3xl">
                👤
              </div>

              {/* Public Label */}
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
                Public
              </p>

              {/* Public Heading */}
              <h2 className="mt-3 text-3xl font-bold">
                Your air. Your community.
              </h2>

              {/* Public Description */}
              <p className="mt-4 leading-7 text-[#94a3b8]">
                Access local environmental information, submit pollution
                complaints, and keep track of incidents reported by you.
              </p>

              {/* Public Button */}
              <Link
                to="/login?role=public"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
              >
                Continue as Public →
              </Link>

              <p className="mt-4 text-center text-sm text-[#64748b]">
                Citizen access
              </p>

            </div>


            {/* ================= OFFICIAL ================= */}
            <div className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-9 transition duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/70 hover:shadow-[0_0_45px_rgba(56,189,248,0.1)]">

              {/* Official Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-3xl">
                🏛️
              </div>

              {/* Official Label */}
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
                Official
              </p>

              {/* Official Heading */}
              <h2 className="mt-3 text-3xl font-bold">
                Intelligence for action.
              </h2>

              {/* Official Description */}
              <p className="mt-4 leading-7 text-[#94a3b8]">
                Monitor environmental conditions, review incidents, analyse
                pollution risks, and coordinate response.
              </p>

              {/* Official Button */}
              <Link
                to="/login?role=official"
                className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
              >
                Continue as Official →
              </Link>

              <p className="mt-4 text-center text-sm text-[#64748b]">
                Authority access
              </p>

            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default RoleSelection