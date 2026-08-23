import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Sidebar from "../../components/Sidebar"

function OfficialDashboard() {

  // =====================================================
  // SIDEBAR
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(false)

  // =====================================================
  // URL VIEW
  // =====================================================

  const [searchParams] = useSearchParams()

  const view =
    searchParams.get("view") || "overview"

  // =====================================================
  // OFFICIAL NAME
  // =====================================================

  const userName =
    localStorage.getItem("aeroShieldUserName") ||
    "Official"

  // =====================================================
  // COMPLAINTS
  // =====================================================

  const [reports, setReports] = useState([])

  // =====================================================
  // STATUS LIST
  // =====================================================

  const statuses = [
    "Pending",
    "Under Review",
    "In Progress",
    "Resolved",
  ]

  // =====================================================
  // LOAD COMPLAINTS
  // =====================================================

  const loadReports = () => {

    try {

      const savedReports =
        JSON.parse(
          localStorage.getItem(
            "aeroShieldReports"
          ) || "[]"
        )

      setReports(
        Array.isArray(savedReports)
          ? savedReports
          : []
      )

    } catch (error) {

      console.error(
        "Unable to load complaints:",
        error
      )

      setReports([])

    }

  }

  // =====================================================
  // INITIAL LOAD + LIVE UPDATE
  // =====================================================

  useEffect(() => {

    loadReports()

    const handleReportsUpdated = () => {
      loadReports()
    }

    window.addEventListener(
      "aeroShieldReportsUpdated",
      handleReportsUpdated
    )

    return () => {

      window.removeEventListener(
        "aeroShieldReportsUpdated",
        handleReportsUpdated
      )

    }

  }, [])

  // =====================================================
  // ALSO REFRESH WHEN TAB BECOMES ACTIVE
  // =====================================================

  useEffect(() => {

    const handleFocus = () => {
      loadReports()
    }

    window.addEventListener(
      "focus",
      handleFocus
    )

    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      )

    }

  }, [])

  // =====================================================
  // UPDATE COMPLAINT STATUS
  // =====================================================

  const updateStatus = (
    complaintId,
    newStatus
  ) => {

    try {

      const savedReports =
        JSON.parse(
          localStorage.getItem(
            "aeroShieldReports"
          ) || "[]"
        )

      if (!Array.isArray(savedReports)) {
        return
      }

      const updatedReports =
        savedReports.map((report) => {

          const reportId =
            report.id ||
            report.complaintId

          if (reportId === complaintId) {

            return {
              ...report,
              status: newStatus,
              updatedAt:
                new Date().toLocaleString(),
            }

          }

          return report

        })

      // Save the updated complaints
      localStorage.setItem(
        "aeroShieldReports",
        JSON.stringify(updatedReports)
      )

      // Update official dashboard immediately
      setReports(updatedReports)

      // Notify public dashboard
      window.dispatchEvent(
        new Event(
          "aeroShieldReportsUpdated"
        )
      )

    } catch (error) {

      console.error(
        "Unable to update complaint status:",
        error
      )

    }

  }

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {

    if (status === "Pending") {

      return "border-blue-500/30 bg-blue-500/10 text-blue-400"

    }

    if (status === "Under Review") {

      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"

    }

    if (status === "In Progress") {

      return "border-orange-500/30 bg-orange-500/10 text-orange-400"

    }

    if (status === "Resolved") {

      return "border-green-500/30 bg-green-500/10 text-green-400"

    }

    return "border-[#1e3445] bg-[#08121f] text-[#94a3b8]"

  }

  // =====================================================
  // COUNTS
  // =====================================================

  const totalComplaints =
    reports.length

  const pendingCount =
    reports.filter(
      (report) =>
        (report.status || "Pending") ===
        "Pending"
    ).length

  const underReviewCount =
    reports.filter(
      (report) =>
        report.status ===
        "Under Review"
    ).length

  const inProgressCount =
    reports.filter(
      (report) =>
        report.status ===
        "In Progress"
    ).length

  const resolvedCount =
    reports.filter(
      (report) =>
        report.status ===
        "Resolved"
    ).length

  const activeIncidents =
    reports.filter(
      (report) =>
        (report.status || "Pending") !==
        "Resolved"
    ).length

  // Keep compatibility with your existing dashboard
  const criticalCount =
    reports.filter(
      (report) =>
        report.status === "Critical"
    ).length

  const highRiskCount =
    reports.filter(
      (report) =>
        report.status === "High Risk"
    ).length

  // =====================================================
  // REPORT TYPE
  // =====================================================

  const getReportType = (report) => {

    return (
      report.pollutionType ||
      report.type ||
      "Environmental incident"
    )

  }

  // =====================================================
  // OVERVIEW
  // =====================================================

  const renderOverview = () => {

    return (

      <>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
          Official Control Center
        </p>


        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">

          Welcome,{" "}

          <span className="text-[#38bdf8]">
            {userName}
          </span>

          {" "}👋

        </h1>


        <p className="mt-3 max-w-2xl text-lg leading-8 text-[#94a3b8]">
          Monitor environmental conditions and coordinate response actions.
        </p>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mt-10 grid gap-5 md:grid-cols-4">


          {/* ACTIVE */}

          <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              ACTIVE INCIDENTS
            </p>

            <p className="mt-3 text-3xl font-bold">
              {activeIncidents}
            </p>

          </div>


          {/* CRITICAL */}

          <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              CRITICAL
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {criticalCount}
            </p>

          </div>


          {/* HIGH RISK */}

          <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              HIGH RISK
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-400">
              {highRiskCount}
            </p>

          </div>


          {/* TOTAL */}

          <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              TOTAL REPORTS
            </p>

            <p className="mt-3 text-3xl font-bold text-[#38bdf8]">
              {totalComplaints}
            </p>

          </div>

        </div>


        {/* =================================================
            LIVE MAP
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <h2 className="text-xl font-bold">
            Live Pollution Hotspots
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Monitor environmental incidents across the region.
          </p>


          <div className="mt-6 flex h-96 items-center justify-center rounded-2xl border border-[#1e3445] bg-[#08121f]">

            <div className="text-center">

              <div className="text-5xl">
                🗺️
              </div>

              <p className="mt-4 font-semibold">
                Environmental Monitoring Map
              </p>

              <p className="mt-2 text-sm text-[#64748b]">
                Live map integration will be added next.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            COMPLAINT HISTORY
            KEEPING THIS IN OVERVIEW
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Complaint History
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Reports submitted by public users.
              </p>

            </div>

            <div className="rounded-lg bg-[#08121f] px-4 py-2 text-sm text-[#38bdf8]">
              {totalComplaints} Reports
            </div>

          </div>


          {reports.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-10 text-center">

              <div className="text-4xl">
                📋
              </div>

              <p className="mt-4 font-semibold">
                No complaints yet
              </p>

              <p className="mt-2 text-sm text-[#64748b]">
                Public complaints will appear here when submitted.
              </p>

            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead>

                  <tr className="border-b border-[#1e3445] text-xs uppercase tracking-wider text-[#64748b]">

                    <th className="px-4 py-4">
                      Complaint ID
                    </th>

                    <th className="px-4 py-4">
                      Citizen
                    </th>

                    <th className="px-4 py-4">
                      Type
                    </th>

                    <th className="px-4 py-4">
                      Location
                    </th>

                    <th className="px-4 py-4">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {reports.map((report) => {

                    const reportId =
                      report.id ||
                      report.complaintId

                    const status =
                      report.status ||
                      "Pending"

                    return (

                      <tr
                        key={reportId}
                        className="border-b border-[#1e3445] last:border-0 hover:bg-[#08121f]"
                      >

                        <td className="px-4 py-5">

                          <p className="font-semibold text-[#38bdf8]">
                            {reportId}
                          </p>

                        </td>


                        <td className="px-4 py-5">

                          <p className="font-medium">
                            {report.userName ||
                              "Public User"}
                          </p>

                          <p className="mt-1 text-xs text-[#64748b]">
                            {report.email ||
                              report.userEmail ||
                              "No email"}
                          </p>

                        </td>


                        <td className="px-4 py-5 text-sm">
                          {getReportType(report)}
                        </td>


                        <td className="px-4 py-5 text-sm text-[#cbd5e1]">
                          {report.location ||
                            "Not specified"}
                        </td>


                        <td className="px-4 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </td>

                      </tr>

                    )

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </>

    )

  }


  // =====================================================
  // MONITOR PAGE
  // =====================================================

  const renderMonitor = () => {

    return (

      <section>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
          MONITOR
        </p>


        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Environmental Monitoring
        </h1>


        <p className="mt-3 max-w-3xl text-lg leading-8 text-[#94a3b8]">
          Monitor complaint activity and environmental incidents across the platform.
        </p>


        {/* =================================================
            MONITOR STATISTICS
        ================================================= */}

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">


          {/* TOTAL */}

          <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              TOTAL
            </p>

            <p className="mt-3 text-3xl font-bold text-[#38bdf8]">
              {totalComplaints}
            </p>

            <p className="mt-2 text-xs text-[#64748b]">
              All citizen complaints
            </p>

          </div>


          {/* PENDING */}

          <div className="rounded-2xl border border-blue-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              PENDING
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {pendingCount}
            </p>

            <p className="mt-2 text-xs text-[#64748b]">
              Awaiting review
            </p>

          </div>


          {/* UNDER REVIEW */}

          <div className="rounded-2xl border border-yellow-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              UNDER REVIEW
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-400">
              {underReviewCount}
            </p>

            <p className="mt-2 text-xs text-[#64748b]">
              Being assessed
            </p>

          </div>


          {/* IN PROGRESS */}

          <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              IN PROGRESS
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-400">
              {inProgressCount}
            </p>

            <p className="mt-2 text-xs text-[#64748b]">
              Action underway
            </p>

          </div>


          {/* RESOLVED */}

          <div className="rounded-2xl border border-green-500/20 bg-[#0d1726] p-5">

            <p className="text-xs font-medium text-[#64748b]">
              RESOLVED
            </p>

            <p className="mt-3 text-3xl font-bold text-green-400">
              {resolvedCount}
            </p>

            <p className="mt-2 text-xs text-[#64748b]">
              Successfully resolved
            </p>

          </div>

        </div>


        {/* =================================================
            RESOLUTION RATE
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-7">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
                Resolution Performance
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Complaint resolution rate
              </h2>

            </div>


            <div className="text-4xl font-bold text-[#20e0c0]">

              {totalComplaints === 0
                ? 0
                : Math.round(
                    (resolvedCount /
                      totalComplaints) *
                      100
                  )}

              %

            </div>

          </div>


          <div className="mt-6 h-4 overflow-hidden rounded-full bg-[#08121f]">

            <div
              className="h-full rounded-full bg-[#20e0c0] transition-all duration-500"
              style={{
                width: `${
                  totalComplaints === 0
                    ? 0
                    : Math.round(
                        (resolvedCount /
                          totalComplaints) *
                          100
                      )
                }%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            MONITOR TABLE
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Complaint Monitoring
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Current status of all environmental complaints.
              </p>

            </div>

            <span className="rounded-lg bg-[#08121f] px-4 py-2 text-sm text-[#38bdf8]">
              {totalComplaints} Total
            </span>

          </div>


          {reports.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-10 text-center">

              <div className="text-4xl">
                📊
              </div>

              <p className="mt-4 font-semibold">
                No complaints to monitor
              </p>

              <p className="mt-2 text-sm text-[#64748b]">
                New public complaints will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {reports
                .slice()
                .reverse()
                .map((report) => {

                  const reportId =
                    report.id ||
                    report.complaintId

                  const status =
                    report.status ||
                    "Pending"

                  return (

                    <div
                      key={reportId}
                      className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                          <p className="text-sm font-semibold text-[#38bdf8]">
                            {reportId}
                          </p>

                          <h3 className="mt-2 font-bold">
                            {getReportType(report)}
                          </h3>

                          <p className="mt-1 text-sm text-[#64748b]">
                            📍 {report.location ||
                              "Location unavailable"}
                          </p>

                        </div>


                        <div className="flex items-center gap-3">

                          <span
                            className={`rounded-full border px-4 py-2 text-xs font-semibold ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>

                      </div>

                    </div>

                  )

                })}

            </div>

          )}

        </div>

      </section>

    )

  }


  // =====================================================
  // ANALYSE
  // =====================================================

  const renderAnalyse = () => {

    return (

      <section className="mt-10">

        {/* Analysis overview */}

        <div className="grid gap-5 md:grid-cols-3">


          <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              Reports Analysed
            </p>

            <p className="mt-3 text-4xl font-bold text-[#38bdf8]">
              {totalComplaints}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Citizen pollution reports available for analysis.
            </p>

          </div>


          <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              Critical Risk
            </p>

            <p className="mt-3 text-4xl font-bold text-red-400">
              {criticalCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Incidents requiring immediate attention.
            </p>

          </div>


          <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              High Risk
            </p>

            <p className="mt-3 text-4xl font-bold text-orange-400">
              {highRiskCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Incidents requiring further investigation.
            </p>

          </div>

        </div>


        {/* AI ANALYSIS */}

        <div className="mt-7 rounded-3xl border border-[#38bdf8]/20 bg-[#0d1726] p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#38bdf8]/10 text-2xl">
              🧠
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
                AI Environmental Analysis
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Pollution risk intelligence
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#94a3b8]">
                This section is designed to combine citizen reports,
                environmental measurements, and AI analysis to identify
                pollution patterns and potential high-risk zones.
              </p>

            </div>

          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-3">


            <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5">

              <p className="text-sm font-semibold">
                Pollution Pattern
              </p>

              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                Identify repeated pollution reports from similar
                locations and categories.
              </p>

            </div>


            <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5">

              <p className="text-sm font-semibold">
                Risk Assessment
              </p>

              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                Prioritize incidents based on reported severity
                and environmental conditions.
              </p>

            </div>


            <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5">

              <p className="text-sm font-semibold">
                Recommended Investigation
              </p>

              <p className="mt-3 text-sm leading-6 text-[#64748b]">
                Highlight locations that may require verification
                or field inspection.
              </p>

            </div>

          </div>

        </div>


        {/* REPORTS FOR ANALYSIS */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <h2 className="text-xl font-bold">
            Reports Requiring Analysis
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Review citizen observations before taking action.
          </p>


          {reports.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-8 text-center">

              <p className="text-3xl">
                🔎
              </p>

              <p className="mt-3 font-semibold">
                No reports available
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {reports
                .slice()
                .reverse()
                .slice(0, 8)
                .map((report) => (

                  <div
                    key={
                      report.id ||
                      report.complaintId
                    }
                    className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5"
                  >

                    <div className="flex flex-col justify-between gap-3 md:flex-row">

                      <div>

                        <p className="font-semibold text-[#38bdf8]">
                          {report.id ||
                            report.complaintId}
                        </p>

                        <p className="mt-2 font-medium">
                          {getReportType(report)}
                        </p>

                        <p className="mt-1 text-sm text-[#64748b]">
                          {report.location ||
                            "Location unavailable"}
                        </p>

                      </div>


                      <span className="h-fit rounded-full bg-[#38bdf8]/10 px-3 py-1 text-xs font-semibold text-[#38bdf8]">
                        {report.status ||
                          "Pending"}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </section>

    )

  }


  // =====================================================
  // RESPOND / ACT
  // =====================================================

  const renderRespond = () => {

    return (

      <section className="mt-10">

        {/* =================================================
            RESPONSE STATISTICS
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-4">


          <div className="rounded-2xl border border-blue-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              Pending
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-400">
              {pendingCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Awaiting official review.
            </p>

          </div>


          <div className="rounded-2xl border border-yellow-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              Under Review
            </p>

            <p className="mt-3 text-4xl font-bold text-yellow-400">
              {underReviewCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Currently being assessed.
            </p>

          </div>


          <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              In Progress
            </p>

            <p className="mt-3 text-4xl font-bold text-orange-400">
              {inProgressCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Response action underway.
            </p>

          </div>


          <div className="rounded-2xl border border-green-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-widest text-[#64748b]">
              Resolved
            </p>

            <p className="mt-3 text-4xl font-bold text-green-400">
              {resolvedCount}
            </p>

            <p className="mt-2 text-sm text-[#94a3b8]">
              Successfully resolved.
            </p>

          </div>

        </div>


        {/* =================================================
            RESPONSE CENTER
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#20e0c0]/20 bg-[#0d1726] p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#20e0c0]/10 text-2xl">
              ⚡
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
                Authority Response Center
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Prioritize and act on incidents
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#94a3b8]">
                Review citizen complaints and update their status as
                the authority takes action.
              </p>

            </div>

          </div>


          {/* RECOMMENDED ACTIONS */}

          <div className="mt-8 grid gap-5 md:grid-cols-3">


            <div className="rounded-2xl border border-red-500/20 bg-[#08121f] p-5">

              <div className="text-2xl">
                🚨
              </div>

              <h3 className="mt-4 font-bold">
                Dispatch Inspection
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Send an inspection team to verify critical pollution incidents.
              </p>

            </div>


            <div className="rounded-2xl border border-orange-500/20 bg-[#08121f] p-5">

              <div className="text-2xl">
                🔍
              </div>

              <h3 className="mt-4 font-bold">
                Verify Source
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Investigate the reported source and compare environmental conditions.
              </p>

            </div>


            <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#08121f] p-5">

              <div className="text-2xl">
                📡
              </div>

              <h3 className="mt-4 font-bold">
                Monitor Area
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Continue monitoring the affected area for changes in pollution risk.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            COMPLAINT RESPONSE LIST
        ================================================= */}

        <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Complaint Response Management
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Change the status of citizen complaints from this page.
              </p>

            </div>

            <span className="rounded-lg bg-[#08121f] px-4 py-2 text-sm text-[#20e0c0]">
              {activeIncidents} Active
            </span>

          </div>


          {reports.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-10 text-center">

              <div className="text-4xl">
                📋
              </div>

              <p className="mt-4 font-semibold">
                No complaints available
              </p>

              <p className="mt-2 text-sm text-[#64748b]">
                New citizen reports will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-5">

              {reports
                .slice()
                .reverse()
                .map((report) => {

                  const reportId =
                    report.id ||
                    report.complaintId

                  const currentStatus =
                    report.status ||
                    "Pending"

                  return (

                    <div
                      key={reportId}
                      className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-6"
                    >

                      {/* =================================================
                          COMPLAINT HEADER
                      ================================================= */}

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#64748b]">
                            COMPLAINT ID
                          </p>

                          <p className="mt-2 text-xl font-bold text-[#20e0c0]">
                            {reportId}
                          </p>

                          <p className="mt-4 font-semibold">
                            {getReportType(report)}
                          </p>

                          <p className="mt-2 text-sm text-[#64748b]">
                            📍 {report.location ||
                              "Location unavailable"}
                          </p>

                        </div>


                        <span
                          className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusClass(
                            currentStatus
                          )}`}
                        >
                          {currentStatus}
                        </span>

                      </div>


                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="mt-6 grid gap-5 border-t border-[#1e3445] pt-6 md:grid-cols-3">


                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#64748b]">
                            CITIZEN
                          </p>

                          <p className="mt-2 font-semibold">
                            {report.userName ||
                              "Public User"}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#64748b]">
                            EMAIL
                          </p>

                          <p className="mt-2 break-all font-semibold">
                            {report.email ||
                              report.userEmail ||
                              "Not available"}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs uppercase tracking-wider text-[#64748b]">
                            SUBMITTED
                          </p>

                          <p className="mt-2 font-semibold">
                            {report.submittedAt ||
                              report.createdAt ||
                              "Not available"}
                          </p>

                        </div>

                      </div>


                      {/* =================================================
                          DESCRIPTION
                      ================================================= */}

                      <div className="mt-6 border-t border-[#1e3445] pt-6">

                        <p className="text-xs uppercase tracking-wider text-[#64748b]">
                          DESCRIPTION
                        </p>

                        <p className="mt-3 leading-7 text-[#cbd5e1]">
                          {report.description ||
                            "No description provided."}
                        </p>

                      </div>


                      {/* =================================================
                          CHANGE STATUS
                      ================================================= */}

                      <div className="mt-6 border-t border-[#1e3445] pt-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-end">

                          <div className="flex-1">

                            <label className="mb-2 block text-sm font-semibold">
                              Update Complaint Status
                            </label>

                            <select
                              value={currentStatus}
                              onChange={(e) =>
                                updateStatus(
                                  reportId,
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-[#1e3445] bg-[#0d1726] px-4 py-3 text-white outline-none transition focus:border-[#20e0c0]"
                            >

                              {statuses.map(
                                (status) => (

                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>

                                )
                              )}

                            </select>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                reportId,
                                "Resolved"
                              )
                            }
                            disabled={
                              currentStatus ===
                              "Resolved"
                            }
                            className="rounded-xl bg-[#00bfa6] px-6 py-3 font-semibold text-[#02120f] transition hover:bg-[#20e0c0] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {currentStatus ===
                            "Resolved"
                              ? "✓ Resolved"
                              : "Mark Resolved"}
                          </button>

                        </div>

                      </div>


                      {/* =================================================
                          PROGRESS
                      ================================================= */}

                      <div className="mt-7 border-t border-[#1e3445] pt-6">

                        <p className="text-sm font-semibold">
                          Complaint Progress
                        </p>


                        <div className="mt-5 grid grid-cols-4 gap-2">

                          {statuses.map(
                            (status, index) => {

                              const currentIndex =
                                statuses.indexOf(
                                  currentStatus
                                )

                              const isCompleted =
                                index <=
                                currentIndex

                              const isCurrent =
                                index ===
                                currentIndex

                              return (

                                <button
                                  key={status}
                                  type="button"
                                  onClick={() =>
                                    updateStatus(
                                      reportId,
                                      status
                                    )
                                  }
                                  className="text-center"
                                >

                                  <div
                                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border transition hover:scale-110 ${
                                      isCompleted
                                        ? "border-[#20e0c0] bg-[#20e0c0] text-[#02120f]"
                                        : "border-[#1e3445] bg-[#0d1726] text-[#64748b]"
                                    } ${
                                      isCurrent
                                        ? "ring-2 ring-[#20e0c0]/30"
                                        : ""
                                    }`}
                                  >
                                    {isCompleted
                                      ? "✓"
                                      : index + 1}
                                  </div>

                                  <p
                                    className={`mt-2 text-[11px] ${
                                      isCompleted
                                        ? "text-[#20e0c0]"
                                        : "text-[#64748b]"
                                    }`}
                                  >
                                    {status}
                                  </p>

                                </button>

                              )

                            }
                          )}

                        </div>

                      </div>


                      {/* =================================================
                          LAST UPDATED
                      ================================================= */}

                      {report.updatedAt && (

                        <p className="mt-5 text-xs text-[#64748b]">
                          Last updated: {report.updatedAt}
                        </p>

                      )}

                    </div>

                  )

                })}

            </div>

          )}

        </div>

      </section>

    )

  }


  // =====================================================
  // PAGE TITLE
  // =====================================================

  const getPageTitle = () => {

    if (view === "monitor") {
      return "Environmental Monitoring"
    }

    if (view === "analyse") {
      return "Pollution Analysis"
    }

    if (view === "respond") {
      return "Response Center"
    }

    return "Official Control Center"

  }


  // =====================================================
  // PAGE DESCRIPTION
  // =====================================================

  const getPageDescription = () => {

    if (view === "monitor") {

      return (
        "Monitor complaint activity, response progress, and environmental incidents."
      )

    }

    if (view === "analyse") {

      return (
        "Analyse pollution reports, identify risk patterns, and understand environmental conditions."
      )

    }

    if (view === "respond") {

      return (
        "Prioritize incidents, coordinate response actions, and manage environmental complaints."
      )

    }

    return (
      "Monitor environmental conditions, review public complaints, and coordinate response actions."
    )

  }


  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (

    <div className="min-h-screen bg-[#050b14] text-white">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="flex h-20 items-center justify-between border-b border-[#1e3445] bg-[#08121f] px-6">

        {/* HAMBURGER */}

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-[#1e3445] bg-[#0d1726] transition hover:border-[#38bdf8]"
        >

          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />

        </button>


        {/* LOGO */}

        <div className="font-bold">

          <span className="text-[#38bdf8]">
            Aero
          </span>

          Shield

        </div>


        {/* OFFICIAL */}

        <div className="text-right">

          <p className="text-sm font-semibold">
            {userName}
          </p>

          <p className="text-xs text-[#64748b]">
            Environmental Official
          </p>

        </div>

      </header>


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        role="official"
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeSection={view}
        setActiveSection={() => {}}
      />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">


        {/* PAGE HEADER */}

        {view !== "overview" && (

          <>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
              {getPageTitle()}
            </p>

            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              {getPageTitle()}
            </h1>

            <p className="mt-3 max-w-3xl text-lg leading-8 text-[#94a3b8]">
              {getPageDescription()}
            </p>

          </>

        )}


        {/* =================================================
            OVERVIEW
        ================================================= */}

        {view === "overview" &&
          renderOverview()}


        {/* =================================================
            MONITOR
        ================================================= */}

        {view === "monitor" &&
          renderMonitor()}


        {/* =================================================
            ANALYSE
        ================================================= */}

        {view === "analyse" &&
          renderAnalyse()}


        {/* =================================================
            RESPOND
        ================================================= */}

        {view === "respond" &&
          renderRespond()}

      </main>

    </div>

  )

}

export default OfficialDashboard