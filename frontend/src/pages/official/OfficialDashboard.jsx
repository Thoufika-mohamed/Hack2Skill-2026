import {
  useEffect,
  useState,
} from "react"

import {
  useSearchParams,
} from "react-router-dom"

import Sidebar from "../../components/Sidebar"
import {
  getReports,
  updateReportStatus,
  getPollutionData,
} from "../../services/api"



function OfficialDashboard() {
  const [monitorData, setMonitorData] = useState(null)
const [monitorLoading, setMonitorLoading] = useState(false)
const [monitorError, setMonitorError] = useState("")

  // =========================================================
  // URL VIEW
  // =========================================================

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()

  const view =
    searchParams.get("view") ||
    "overview"


  // =========================================================
  // SIDEBAR
  // =========================================================

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false)


  // =========================================================
  // OFFICIAL NAME
  // =========================================================

  const userName =
    localStorage.getItem(
      "aeroShieldUserName"
    ) || "Official"


  // =========================================================
  // REPORTS
  // =========================================================

const [
  reports,
  setReports,
] = useState([])

useEffect(() => {
  if (view !== "monitor") {
    return
  }

  const loadMonitorData = () => {

    if (!navigator.geolocation) {
      setMonitorError(
        "Location access is not supported by your browser."
      )
      return
    }

    setMonitorLoading(true)
    setMonitorError("")

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {

          const data = await getPollutionData(
            position.coords.latitude,
            position.coords.longitude
          )

          setMonitorData(data)

        } catch (error) {

          console.error(
            "Failed to load monitoring data:",
            error
          )

          setMonitorError(
            "Unable to load live pollution data."
          )

        } finally {

          setMonitorLoading(false)

        }

      },
      () => {

        setMonitorError(
          "Location permission is required for live monitoring."
        )

        setMonitorLoading(false)

      }
    )

  }

  loadMonitorData()

}, [view])


  // =========================================================
  // CHANGE VIEW
  // =========================================================

  const changeView = (
    newView
  ) => {

    setSearchParams({
      view: newView,
    })

  }


  // =========================================================
  // UPDATE REPORT STATUS
  // =========================================================

 const handleStatusChange = async (
  reportId,
  newStatus
) => {
  console.log("STATUS CHANGE:", reportId, newStatus)

  try {
    console.log("SENDING PATCH:", reportId, newStatus)

    const updatedReport =
      await updateReportStatus(
        reportId,
        newStatus
      )
    console.log("PATCH RESPONSE:", updatedReport)

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? updatedReport
          : report
      )
    )

  } catch (error) {

  console.error(
    "PATCH ERROR:",
    error
  )

}

}


  // =========================================================
  // STATISTICS
  // =========================================================

  const activeIncidents =
    reports.filter(
      (report) =>
        report.status !==
        "Resolved"
    ).length


 const criticalCount =
  reports.filter(
    (report) =>
      report.risk === "Critical"
  ).length


  const highRiskCount =
  reports.filter(
    (report) =>
      report.risk === "High"
  ).length


  const underReviewCount =
    reports.filter(
      (report) =>
        report.status ===
        "Under Review"
    ).length


  const resolvedCount =
    reports.filter(
      (report) =>
        report.status ===
        "Resolved"
    ).length


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (
    status
  ) => {

    if (
      status ===
      "Resolved"
    ) {

      return "border-green-500/30 bg-green-500/10 text-green-400"

    }

    if (
      status ===
      "In Progress"
    ) {

      return "border-blue-500/30 bg-blue-500/10 text-blue-400"

    }

    if (
      status ===
      "Under Review"
    ) {

      return "border-purple-500/30 bg-purple-500/10 text-purple-400"

    }

    if (
      status ===
      "Critical"
    ) {

      return "border-red-500/30 bg-red-500/10 text-red-400"

    }

    if (
      status ===
      "High Risk"
    ) {

      return "border-orange-500/30 bg-orange-500/10 text-orange-400"

    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"

  }


  // =========================================================
  // REPORT TYPE
  // =========================================================

  const getReportType = (
    report
  ) => {

    return (
      report.type ||
      report.pollutionType ||
      "Not specified"
    )

  }


  // =========================================================
  // REPORT EMAIL
  // =========================================================

  const getReportEmail = (
    report
  ) => {

    return (
      report.email ||
      report.userEmail ||
      "No email"
    )

  }


  // =========================================================
  // REPORT DATE
  // =========================================================

  const getReportDate = (
    report
  ) => {

    return (
      report.createdAt ||
      report.submittedAt ||
      report.date ||
      report.updatedAt ||
      "Date unavailable"
    )

  }


  // =========================================================
  // OVERVIEW
  // =========================================================

  const renderOverview =
    () => {

      return (

        <>

          {/* HEADER */}

          <div>

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
              Monitor environmental conditions,
              review public complaints, and
              coordinate response actions.
            </p>

          </div>


          {/* STATISTICS */}

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
                TOTAL COMPLAINTS
              </p>

              <p className="mt-3 text-3xl font-bold text-[#38bdf8]">
                {reports.length}
              </p>

            </div>

          </div>


          {/* LIVE MAP */}

          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

            <h2 className="text-xl font-bold">
              Live Pollution Hotspots
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Monitor environmental incidents
              across the region.
            </p>

           <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-[#1e3445] bg-[#08121f]">

  <div className="text-center">

    <div className="text-5xl">
      🗺️
    </div>

    <p className="mt-4 font-semibold">
      Environmental Monitoring Map
    </p>

    <p className="mt-2 text-sm text-[#64748b]">
      Live monitoring is available in the Monitor Region section.
    </p>

    <button
      onClick={() =>
        changeView("monitor")
      }
      className="mt-5 rounded-lg bg-[#38bdf8] px-5 py-2.5 text-sm font-semibold text-[#02120f]"
    >
      Open Monitoring →
    </button>

  </div>

</div>

          </div>


          {/* COMPLAINT SUMMARY */}

          <div className="mt-7 grid gap-5 md:grid-cols-3">

            <button
              onClick={() =>
                changeView(
                  "respond"
                )
              }
              className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-6 text-left transition hover:-translate-y-1 hover:border-red-500/40"
            >

              <p className="text-3xl">
                🚨
              </p>

              <h3 className="mt-4 text-lg font-bold">
                Priority Incidents
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Review complaints that require
                official attention and response.
              </p>

            </button>


            <button
              onClick={() =>
                changeView(
                  "analyse"
                )
              }
              className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-6 text-left transition hover:-translate-y-1 hover:border-[#38bdf8]/50"
            >

              <p className="text-3xl">
                📊
              </p>

              <h3 className="mt-4 text-lg font-bold">
                Pollution Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Analyse risk levels, trends and
                complaint patterns.
              </p>

            </button>


            <button
              onClick={() =>
                changeView(
                  "monitor"
                )
              }
              className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-6 text-left transition hover:-translate-y-1 hover:border-[#20e0c0]/50"
            >

              <p className="text-3xl">
                🗺️
              </p>

              <h3 className="mt-4 text-lg font-bold">
                Monitor Region
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                View environmental hotspots and
                monitoring information.
              </p>

            </button>

          </div>

        </>

      )

    }


  // =========================================================
  // MONITOR VIEW
  // =========================================================
const renderMonitor =
  () => {

    return (

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
          MONITOR
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Environmental Monitoring
        </h1>

        <p className="mt-3 max-w-2xl text-lg text-[#94a3b8]">
          Monitor pollution hotspots,
          environmental conditions and
          active incidents across the region.
        </p>


        {/* LIVE POLLUTION */}

        <div className="mt-8 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Live Pollution Monitoring
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Real-time environmental conditions.
              </p>

            </div>

            <span className="rounded-full border border-[#20e0c0]/30 bg-[#20e0c0]/10 px-3 py-1 text-xs font-semibold text-[#20e0c0]">
              LIVE
            </span>

          </div>


          <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-8">

            {monitorLoading ? (

              <div className="flex h-[360px] items-center justify-center">

                <p className="text-[#94a3b8]">
                  Loading live pollution data...
                </p>

              </div>

            ) : monitorError ? (

              <div className="flex h-[360px] items-center justify-center">

                <p className="text-red-400">
                  {monitorError}
                </p>

              </div>

            ) : monitorData ? (

              <div>

                <div className="text-center">

                  <div className="text-5xl">
                    🗺️
                  </div>

                  <h3 className="mt-4 text-2xl font-bold">
                    Live Environmental Monitoring
                  </h3>

                  <p className="mt-2 text-[#94a3b8]">
                    Real-time pollution conditions at your current location.
                  </p>

                </div>


                {/* LOCATION */}

                <div className="mt-8 rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5">

                  <p className="text-sm text-[#64748b]">
                    LOCATION
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {monitorData.location ||
                      "Current detected location"}
                  </p>

                </div>


                {/* POLLUTION VALUES */}

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5 text-center">

                    <p className="text-sm text-[#64748b]">
                      PM2.5
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#20e0c0]">
                      {monitorData.pm25 ?? "N/A"}
                    </p>

                  </div>


                  <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5 text-center">

                    <p className="text-sm text-[#64748b]">
                      PM10
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#20e0c0]">
                      {monitorData.pm10 ?? "N/A"}
                    </p>

                  </div>


                  <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5 text-center">

                    <p className="text-sm text-[#64748b]">
                      NO₂
                    </p>

                    <p className="mt-2 text-3xl font-bold text-[#20e0c0]">
                      {monitorData.no2 ?? "N/A"}
                    </p>

                  </div>

                </div>


                {/* RISK */}

                <div className="mt-6 text-center">

                  <p className="text-sm text-[#64748b]">
                    CURRENT RISK
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#20e0c0]">
                    {monitorData.risk || "Unknown"}
                  </p>

                </div>

              </div>

            ) : (

              <div className="flex h-[360px] items-center justify-center">

                <p className="text-[#94a3b8]">
                  Monitoring data unavailable.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* MONITOR STATS */}

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-wider text-[#64748b]">
              Active Areas
            </p>

            <p className="mt-3 text-3xl font-bold text-[#38bdf8]">
              {activeIncidents}
            </p>

            <p className="mt-2 text-sm text-[#64748b]">
              Areas requiring monitoring
            </p>

          </div>


          <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-wider text-[#64748b]">
              High Risk
            </p>

            <p className="mt-3 text-3xl font-bold text-orange-400">
              {highRiskCount}
            </p>

            <p className="mt-2 text-sm text-[#64748b]">
              High-risk reports
            </p>

          </div>


          <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-6">

            <p className="text-xs uppercase tracking-wider text-[#64748b]">
              Critical
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {criticalCount}
            </p>

            <p className="mt-2 text-sm text-[#64748b]">
              Critical incidents
            </p>

          </div>

        </div>

      </div>

    )

  }

  // =========================================================
  // ANALYSE VIEW
  // =========================================================

  const renderAnalyse =
    () => {

      return (

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
            ANALYSE
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Pollution Analysis
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#94a3b8]">
            Understand pollution patterns,
            risk levels and complaint activity.
          </p>


          {/* ANALYSIS CARDS */}

          <div className="mt-8 grid gap-5 md:grid-cols-4">

            <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-6">

              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Total Reports
              </p>

              <p className="mt-3 text-3xl font-bold text-[#38bdf8]">
                {reports.length}
              </p>

            </div>


            <div className="rounded-2xl border border-purple-500/20 bg-[#0d1726] p-6">

              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Under Review
              </p>

              <p className="mt-3 text-3xl font-bold text-purple-400">
                {underReviewCount}
              </p>

            </div>


            <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-6">

              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                High Risk
              </p>

              <p className="mt-3 text-3xl font-bold text-orange-400">
                {highRiskCount}
              </p>

            </div>


            <div className="rounded-2xl border border-green-500/20 bg-[#0d1726] p-6">

              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Resolved
              </p>

              <p className="mt-3 text-3xl font-bold text-green-400">
                {resolvedCount}
              </p>

            </div>

          </div>


          {/* RISK DISTRIBUTION */}

          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-7">

            <h2 className="text-xl font-bold">
              Risk Distribution
            </h2>

            <p className="mt-1 text-sm text-[#64748b]">
              Current distribution of environmental
              complaints.
            </p>


            <div className="mt-8 space-y-5">

              {/* CRITICAL */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm">
                    Critical
                  </span>

                  <span className="text-sm text-red-400">
                    {criticalCount}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#08121f]">

                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width:
                        reports.length
                          ? `${Math.min(
                              100,
                              (criticalCount /
                                reports.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>


              {/* HIGH */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm">
                    High Risk
                  </span>

                  <span className="text-sm text-orange-400">
                    {highRiskCount}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#08121f]">

                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width:
                        reports.length
                          ? `${Math.min(
                              100,
                              (highRiskCount /
                                reports.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>


              {/* UNDER REVIEW */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm">
                    Under Review
                  </span>

                  <span className="text-sm text-purple-400">
                    {underReviewCount}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#08121f]">

                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width:
                        reports.length
                          ? `${Math.min(
                              100,
                              (underReviewCount /
                                reports.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>


              {/* RESOLVED */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-sm">
                    Resolved
                  </span>

                  <span className="text-sm text-green-400">
                    {resolvedCount}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#08121f]">

                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width:
                        reports.length
                          ? `${Math.min(
                              100,
                              (resolvedCount /
                                reports.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ANALYSIS MESSAGE */}

          <div className="mt-7 rounded-3xl border border-[#38bdf8]/20 bg-[#0d1726] p-7">

            <div className="flex gap-4">

              <div className="text-4xl">
                🤖
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  AI Risk Analysis
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#94a3b8]">
                  AI analysis can combine citizen
                  observations, environmental data
                  and pollution measurements to
                  identify emerging risks and help
                  officials prioritize incidents.
                </p>

              </div>

            </div>

          </div>

        </div>

      )

    }


  // =========================================================
  // RESPOND VIEW
  // =========================================================

  const renderRespond =
    () => {

      return (

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
            RESPOND
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Incident Response Center
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#94a3b8]">
            Review public complaints, prioritize
            incidents and update response status.
          </p>


          {/* RESPONSE SUMMARY */}

          <div className="mt-8 grid gap-5 md:grid-cols-4">

            <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-5">

              <p className="text-xs text-[#64748b]">
                CRITICAL
              </p>

              <p className="mt-3 text-3xl font-bold text-red-400">
                {criticalCount}
              </p>

            </div>


            <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-5">

              <p className="text-xs text-[#64748b]">
                HIGH RISK
              </p>

              <p className="mt-3 text-3xl font-bold text-orange-400">
                {highRiskCount}
              </p>

            </div>


            <div className="rounded-2xl border border-purple-500/20 bg-[#0d1726] p-5">

              <p className="text-xs text-[#64748b]">
                UNDER REVIEW
              </p>

              <p className="mt-3 text-3xl font-bold text-purple-400">
                {underReviewCount}
              </p>

            </div>


            <div className="rounded-2xl border border-green-500/20 bg-[#0d1726] p-5">

              <p className="text-xs text-[#64748b]">
                RESOLVED
              </p>

              <p className="mt-3 text-3xl font-bold text-green-400">
                {resolvedCount}
              </p>

            </div>

          </div>


          {/* INCIDENT LIST */}

          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Priority Incidents
                </h2>

                <p className="mt-1 text-sm text-[#64748b]">
                  Review and update citizen
                  pollution complaints.
                </p>

              </div>

              <div className="rounded-lg bg-[#08121f] px-4 py-2 text-sm text-[#38bdf8]">
                {reports.length} Reports
              </div>

            </div>


            {reports.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-12 text-center">

                <div className="text-5xl">
                  📋
                </div>

                <p className="mt-4 font-semibold">
                  No incidents available
                </p>

                <p className="mt-2 text-sm text-[#64748b]">
                  Public pollution complaints
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {[...reports]
  .sort((a, b) => {

    const riskOrder = {
      Critical: 4,
      High: 3,
      Moderate: 2,
      Low: 1,
      Unknown: 0,
    }

    return (
      (riskOrder[b.risk] || 0) -
      (riskOrder[a.risk] || 0)
    )

  })
  .map(
    (report) => {

                    const reportType =
                      getReportType(
                        report
                      )

                    const reportEmail =
                      getReportEmail(
                        report
                      )

                    const reportDate =
                      getReportDate(
                        report
                      )

                    const currentStatus =
                      report.status ||
                      "Pending"


                    return (

                      <div
                        key={
                          report.id
                        }
                        className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5 transition hover:border-[#38bdf8]/40"
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          {/* INCIDENT INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                              <span className="rounded-md bg-[#0d1726] px-3 py-1 text-xs font-semibold text-[#38bdf8]">
                                {report.id}
                              </span>

                              <span
  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
    currentStatus
  )}`}
>
  {currentStatus}
</span>

<span
  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
    report.risk === "Critical"
      ? "border-red-500/30 bg-red-500/10 text-red-400"
      : report.risk === "High"
        ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
        : report.risk === "Moderate"
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
          : "border-green-500/30 bg-green-500/10 text-green-400"
  }`}
>
  Risk: {report.risk || "Unknown"}
</span>

                            </div>


                            <h3 className="mt-4 text-lg font-bold">
                              {reportType}
                            </h3>


                            <p className="mt-2 text-sm text-[#cbd5e1]">
                              📍{" "}
                              {report.location ||
                                "Location not specified"}
                            </p>


                            <p className="mt-2 text-sm text-[#64748b]">
                              👤{" "}
                              {report.userName ||
                                "Public User"}
                            </p>


                            <p className="mt-1 text-xs text-[#475569]">
                              {reportEmail}
                            </p>


                            <p className="mt-2 text-xs text-[#64748b]">
                              Submitted:{" "}
                              {reportDate}
                            </p>

                          </div>


                          {/* RESPONSE ACTION */}

                          <div className="w-full lg:w-56">

                            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#64748b]">
                              Update Status
                            </label>

                            <select
                              value={
                                currentStatus
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  report.id,
                                  e.target.value
                                )
                              }
                              className={`w-full rounded-xl border bg-[#0d1726] px-4 py-3 text-sm font-semibold outline-none ${getStatusStyle(
                                currentStatus
                              )}`}
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Under Review">
                                Under Review
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>

                            </select>

                          </div>

                        </div>

                      </div>

                    )

                  }
                )}

              </div>

            )}

          </div>


          {/* RESPONSE WORKFLOW */}

          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-7">

            <h2 className="text-xl font-bold">
              Recommended Response Workflow
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <div className="rounded-xl border border-[#1e3445] bg-[#08121f] p-5">

                <p className="text-2xl">
                  🔎
                </p>

                <p className="mt-3 font-semibold">
                  Detect
                </p>

                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  Identify incoming pollution
                  complaints.
                </p>

              </div>


              <div className="rounded-xl border border-[#1e3445] bg-[#08121f] p-5">

                <p className="text-2xl">
                  🤖
                </p>

                <p className="mt-3 font-semibold">
                  Analyse
                </p>

                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  Assess risk and pollution
                  conditions.
                </p>

              </div>


              <div className="rounded-xl border border-[#1e3445] bg-[#08121f] p-5">

                <p className="text-2xl">
                  🚨
                </p>

                <p className="mt-3 font-semibold">
                  Prioritize
                </p>

                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  Focus on incidents requiring
                  immediate attention.
                </p>

              </div>


              <div className="rounded-xl border border-[#1e3445] bg-[#08121f] p-5">

                <p className="text-2xl">
                  ✅
                </p>

                <p className="mt-3 font-semibold">
                  Resolve
                </p>

                <p className="mt-1 text-xs leading-5 text-[#64748b]">
                  Track actions until the incident
                  is resolved.
                </p>

              </div>

            </div>

          </div>

        </div>

      )

    }


  // =========================================================
  // SELECT CORRECT VIEW
  // =========================================================

  const renderContent = () => {

    if (
      view === "monitor"
    ) {
      return renderMonitor()
    }

    if (
      view === "analyse"
    ) {
      return renderAnalyse()
    }

    if (
      view === "respond"
    ) {
      return renderRespond()
    }

    return renderOverview()

  }


  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (

    <div className="min-h-screen bg-[#050b14] text-white">

      {/* ===================================================
          TOP BAR
      ==================================================== */}

      <header className="flex h-20 items-center justify-between border-b border-[#1e3445] bg-[#08121f] px-6">

        {/* HAMBURGER */}

        <button
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

        <button
          onClick={() =>
            changeView(
              "overview"
            )
          }
          className="font-bold"
        >

          <span className="text-[#38bdf8]">
            Aero
          </span>

          Shield

        </button>


        {/* OFFICIAL NAME */}

        <div className="text-right">

          <p className="text-sm font-semibold">
            {userName}
          </p>

          <p className="text-xs text-[#64748b]">
            Official
          </p>

        </div>

      </header>


      {/* ===================================================
          SIDEBAR
      ==================================================== */}

      <Sidebar
        role="official"
        open={sidebarOpen}
        setOpen={
          setSidebarOpen
        }
      />


      {/* ===================================================
          MAIN
      ==================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {renderContent()}

      </main>

    </div>

  )

}

export default OfficialDashboard