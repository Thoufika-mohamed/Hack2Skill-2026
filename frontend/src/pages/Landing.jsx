import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import PollutionMapPreview from "../components/PollutionMapPreview"

function Landing() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b14] text-[#f8fafc]">

      <Navbar />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative">

          {/* Background glow */}

          <div className="pointer-events-none absolute left-[-120px] top-20 h-96 w-96 rounded-full bg-[#00bfa6]/10 blur-[120px]" />

          <div className="pointer-events-none absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-[#38bdf8]/10 blur-[140px]" />


          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">

            {/* LEFT CONTENT */}

            <div>

              {/* Small label */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1e3445] bg-[#0d1726] px-4 py-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-[#20e0c0]" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Intelligent Air Quality Platform
                </span>

              </div>


              {/* Main heading */}

              <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

                <span className="block text-[#f8fafc]">
                  See the Air.
                </span>

                <span className="mt-2 block text-[#f8fafc]">

                  Understand the{" "}

                  <span className="text-[#20e0c0] drop-shadow-[0_0_20px_rgba(32,224,192,0.35)]">
                    Risk.
                  </span>

                </span>

                <span className="mt-2 block">

                  Take{" "}

                  <span className="text-[#38bdf8] drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                    Action.
                  </span>

                </span>

              </h1>


              {/* Description */}

              <p className="mt-8 max-w-xl text-base leading-7 text-[#94a3b8] sm:text-lg">

                AeroShield combines citizen reports, environmental data,
                and AI-powered analysis to identify pollution risks and
                support faster environmental response.

              </p>


              {/* Buttons */}

              <div className="mt-9 flex flex-wrap gap-4">

                <Link
                  to="/roles"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#00bfa6] px-6 py-3.5 font-semibold text-[#02120f] shadow-[0_0_30px_rgba(0,191,166,0.18)] transition hover:bg-[#20e0c0] hover:shadow-[0_0_35px_rgba(32,224,192,0.3)]"
                >

                  Get Started

                  <span>
                    →
                  </span>

                </Link>


                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1e3445] bg-[#0d1726] px-6 py-3.5 font-semibold text-[#f8fafc] transition hover:border-[#00bfa6] hover:text-[#20e0c0]"
                >

                  Explore Platform

                </a>

              </div>


              {/* Trust indicators */}

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-[#1e3445] pt-6">

                <div>

                  <p className="text-lg font-bold text-[#f8fafc]">
                    AI
                  </p>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Risk Analysis
                  </p>

                </div>


                <div>

                  <p className="text-lg font-bold text-[#f8fafc]">
                    LIVE
                  </p>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Pollution Data
                  </p>

                </div>


                <div>

                  <p className="text-lg font-bold text-[#f8fafc]">
                    ACTION
                  </p>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Response Support
                  </p>

                </div>

              </div>

            </div>


            {/* RIGHT MAP */}

            <div className="relative">

              <div className="pointer-events-none absolute inset-10 rounded-full bg-[#00bfa6]/10 blur-[100px]" />

              <PollutionMapPreview />

            </div>

          </div>

        </section>


        {/* =====================================================
            PLATFORM CAPABILITIES
        ===================================================== */}

        <section
          id="how-it-works"
          className="border-t border-[#1e3445] bg-[#070f1a] px-6 py-20"
        >

          <div className="mx-auto max-w-7xl">

            {/* Heading */}

            <div className="max-w-2xl">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
                One connected system
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f8fafc] sm:text-4xl">
                From environmental signals to meaningful action.
              </h2>

              <p className="mt-4 text-[#94a3b8]">

                AeroShield brings citizen observations, pollution data,
                AI analysis, and authority response into one platform.

              </p>

            </div>


            {/* =================================================
                REPORT CARD
            ================================================= */}

            <div className="mt-12 grid gap-5 md:grid-cols-1">

              {/* =================================================
                  REPORT
              ================================================= */}

              <button
                type="button"
                onClick={() => navigate("/roles")}
                className="group cursor-pointer rounded-2xl border border-[#1e3445] bg-[#0d1726] p-7 text-left transition hover:-translate-y-1 hover:border-[#00bfa6]/60 hover:shadow-[0_0_30px_rgba(0,191,166,0.08)]"
              >

                <div className="flex items-center justify-between">

                  <span className="text-xs font-semibold tracking-widest text-[#64748b]">
                    01
                  </span>

                  <span className="text-2xl">
                    📡
                  </span>

                </div>


                <h3 className="mt-8 text-xl font-bold text-[#f8fafc]">
                  Report
                </h3>


                <p className="mt-3 text-sm leading-6 text-[#94a3b8]">

                  Citizens submit pollution observations,
                  locations, descriptions, and supporting images.

                </p>


                <span className="mt-6 block text-sm font-semibold text-[#20e0c0]">
                  Report pollution →
                </span>

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Landing