import { useEffect, useState } from "react"

function Track() {

  const [reports, setReports] = useState([])

  // Load complaints
  useEffect(() => {

    const savedReports = JSON.parse(
      localStorage.getItem("aeroShieldReports") || "[]"
    )

    const account = JSON.parse(
      localStorage.getItem("aeroShieldAccount") || "{}"
    )

    // Show only current user's complaints
    const userReports = savedReports.filter(
      (report) =>
        report.email === account.email
    )

    setReports(userReports)

  }, [])


  // Status style
  const getStatusStyle = (status) => {

    if (status === "Resolved") {
      return "border-green-500/30 bg-green-500/10 text-green-400"
    }

    if (status === "In Progress") {
      return "border-blue-500/30 bg-blue-500/10 text-blue-400"
    }

    if (status === "Under Review") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
    }

    return "border-orange-500/30 bg-orange-500/10 text-orange-400"
  }


  return (
    <div className="min-h-screen bg-[#050b14] text-white">

      {/* Header */}
      <header className="border-b border-[#1e3445] bg-[#07111d]">

        <div className="mx-auto max-w-7xl px-6 py-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
            Track
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            My Pollution Reports
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#94a3b8]">
            Track the complaints you have submitted and
            monitor their progress.
          </p>

        </div>

      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {reports.length === 0 ? (

          /* No reports */
          <div className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-12 text-center">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No complaints yet
            </h2>

            <p className="mt-3 text-[#94a3b8]">
              You haven't submitted any pollution reports.
            </p>

          </div>

        ) : (

          /* Reports */
          <div className="space-y-6">

            {reports.map((report) => (

              <div
                key={report.id}
                className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-7"
              >

                {/* Top */}
                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">
                      Complaint ID
                    </p>

                    <p className="mt-1 font-mono text-[#20e0c0]">
                      {report.id}
                    </p>

                  </div>


                  {/* Status */}
                  <div
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </div>

                </div>


                {/* Details */}
                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                  {/* Type */}
                  <div>

                    <p className="text-xs font-semibold text-[#64748b]">
                      TYPE
                    </p>

                    <p className="mt-1 font-semibold">
                      {report.type}
                    </p>

                  </div>


                  {/* Incident Date */}
                  <div>

                    <p className="text-xs font-semibold text-[#64748b]">
                      DATE OF INCIDENT
                    </p>

                    <p className="mt-1 font-semibold">

                      {report.incidentDate
                        ? report.incidentDate
                        : report.date
                          ? report.date
                          : "Date unavailable"}

                    </p>

                  </div>


                  {/* Location */}
                  <div>

                    <p className="text-xs font-semibold text-[#64748b]">
                      LOCATION
                    </p>

                    <p className="mt-1 font-semibold">
                      {report.location}
                    </p>

                  </div>


                  {/* Submitted Date */}
                  <div>

                    <p className="text-xs font-semibold text-[#64748b]">
                      SUBMITTED ON
                    </p>

                    <p className="mt-1 font-semibold">
                      {report.createdAt || "Date unavailable"}
                    </p>

                  </div>

                </div>


                {/* Description */}
                <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-5">

                  <p className="text-xs font-semibold text-[#64748b]">
                    DESCRIPTION
                  </p>

                  <p className="mt-2 leading-7 text-[#cbd5e1]">
                    {report.description}
                  </p>

                </div>


                {/* Progress */}
                <div className="mt-7">

                  <p className="text-sm font-semibold">
                    Complaint progress
                  </p>

                  <div className="mt-4 grid grid-cols-4 gap-2">

                    {[
                      "Pending",
                      "Under Review",
                      "In Progress",
                      "Resolved",
                    ].map((status) => {

                      const statusOrder = [
                        "Pending",
                        "Under Review",
                        "In Progress",
                        "Resolved",
                      ]

                      const currentIndex =
                        statusOrder.indexOf(report.status)

                      const statusIndex =
                        statusOrder.indexOf(status)

                      const completed =
                        statusIndex <= currentIndex

                      return (

                        <div key={status}>

                          <div
                            className={`h-2 rounded-full ${
                              completed
                                ? "bg-[#20e0c0]"
                                : "bg-[#1e3445]"
                            }`}
                          />

                          <p
                            className={`mt-2 text-xs ${
                              completed
                                ? "text-[#20e0c0]"
                                : "text-[#64748b]"
                            }`}
                          >
                            {status}
                          </p>

                        </div>

                      )

                    })}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Track