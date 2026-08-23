import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const role =
    searchParams.get("role") || "public"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")


  const handleSubmit = (e) => {

    e.preventDefault()

    setError("")


    // =========================
    // NORMALIZE EMAIL
    // =========================

    const enteredEmail =
      email.trim().toLowerCase()


    // =========================
    // GET ALL ACCOUNTS
    // =========================

    let accounts = []

    try {

      accounts = JSON.parse(
        localStorage.getItem(
          "aeroShieldAccounts"
        ) || "[]"
      )

      if (!Array.isArray(accounts)) {
        accounts = []
      }

    } catch {

      accounts = []

    }


    // =========================
    // OLD ACCOUNT MIGRATION
    // =========================
    // If your old account exists,
    // include it.

    if (accounts.length === 0) {

      const oldAccount =
        localStorage.getItem(
          "aeroShieldAccount"
        )

      if (oldAccount) {

        try {

          const parsedAccount =
            JSON.parse(oldAccount)

          if (
            parsedAccount &&
            parsedAccount.email
          ) {

            accounts = [
              parsedAccount
            ]

            // Save it into the new
            // multiple-account system

            localStorage.setItem(
              "aeroShieldAccounts",
              JSON.stringify(accounts)
            )

          }

        } catch {

          setError(
            "Account data is invalid. Please create your account again."
          )

          return

        }

      }

    }


    // =========================
    // NO ACCOUNTS
    // =========================

    if (accounts.length === 0) {

      setError(
        "No account found. Please create an account first."
      )

      return

    }


    // =========================
    // FIND ACCOUNT BY EMAIL
    // =========================

    const emailAccounts =
      accounts.filter(
        (account) =>
          (account.email || "")
            .trim()
            .toLowerCase() ===
          enteredEmail
      )


    // =========================
    // EMAIL NOT FOUND
    // =========================

    if (emailAccounts.length === 0) {

      setError(
        "Email is incorrect."
      )

      return

    }


    // =========================
    // FIND ACCOUNT FOR ROLE
    // =========================

    const account =
      emailAccounts.find(
        (item) =>
          item.role === role
      )


    // =========================
    // WRONG PORTAL
    // =========================

    if (!account) {

      if (
        emailAccounts.some(
          (item) =>
            item.role === "official"
        )
      ) {

        setError(
          "This account belongs to the Official portal."
        )

      } else {

        setError(
          "This account belongs to the Public portal."
        )

      }

      return

    }


    // =========================
    // CHECK PASSWORD
    // =========================

    if (
      password !== account.password
    ) {

      setError(
        "Password is wrong. Please try again."
      )

      return

    }


    // =========================
    // LOGIN SUCCESSFUL
    // =========================

    // Save current account

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
    // GO TO DASHBOARD
    // =========================

    if (role === "official") {

      navigate(
        "/official-dashboard"
      )

    } else {

      navigate(
        "/public-dashboard"
      )

    }

  }


  return (

    <div className="min-h-screen bg-[#050b14] px-6 py-12 text-white">

      <div className="mx-auto max-w-xl">

        {/* Portal heading */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">

            <span className="text-[#20e0c0]">
              Aero
            </span>

            Shield

          </h1>

          <p className="mt-2 text-[#64748b]">

            {role === "official"
              ? "Official Portal"
              : "Public Portal"}

          </p>

        </div>


        {/* Login card */}

        <div className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-8 shadow-2xl">

          <h2 className="text-4xl font-bold">
            Welcome back
          </h2>

          <p className="mt-3 text-[#94a3b8]">
            Sign in to continue to AeroShield.
          </p>


          {/* Login form */}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-7"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {

                  setEmail(e.target.value)
                  setError("")

                }}
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
                onChange={(e) => {

                  setPassword(e.target.value)
                  setError("")

                }}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none transition focus:border-[#20e0c0]"
              />

            </div>


            {/* Error */}

            {error && (

              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                ⚠ {error}

              </div>

            )}


            {/* Sign in */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
            >
              Sign In →
            </button>

          </form>


          {/* Create account */}

          <div className="my-8 border-t border-[#1e3445]" />

          <div className="text-center">

            <p className="text-sm text-[#64748b]">
              Don't have an account?
            </p>

            <Link
              to={`/create-account?role=${role}`}
              className="mt-3 inline-block font-semibold text-white hover:text-[#20e0c0]"
            >
              Create Account
            </Link>

          </div>

        </div>


        {/* Back */}

        <div className="mt-6 text-center">

          <Link
            to="/roles"
            className="text-sm text-[#64748b] hover:text-[#20e0c0]"
          >
            ← Back to role selection
          </Link>

        </div>

      </div>

    </div>

  )
}

export default Login