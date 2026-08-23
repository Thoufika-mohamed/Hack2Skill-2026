import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

function CreateAccount() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const role = searchParams.get("role") || "public"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // =========================
    // CHECK EMPTY FIELDS
    // =========================

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.")
      return
    }

    // =========================
    // CHECK PASSWORD
    // =========================

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    // =========================
    // NORMALIZE EMAIL
    // =========================

    const normalizedEmail = email.trim().toLowerCase()

    // =========================
    // GET EXISTING ACCOUNTS
    // =========================

    let existingAccounts = []

    try {
      existingAccounts = JSON.parse(
        localStorage.getItem("aeroShieldAccounts") || "[]"
      )

      if (!Array.isArray(existingAccounts)) {
        existingAccounts = []
      }
    } catch {
      existingAccounts = []
    }

    // =========================
    // MIGRATE OLD ACCOUNT
    // =========================
    // This keeps your previously
    // created account instead of
    // losing it.

    const oldAccount = localStorage.getItem(
      "aeroShieldAccount"
    )

    if (oldAccount && existingAccounts.length === 0) {
      try {
        const parsedOldAccount = JSON.parse(oldAccount)

        if (
          parsedOldAccount &&
          parsedOldAccount.email
        ) {
          existingAccounts.push(parsedOldAccount)
        }
      } catch {
        // Ignore invalid old account
      }
    }

    // =========================
    // CHECK DUPLICATE ACCOUNT
    // =========================

    const accountAlreadyExists =
      existingAccounts.some(
        (account) =>
          (account.email || "").trim().toLowerCase() ===
            normalizedEmail &&
          account.role === role
      )

    if (accountAlreadyExists) {
      setError(
        "An account with this email already exists for this portal. Please sign in."
      )
      return
    }

    // =========================
    // CREATE NEW ACCOUNT
    // =========================

    const account = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password,
      role: role,
    }

    // =========================
    // ADD ACCOUNT TO ACCOUNT LIST
    // =========================

    const updatedAccounts = [
      ...existingAccounts,
      account,
    ]

    localStorage.setItem(
      "aeroShieldAccounts",
      JSON.stringify(updatedAccounts)
    )

    // =========================
    // SAVE CURRENT ACCOUNT
    // =========================

    // Keep this for compatibility
    // with the rest of your project.

    localStorage.setItem(
      "aeroShieldAccount",
      JSON.stringify(account)
    )

    localStorage.setItem(
      "aeroShieldUserName",
      account.fullName
    )

    localStorage.setItem(
      "aeroShieldEmail",
      account.email
    )

    localStorage.setItem(
      "aeroShieldRole",
      account.role
    )

    localStorage.setItem(
      "aeroShieldLoggedIn",
      "true"
    )

    // =========================
    // GO TO CORRECT DASHBOARD
    // =========================

    if (role === "official") {
      navigate("/official-dashboard")
    } else {
      navigate("/public-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#050b14] px-6 py-12 text-white">

      <div className="mx-auto max-w-xl">

        <div className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-8 shadow-2xl">

          {/* Portal */}

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
            {role === "official"
              ? "Official Portal"
              : "Public Portal"}
          </p>

          {/* Heading */}

          <h1 className="mt-4 text-4xl font-bold">
            Create Account
          </h1>

          <p className="mt-3 text-[#94a3b8]">
            Join AeroShield and get started.
          </p>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >

            {/* Full Name */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none transition focus:border-[#20e0c0]"
              />

            </div>

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none transition focus:border-[#20e0c0]"
              />

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create a password"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none transition focus:border-[#20e0c0]"
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none transition focus:border-[#20e0c0]"
              />

            </div>

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                ⚠ {error}
              </div>
            )}

            {/* Create Account */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
            >
              Create Account →
            </button>

          </form>

          {/* Divider */}

          <div className="my-8 border-t border-[#1e3445]" />

          {/* Login */}

          <div className="text-center">

            <p className="text-sm text-[#64748b]">
              Already have an account?
            </p>

            <Link
              to={`/login?role=${role}`}
              className="mt-3 inline-block font-semibold text-white hover:text-[#20e0c0]"
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateAccount