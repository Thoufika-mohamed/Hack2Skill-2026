import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"

import {
  useSearchParams,
} from "react-router-dom"

import Sidebar from "../../components/Sidebar"
import {
  getReports,
  updateReportStatus,
  getPollutionData,
  getGeospatialMapData,
} from "../../services/api"
import PollutionLeafletMap from "../../components/map/PollutionLeafletMap"
import CitizenReportDetailsModal from "../../components/CitizenReportDetailsModal"



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
  // CITIZEN REPORTS & AUTO-REFRESH
  // =========================================================

  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState("")
  const [selectedReport, setSelectedReport] = useState(null)

  // Report filter states
  const [reportRiskFilter, setReportRiskFilter] = useState("All")
  const [reportStatusFilter, setReportStatusFilter] = useState("All")
  const [reportSearchQuery, setReportSearchQuery] = useState("")

  const loadReports = useCallback(async () => {
    try {
      setReportsLoading(true)
      setReportsError("")
      const data = await getReports()
      console.log("OFFICIAL DASHBOARD LOADED REPORTS:", data)
      setReports(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load reports in Official Dashboard:", error)
      setReportsError("Unable to load citizen reports from backend")
    } finally {
      setReportsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReports()
    // Poll every 10 seconds for real-time synchronization with citizen submissions
    const interval = setInterval(loadReports, 10000)
    return () => clearInterval(interval)
  }, [loadReports])

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
  // GEOSPATIAL MAP DATA FOR OFFICIAL DASHBOARD
  // =========================================================

  const [officialMapData, setOfficialMapData] = useState({ zones: [], heatmap_points: [] })
  const [officialMapLoading, setOfficialMapLoading] = useState(false)

  const loadOfficialMapData = useCallback(async () => {
    try {
      setOfficialMapLoading(true)
      const data = await getGeospatialMapData("official")
      setOfficialMapData(data)
    } catch (error) {
      console.error("Failed to load official map data:", error)
    } finally {
      setOfficialMapLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOfficialMapData()
    const interval = setInterval(loadOfficialMapData, 30000)
    return () => clearInterval(interval)
  }, [loadOfficialMapData])

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
            ? { ...report, ...updatedReport, status: newStatus }
            : report
        )
      )

      setSelectedReport((current) => {
        if (current && current.id === reportId) {
          return { ...current, ...updatedReport, status: newStatus }
        }
        return current
      })

      loadOfficialMapData()
      loadReports()

    } catch (error) {

      console.error(
        "PATCH ERROR:",
        error
      )

    }

  }


  // =========================================================
  // STATISTICS & FILTERED CITIZEN REPORTS
  // =========================================================

  const activeIncidents =
    reports.filter(
      (report) => (report.status || "").toLowerCase() !== "resolved"
    ).length

  const criticalCount =
    reports.filter(
      (report) => (report.risk || "").toLowerCase() === "critical"
    ).length

  const highRiskCount =
    reports.filter(
      (report) => (report.risk || "").toLowerCase() === "high"
    ).length

  const moderateCount =
    reports.filter(
      (report) => (report.risk || "").toLowerCase() === "moderate"
    ).length

  const lowRiskCount =
    reports.filter(
      (report) => (report.risk || "").toLowerCase() === "low"
    ).length

  const underReviewCount =
    reports.filter(
      (report) => (report.status || "").toLowerCase() === "under review"
    ).length

  const resolvedCount =
    reports.filter(
      (report) => (report.status || "").toLowerCase() === "resolved"
    ).length

  // Filtered citizen reports supporting Risk, Status, and Search
  const filteredCitizenReports = useMemo(() => {
    return reports.filter((r) => {
      // Risk filter
      if (reportRiskFilter !== "All") {
        const rRisk = (r.risk || "Low").toLowerCase()
        if (rRisk !== reportRiskFilter.toLowerCase()) {
          return false
        }
      }
      // Status filter
      if (reportStatusFilter !== "All") {
        const rStatus = (r.status || "Pending").toLowerCase()
        if (rStatus !== reportStatusFilter.toLowerCase()) {
          return false
        }
      }
      // Search query
      if (reportSearchQuery.trim()) {
        const q = reportSearchQuery.toLowerCase()
        const loc = (r.location || "").toLowerCase()
        const desc = (r.description || "").toLowerCase()
        const type = (r.pollution_type || r.type || "").toLowerCase()
        const idStr = String(r.id || "")
        if (!loc.includes(q) && !desc.includes(q) && !type.includes(q) && !idStr.includes(q)) {
          return false
        }
      }
      return true
    })
  }, [reports, reportRiskFilter, reportStatusFilter, reportSearchQuery])


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
      report.pollution_type ||
      report.type ||
      report.pollutionType ||
      "Air Pollution"
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

    const rawDate =
      report.timestamp ||
      report.createdAt ||
      report.submittedAt ||
      report.date ||
      report.updatedAt

    if (!rawDate) {
      return "Date unavailable"
    }

    try {
      const parsed = new Date(rawDate)
      return isNaN(parsed.getTime()) ? rawDate : parsed.toLocaleString()
    } catch {
      return rawDate
    }

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

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Live Pollution Hotspots
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Regional environmental incidents, active zones, and real-time sensor stations.
                </p>
              </div>
              <button
                onClick={() => changeView("monitor")}
                className="rounded-xl bg-[#38bdf8] px-4 py-2 text-xs font-bold text-[#02120f] transition hover:brightness-110 shadow-md"
              >
                Open Operational Control Center →
              </button>
            </div>

            <PollutionLeafletMap
              variant="public"
              zones={officialMapData.zones || []}
              heatmapPoints={officialMapData.heatmap_points || []}
              height="380px"
            />

          </div>


          {/* RECENT CITIZEN REPORTS */}
          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Recent Citizen Reports
                </h2>
                <p className="mt-1 text-sm text-[#64748b]">
                  Latest public pollution complaints submitted via the citizen portal.
                </p>
              </div>
              <button
                onClick={() => changeView("respond")}
                className="rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-2 text-xs font-bold text-[#38bdf8] hover:border-[#38bdf8] transition"
              >
                View All {reports.length} Reports →
              </button>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-8 text-center text-[#64748b] text-sm">
                No citizen reports received yet.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {reports.slice(0, 6).map((report) => {
                  const rRisk = report.risk || "Low"
                  const rStatus = report.status || "Pending"
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="cursor-pointer rounded-2xl border border-[#1e3445] bg-[#08121f] p-4 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-[#38bdf8]">
                          #{report.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                              rRisk === "Critical"
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : rRisk === "High"
                                ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                                : rRisk === "Moderate"
                                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {rRisk}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${getStatusStyle(
                              rStatus
                            )}`}
                          >
                            {rStatus}
                          </span>
                        </div>
                      </div>

                      <h4 className="mt-2 text-sm font-bold text-white truncate">
                        {getReportType(report)}
                      </h4>
                      <p className="mt-1 text-xs text-[#cbd5e1] truncate">
                        📍 {report.location || "Location not specified"}
                      </p>
                      {report.description && (
                        <p className="mt-2 text-xs text-[#94a3b8] line-clamp-2 italic">
                          "{report.description}"
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#1e3445]/50 text-[11px] text-[#64748b]">
                        <span>{getReportDate(report)}</span>
                        <span className="text-[#38bdf8] font-medium hover:underline">
                          View details →
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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

        {/* OPERATIONAL POLLUTION CONTROL MAP */}
        <div className="mt-8">
          <PollutionLeafletMap
            variant="official"
            zones={officialMapData.zones || []}
            heatmapPoints={officialMapData.heatmap_points || []}
            onUpdateStatus={handleStatusChange}
            height="620px"
          />
        </div>

        {/* REGIONAL SENSOR TELEMETRY */}
        <div className="mt-8 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Live Sensor Station Telemetry
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                Real-time atmospheric readings from regional monitoring stations.
              </p>
            </div>

            <span className="rounded-full border border-[#20e0c0]/30 bg-[#20e0c0]/10 px-3 py-1 text-xs font-semibold text-[#20e0c0]">
              STATION TELEMETRY
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-6">
            {monitorLoading ? (
              <div className="flex h-36 items-center justify-center">
                <p className="text-[#94a3b8]">
                  Loading station readings...
                </p>
              </div>
            ) : monitorError ? (
              <div className="flex h-36 items-center justify-center">
                <p className="text-red-400">
                  {monitorError}
                </p>
              </div>
            ) : monitorData ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-center">
                <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4 text-left">
                  <p className="text-xs text-[#64748b]">Detected Station</p>
                  <p className="mt-1 font-semibold text-white truncate">
                    {monitorData.location || "Coimbatore Regional Station"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4">
                  <p className="text-xs text-[#64748b]">PM2.5</p>
                  <p className="mt-1 text-2xl font-bold text-[#20e0c0]">
                    {monitorData.pm25 ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4">
                  <p className="text-xs text-[#64748b]">PM10</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {monitorData.pm10 ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4">
                  <p className="text-xs text-[#64748b]">NO₂</p>
                  <p className="mt-1 text-2xl font-bold text-[#38bdf8]">
                    {monitorData.no2 ?? "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4">
                  <p className="text-xs text-[#64748b]">Risk Status</p>
                  <p className="mt-1 text-2xl font-bold text-[#20e0c0]">
                    {monitorData.risk || "Normal"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center">
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

          <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">

            <div className="rounded-2xl border border-[#38bdf8]/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Total Reports
              </p>
              <p className="mt-2 text-2xl font-bold text-[#38bdf8]">
                {reports.length}
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Critical
              </p>
              <p className="mt-2 text-2xl font-bold text-red-400">
                {criticalCount}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                High Risk
              </p>
              <p className="mt-2 text-2xl font-bold text-orange-400">
                {highRiskCount}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Moderate
              </p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">
                {moderateCount}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Low Risk
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {lowRiskCount}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-[#0d1726] p-4">
              <p className="text-xs uppercase tracking-wider text-[#64748b]">
                Under Review
              </p>
              <p className="mt-2 text-2xl font-bold text-purple-400">
                {underReviewCount}
              </p>
            </div>

          </div>


          {/* FILTERS & SEARCH TOOLBAR */}
          <div className="mt-7 rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by ID, location, description, or type..."
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-2.5 pl-9 text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-xs text-[#64748b]">🔍</span>
                {reportSearchQuery && (
                  <button
                    onClick={() => setReportSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-[#64748b] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadReports}
                disabled={reportsLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-2.5 text-xs font-semibold text-[#38bdf8] hover:border-[#38bdf8] transition disabled:opacity-50"
              >
                <span>🔄</span>
                <span>{reportsLoading ? "Refreshing..." : "Refresh Reports"}</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1e3445]">
              {/* Risk Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-[#64748b] mr-1">Risk Level:</span>
                {["All", "Low", "Moderate", "High", "Critical"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setReportRiskFilter(lvl)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      reportRiskFilter === lvl
                        ? "bg-[#38bdf8] text-[#050b14] font-bold"
                        : "bg-[#08121f] text-[#94a3b8] border border-[#1e3445] hover:text-white"
                    }`}
                  >
                    {lvl === "Low" ? "🟢 Low" : lvl === "Moderate" ? "🟡 Moderate" : lvl === "High" ? "🟠 High" : lvl === "Critical" ? "🔴 Critical" : "All"}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-[#64748b] mr-1">Status:</span>
                {["All", "Under Review", "Pending", "In Progress", "Resolved"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReportStatusFilter(st)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      reportStatusFilter === st
                        ? "bg-[#38bdf8] text-[#050b14] font-bold"
                        : "bg-[#08121f] text-[#94a3b8] border border-[#1e3445] hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* INCIDENT LIST */}

          <div className="mt-7 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Citizen Complaints & Incident Reports
                </h2>

                <p className="mt-1 text-sm text-[#64748b]">
                  Showing {filteredCitizenReports.length} of {reports.length} verified citizen submissions.
                </p>

              </div>

              <div className="flex items-center gap-2">
                {(reportRiskFilter !== "All" || reportStatusFilter !== "All" || reportSearchQuery) && (
                  <button
                    onClick={() => {
                      setReportRiskFilter("All")
                      setReportStatusFilter("All")
                      setReportSearchQuery("")
                    }}
                    className="rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white"
                  >
                    Reset Filters
                  </button>
                )}
                <div className="rounded-lg bg-[#08121f] px-4 py-2 text-xs font-semibold text-[#38bdf8] border border-[#1e3445]">
                  {filteredCitizenReports.length} Shown
                </div>
              </div>

            </div>


            {reports.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-12 text-center">

                <div className="text-5xl">
                  📋
                </div>

                <p className="mt-4 font-semibold">
                  No citizen complaints registered
                </p>

                <p className="mt-2 text-sm text-[#64748b]">
                  Public pollution complaints will appear here automatically when submitted.
                </p>

              </div>

            ) : filteredCitizenReports.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-[#1e3445] bg-[#08121f] p-12 text-center">

                <div className="text-4xl">
                  🔍
                </div>

                <p className="mt-3 font-semibold text-white">
                  No reports match the selected filters
                </p>

                <p className="mt-2 text-sm text-[#64748b]">
                  Try adjusting or resetting your risk level, status, or search query.
                </p>

                <button
                  onClick={() => {
                    setReportRiskFilter("All")
                    setReportStatusFilter("All")
                    setReportSearchQuery("")
                  }}
                  className="mt-4 rounded-xl bg-[#38bdf8] px-4 py-2 text-xs font-bold text-[#050b14]"
                >
                  Show All Reports
                </button>

              </div>

            ) : (

              <div className="mt-6 space-y-4">

                {[...filteredCitizenReports]
                  .sort((a, b) => {
                    const riskOrder = {
                      Critical: 4,
                      High: 3,
                      Moderate: 2,
                      Low: 1,
                      Unknown: 0,
                    }
                    const diff = (riskOrder[b.risk] || 0) - (riskOrder[a.risk] || 0)
                    if (diff !== 0) return diff
                    return (b.id || 0) - (a.id || 0)
                  })
                  .map((report) => {
                    const reportType = getReportType(report)
                    const reportEmail = getReportEmail(report)
                    const reportDate = getReportDate(report)
                    const currentStatus = report.status || "Pending"
                    const rRisk = report.risk || "Low"

                    return (

                      <div
                        key={report.id}
                        className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-5 transition hover:border-[#38bdf8]/40"
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                          {/* INCIDENT INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                              <span className="rounded-md bg-[#0d1726] px-3 py-1 font-mono text-xs font-bold text-[#38bdf8] border border-[#1e3445]">
                                #{report.id}
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
                                  rRisk === "Critical"
                                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                                    : rRisk === "High"
                                    ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                                    : rRisk === "Moderate"
                                    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                }`}
                              >
                                {rRisk === "Critical"
                                  ? "🔴 Critical Risk"
                                  : rRisk === "High"
                                  ? "🟠 High Risk"
                                  : rRisk === "Moderate"
                                  ? "🟡 Moderate Risk"
                                  : "🟢 Low Risk"}
                              </span>

                            </div>


                            <h3 className="mt-3 text-lg font-bold text-white">
                              {reportType}
                            </h3>


                            <p className="mt-1.5 text-sm text-[#cbd5e1] flex items-center gap-1.5">
                              <span className="text-[#38bdf8]">📍</span>
                              <span className="font-medium">{report.location || "Location not specified"}</span>
                            </p>


                            {/* CITIZEN DESCRIPTION */}
                            {report.description && (
                              <div className="mt-3 rounded-xl border border-[#1e3445] bg-[#0d1726] p-3 text-xs">
                                <span className="font-semibold text-[#64748b] block mb-1">
                                  Citizen Report Description:
                                </span>
                                <p className="text-[#e2e8f0] italic leading-relaxed">
                                  "{report.description}"
                                </p>
                              </div>
                            )}


                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
                              <span>👤 {report.userName || "Public User"}</span>
                              {reportEmail && reportEmail !== "No email" && (
                                <span>✉️ {reportEmail}</span>
                              )}
                              <span>🕒 {reportDate}</span>
                            </div>

                          </div>


                          {/* RESPONSE ACTIONS & STATUS */}

                          <div className="flex flex-col gap-3 w-full lg:w-56 shrink-0">

                            <button
                              onClick={() => setSelectedReport(report)}
                              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-4 py-2.5 text-xs font-bold text-[#38bdf8] hover:bg-[#38bdf8]/20 transition"
                            >
                              <span>🔍</span>
                              <span>View Full Details</span>
                            </button>

                            <div>
                              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#64748b]">
                                Investigation Status
                              </label>

                              <select
                                value={currentStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    report.id,
                                    e.target.value
                                  )
                                }
                                className={`w-full rounded-xl border bg-[#0d1726] px-3 py-2 text-xs font-semibold outline-none transition ${getStatusStyle(
                                  currentStatus
                                )}`}
                              >

                                <option value="Under Review">
                                  Under Review
                                </option>

                                <option value="Pending">
                                  Pending
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

      {/* CITIZEN REPORT DETAILS MODAL */}
      {selectedReport && (
        <CitizenReportDetailsModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateStatus={handleStatusChange}
        />
      )}

    </div>

  )

}

export default OfficialDashboard