import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Report() {
  const navigate = useNavigate()

  const [pollutionType, setPollutionType] =
    useState("Unusual odour")

  const [location, setLocation] =
    useState("")

  const [description, setDescription] =
    useState("")

  // Date of the pollution incident
  const [reportDate, setReportDate] =
    useState(new Date().toISOString().split("T")[0])

  const [success, setSuccess] =
    useState("")

  const [error, setError] =
    useState("")


  const handleSubmit = (e) => {
    e.preventDefault()

    setSuccess("")
    setError("")


    // Check required fields
    if (!reportDate) {
      setError("Please select the date of the incident.")
      return
    }

    if (!location.trim() || !description.trim()) {
      setError("Please enter the location and description.")
      return
    }


    // Get logged-in user
    const userName =
      localStorage.getItem("aeroShieldUserName") ||
      "Public User"


    const account = JSON.parse(
      localStorage.getItem("aeroShieldAccount") || "{}"
    )


    // Current submission date and time
    const submissionDateTime =
      new Date().toLocaleString()


    // Create a unique complaint
    const newReport = {

      // Unique complaint ID
      id: "AS-" + Date.now(),

      // User information
      userName: userName,

      email: account.email || "",

      // Complaint information
      type: pollutionType,

      location: location.trim(),

      description: description.trim(),

      // NEW: Date selected by the public
      reportDate: reportDate,

      // Complaint status
      status: "Pending",

      // Date and time when complaint was submitted
      createdAt: submissionDateTime,

      // Last updated date
      updatedAt: submissionDateTime,
    }


    // Get previous complaints
    const existingReports = JSON.parse(
      localStorage.getItem("aeroShieldReports") || "[]"
    )


    // Add new complaint
    const updatedReports = [
      newReport,
      ...existingReports,
    ]


    // Save complaints
    localStorage.setItem(
      "aeroShieldReports",
      JSON.stringify(updatedReports)
    )


    // Show success message
    setSuccess(
      `Report submitted successfully! Your complaint ID is ${newReport.id}`
    )


    // Clear form
    setLocation("")
    setDescription("")


    // Reset date to today's date
    setReportDate(
      new Date().toISOString().split("T")[0]
    )


    // Go to Track after a short delay
    setTimeout(() => {
      navigate("/public/reports")
    }, 1800)
  }


  return (
    <div className="min-h-screen bg-[#050b14] text-white">


      {/* =========================
          HEADER
      ========================== */}

      <header className="border-b border-[#1e3445] bg-[#07111d]">

        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
              Report
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Submit a pollution incident
            </h1>

          </div>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================== */}

      <main className="mx-auto max-w-5xl px-6 py-12">

        <p className="text-lg text-[#94a3b8]">
          Help your community by reporting pollution or unusual
          environmental conditions.
        </p>


        {/* =========================
            FORM
        ========================== */}

        <div className="mt-10 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >


            {/* =========================
                POLLUTION TYPE
            ========================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Type of pollution
              </label>

              <select
                value={pollutionType}
                onChange={(e) =>
                  setPollutionType(e.target.value)
                }
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white outline-none focus:border-[#20e0c0]"
              >

                <option>Unusual odour</option>

                <option>Smoke</option>

                <option>Air pollution</option>

                <option>Industrial emission</option>

                <option>Waste dumping</option>

                <option>Burning waste</option>

                <option>Dust pollution</option>

                <option>Other</option>

              </select>

            </div>


            {/* =========================
                DATE
            ========================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Date of incident
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) =>
                  setReportDate(e.target.value)
                }
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white outline-none focus:border-[#20e0c0]"
              />

              <p className="mt-2 text-xs text-[#64748b]">
                Select the date when you observed the pollution incident.
              </p>

            </div>


            {/* =========================
                LOCATION
            ========================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Enter the pollution location"
                className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none focus:border-[#20e0c0]"
              />

            </div>


            {/* =========================
                DESCRIPTION
            ========================== */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe what you observed..."
                rows="6"
                className="w-full resize-none rounded-xl border border-[#1e3445] bg-[#08121f] px-5 py-4 text-white placeholder-[#475569] outline-none focus:border-[#20e0c0]"
              />

            </div>


            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-400">

                ⚠️ {error}

              </div>
            )}


            {/* =========================
                SUCCESS
            ========================== */}

            {success && (
              <div className="rounded-xl border border-[#20e0c0]/30 bg-[#20e0c0]/10 px-4 py-4 text-sm text-[#20e0c0]">

                ✅ {success}

                <br />

                <span className="text-[#94a3b8]">
                  Redirecting to My Reports...
                </span>

              </div>
            )}


            {/* =========================
                SUBMIT
            ========================== */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
            >
              Submit Pollution Report →
            </button>

          </form>

        </div>

      </main>

    </div>
  )
}

export default Report