import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="border-b border-[#1e3445] bg-[#050b14]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00bfa6] text-lg shadow-[0_0_20px_rgba(0,191,166,0.25)]">
            🌿
          </div>

          <div>

            <span className="text-xl font-bold tracking-tight text-[#f8fafc]">
              AeroShield
            </span>

            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-[#64748b] sm:block">
              Environmental Intelligence
            </p>

          </div>

        </div>


        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          {/* How it works */}
          <a
            href="#how-it-works"
            className="text-sm font-medium text-[#94a3b8] transition hover:text-[#20e0c0]"
          >
            How it works
          </a>


          {/* About */}
          <a
            href="#about"
            className="text-sm font-medium text-[#94a3b8] transition hover:text-[#20e0c0]"
          >
            About
          </a>


          {/* Login */}
          <Link
            to="/roles"
            className="rounded-lg border border-[#1e3445] bg-[#0d1726] px-5 py-2.5 text-sm font-medium text-[#f8fafc] transition hover:border-[#00bfa6] hover:text-[#20e0c0]"
          >
            Login
          </Link>

        </div>


        {/* Mobile menu button */}
        <button
          className="rounded-lg border border-[#1e3445] bg-[#0d1726] px-3 py-2 text-[#f8fafc] md:hidden"
        >
          ☰
        </button>

      </div>
    </nav>
  )
}

export default Navbar