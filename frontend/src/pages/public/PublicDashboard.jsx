import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import {
  submitPollutionReport,
  getReports,
  getPollutionData
} from "../../services/api"
function PublicDashboard() {

  // =====================================================
  // ROUTER
  // =====================================================

  const routerLocation = useLocation()
  const navigate = useNavigate()


  // =====================================================
  // USER NAME
  // =====================================================

  const userName =
    localStorage.getItem("aeroShieldUserName") || "there"


  // =====================================================
  // GET SECTION FROM CURRENT URL
  // =====================================================

  const getSectionFromURL = () => {

    if (routerLocation.pathname === "/public/report") {
      return "report"
    }

    if (routerLocation.pathname === "/public/reports") {
      return "track"
    }

    const params = new URLSearchParams(
      routerLocation.search
    )

    if (params.get("view") === "explore") {
      return "explore"
    }

    return "overview"
  }


  // =====================================================
  // SIDEBAR
  // =====================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false)


  // =====================================================
  // ACTIVE SECTION
  // =====================================================

  const [activeSection, setActiveSection] =
    useState(getSectionFromURL)


  // =====================================================
  // KEEP SECTION IN SYNC WITH URL
  // =====================================================

  useEffect(() => {

    const section = getSectionFromURL()

    setActiveSection(section)

  }, [
    routerLocation.pathname,
    routerLocation.search
  ])


  // =====================================================
  // PUBLIC SECTION NAVIGATION
  // =====================================================

  const handleSectionChange = (section) => {

    setActiveSection(section)

    setSidebarOpen(false)

    if (section === "overview") {

      navigate("/public-dashboard")

      return
    }


    if (section === "explore") {

      navigate("/public-dashboard?view=explore")

      return
    }


    if (section === "report") {

      navigate("/public/report")

      return
    }


    if (section === "track") {

      navigate("/public/reports")

      return
    }

  }


  // =====================================================
  // REPORT FORM
  // =====================================================

  const [pollutionType, setPollutionType] =
    useState("Smoke")
    const [pollutionData, setPollutionData] =
  useState(null)

const [pollutionLoading, setPollutionLoading] =
  useState(false)

const [pollutionError, setPollutionError] =
  useState("")


  const [location, setLocation] =
    useState("")


  const [description, setDescription] =
    useState("")


  const [submitMessage, setSubmitMessage] =
    useState("")
useEffect(() => {

  const loadPollutionData = () => {

    if (!navigator.geolocation) {

      setPollutionError(
        "Location access is not supported by your browser."
      )

      return
    }

    setPollutionLoading(true)
    setPollutionError("")

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const latitude =
            position.coords.latitude

          const longitude =
            position.coords.longitude

          const data =
            await getPollutionData(
              latitude,
              longitude
            )

          setPollutionData(data)

        } catch (error) {

          console.error(
            "Failed to load pollution data:",
            error
          )

          setPollutionError(
            "Unable to load live pollution data."
          )

        } finally {

          setPollutionLoading(false)

        }

      },

      (error) => {

        console.error(
          "Location error:",
          error
        )

        setPollutionError(
          "Please allow location access to view live pollution data."
        )

        setPollutionLoading(false)

      }

    )

  }

  loadPollutionData()

}, [])

  // =====================================================
  // HANDLE REPORT SUBMISSION
  // =====================================================

  const handleSubmitReport = () => {

  setSubmitMessage("")

  // CHECK REQUIRED FIELDS
  if (
    !location.trim() ||
    !description.trim()
  ) {

    setSubmitMessage(
      "Please enter the location and description."
    )

    return
  }

  // CHECK GEOLOCATION SUPPORT
  if (!navigator.geolocation) {

    setSubmitMessage(
      "Location access is not supported by your browser."
    )

    return
  }

  setSubmitMessage(
    "Getting your location..."
  )

  // GET CURRENT LOCATION
  navigator.geolocation.getCurrentPosition(

    async (position) => {

      try {

        const latitude =
          position.coords.latitude

        const longitude =
          position.coords.longitude

        // DATA EXPECTED BY FASTAPI
        const reportData = {

          location:
            location.trim(),

          latitude:
            latitude,

          longitude:
            longitude,

          pollution_type:
  pollutionType,

risk:
  pollutionData?.risk || "Unknown",

description:
  description.trim(),

          timestamp:
            new Date().toISOString(),

          photo_url:
            null

        }

        // SEND REPORT TO FASTAPI
        const savedReport =
          await submitPollutionReport(
            reportData
          )

        console.log(
          "Report saved:",
          savedReport
        )

        // SUCCESS MESSAGE
        setSubmitMessage(
          `Report submitted successfully! Your complaint ID is ${savedReport.id}`
        )

        // CLEAR FORM
        setPollutionType("Smoke")
        setLocation("")
        setDescription("")

        // OPEN TRACK PAGE
        setTimeout(() => {

          setSubmitMessage("")

          handleSectionChange("track")

        }, 1500)

      } catch (error) {

        console.error(
          "Report submission failed:",
          error
        )

        setSubmitMessage(
          "Failed to submit report. Please try again."
        )

      }

    },

    (error) => {

      console.error(
        "Location error:",
        error
      )

      setSubmitMessage(
        "Please allow location access to submit your report."
      )

    }

  )

}


  // =====================================================
  // GET MY REPORTS
  // =====================================================

const [myReports, setMyReports] = useState([])

useEffect(() => {

  const loadReports = async () => {

    try {

      const reports = await getReports()

      setMyReports(reports)

    } catch (error) {

      console.error(
        "Failed to load reports:",
        error
      )

      setMyReports([])

    }

  }

  loadReports()

}, [])


  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {

    if (status === "Resolved") {

      return "border-green-500/30 bg-green-500/10 text-green-400"

    }


    if (status === "In Progress") {

      return "border-orange-500/30 bg-orange-500/10 text-orange-400"

    }


    if (status === "Under Review") {

      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"

    }


    return "border-blue-500/30 bg-blue-500/10 text-blue-400"

  }


  // =====================================================
  // STATUS PROGRESS
  // =====================================================

  const statuses = [

    "Pending",

    "Under Review",

    "In Progress",

    "Resolved",

  ]


  const getStatusIndex = (status) => {

    return statuses.indexOf(status)

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-[#050b14] text-white">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="border-b border-[#1e3445] bg-[#07111d]">

        <div className="flex h-20 items-center justify-between px-6 lg:px-10">


          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#008f7a] text-xl">

              🌿

            </div>


            <div>

              <h1 className="text-xl font-bold">

                AeroShield

              </h1>


              <p className="text-xs tracking-wider text-[#64748b]">

                PUBLIC

              </p>

            </div>

          </div>


          {/* HAMBURGER */}

          <button

            onClick={() =>
              setSidebarOpen(true)
            }

            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e3445] bg-[#0d1726] text-xl transition hover:border-[#20e0c0] hover:text-[#20e0c0]"

          >

            ☰

          </button>


        </div>

      </header>


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar

        role="public"

        open={sidebarOpen}

        setOpen={setSidebarOpen}

        activeSection={activeSection}

        setActiveSection={handleSectionChange}

      />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">


        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeSection === "overview" && (

          <>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">

              Public Dashboard

            </p>


            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">

              Welcome,{" "}

              <span className="text-[#20e0c0]">

                {userName}

              </span>

              !

            </h1>


            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#94a3b8]">

              Stay informed about the air around you, report pollution incidents, and keep track of your environmental complaints.

            </p>


            {/* DASHBOARD CARDS */}

            <div className="mt-12 grid gap-6 md:grid-cols-3">


              {/* EXPLORE */}

              <button

                onClick={() =>
                  handleSectionChange("explore")
                }

                className="group rounded-2xl border border-[#1e3445] bg-[#0d1726] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#20e0c0]/60 hover:shadow-[0_0_35px_rgba(32,224,192,0.08)]"

              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#20e0c0]/10 text-2xl">

                  🗺️

                </div>


                <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#20e0c0]">

                  EXPLORE

                </p>


                <h2 className="mt-2 text-xl font-bold">

                  Nearby pollution zones

                </h2>


                <p className="mt-3 text-sm leading-6 text-[#94a3b8]">

                  View pollution hotspots and environmental conditions around your location.

                </p>


                <span className="mt-6 block text-sm font-semibold text-[#20e0c0]">

                  Explore map →

                </span>

              </button>


              {/* REPORT */}

              <button

                onClick={() =>
                  handleSectionChange("report")
                }

                className="group rounded-2xl border border-[#1e3445] bg-[#0d1726] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#20e0c0]/60 hover:shadow-[0_0_35px_rgba(32,224,192,0.08)]"

              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#20e0c0]/10 text-2xl">

                  🚨

                </div>


                <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#20e0c0]">

                  REPORT

                </p>


                <h2 className="mt-2 text-xl font-bold">

                  Submit pollution incidents

                </h2>


                <p className="mt-3 text-sm leading-6 text-[#94a3b8]">

                  Report unusual pollution, smoke, waste, odour, or other environmental incidents.

                </p>


                <span className="mt-6 block text-sm font-semibold text-[#20e0c0]">

                  Submit report →

                </span>

              </button>


              {/* TRACK */}

              <button

                onClick={() =>
                  handleSectionChange("track")
                }

                className="group rounded-2xl border border-[#1e3445] bg-[#0d1726] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-[#20e0c0]/60 hover:shadow-[0_0_35px_rgba(32,224,192,0.08)]"

              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#20e0c0]/10 text-2xl">

                  📋

                </div>


                <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#20e0c0]">

                  TRACK

                </p>


                <h2 className="mt-2 text-xl font-bold">

                  Monitor your complaints

                </h2>


                <p className="mt-3 text-sm leading-6 text-[#94a3b8]">

                  Check your submitted reports and see whether they are pending, under review, or resolved.

                </p>


                <span className="mt-6 block text-sm font-semibold text-[#20e0c0]">

                  View reports →

                </span>

              </button>


            </div>

          </>

        )}


        {/* =================================================
            EXPLORE
        ================================================= */}

        {activeSection === "explore" && (

          <section>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">

              Explore

            </p>


            <h1 className="mt-3 text-4xl font-bold">

              Nearby pollution zones

            </h1>


            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#94a3b8]">

              Explore pollution hotspots and understand the environmental conditions around you.

            </p>


            <div className="mt-10 grid gap-5 md:grid-cols-3">


              {/* LOW */}

              <div className="rounded-2xl border border-green-500/20 bg-[#0d1726] p-6">

                <div className="text-3xl">

                  🟢

                </div>


                <h2 className="mt-4 text-xl font-bold">

                  Low Risk

                </h2>


                <p className="mt-2 text-sm text-[#94a3b8]">

                  Air quality is currently within a relatively safe range.

                </p>

              </div>


              {/* MODERATE */}

              <div className="rounded-2xl border border-yellow-500/20 bg-[#0d1726] p-6">

                <div className="text-3xl">

                  🟡

                </div>


                <h2 className="mt-4 text-xl font-bold">

                  Moderate Risk

                </h2>


                <p className="mt-2 text-sm text-[#94a3b8]">

                  Some pollution indicators require attention.

                </p>

              </div>


              {/* HIGH */}

              <div className="rounded-2xl border border-red-500/20 bg-[#0d1726] p-6">

                <div className="text-3xl">

                  🔴

                </div>


                <h2 className="mt-4 text-xl font-bold">

                  High Risk

                </h2>


                <p className="mt-2 text-sm text-[#94a3b8]">

                  Pollution levels are elevated in this area.

                </p>

              </div>


            </div>


            {/* MAP */}

            <div className="mt-8 flex min-h-[420px] items-center justify-center rounded-3xl border border-[#1e3445] bg-[#0d1726]">

              <div className="text-center">

                <div className="text-6xl">

                  🗺️

                </div>


                <h2 className="mt-5 text-2xl font-bold">

                  Environmental Monitoring Map

                </h2>


                {pollutionLoading ? (

  <p className="mt-3 text-[#94a3b8]">
    Loading live pollution data...
  </p>

) : pollutionError ? (

  <p className="mt-3 text-red-400">
    {pollutionError}
  </p>

) : pollutionData ? (

  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
      <p className="text-sm text-[#94a3b8]">
        Location
      </p>

      <p className="mt-2 font-semibold text-white">
        {pollutionData.location}
      </p>
    </div>


    <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
      <p className="text-sm text-[#94a3b8]">
        PM2.5
      </p>

      <p className="mt-2 text-2xl font-bold text-[#20e0c0]">
        {pollutionData.pm25}
      </p>
    </div>


    <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
      <p className="text-sm text-[#94a3b8]">
        PM10
      </p>

      <p className="mt-2 text-2xl font-bold text-[#20e0c0]">
        {pollutionData.pm10}
      </p>
    </div>


    <div className="rounded-2xl border border-[#1e3445] bg-[#08121f] p-4">
      <p className="text-sm text-[#94a3b8]">
        NO₂
      </p>

      <p className="mt-2 text-2xl font-bold text-[#20e0c0]">
        {pollutionData.no2}
      </p>
    </div>


    <div className="sm:col-span-2 lg:col-span-4">
      <p className="text-sm text-[#94a3b8]">
        Current Risk
      </p>

      <p className="mt-2 text-xl font-bold text-[#20e0c0]">
        {pollutionData.risk}
      </p>
    </div>

  </div>

) : (

  <p className="mt-3 text-[#94a3b8]">
    No live pollution data available.
  </p>

)}

              </div>

            </div>


          </section>

        )}


        {/* =================================================
            REPORT
        ================================================= */}

        {activeSection === "report" && (

          <section>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">

              Report

            </p>


            <h1 className="mt-3 text-4xl font-bold">

              Submit a pollution incident

            </h1>


            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#94a3b8]">

              Help your community by reporting pollution or unusual environmental conditions.

            </p>


            <div className="mt-10 max-w-3xl rounded-3xl border border-[#1e3445] bg-[#0d1726] p-8">

              <div className="space-y-6">


                {/* POLLUTION TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Type of pollution

                  </label>


                  <select

                    value={pollutionType}

                    onChange={(e) =>
                      setPollutionType(e.target.value)
                    }

                    className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-3 text-[#cbd5e1] outline-none focus:border-[#20e0c0]"

                  >

                    <option>Smoke</option>

                    <option>Air pollution</option>

                    <option>Dust</option>

                    <option>Industrial emission</option>

                    <option>Waste burning</option>

                    <option>Unusual odour</option>

                    <option>Vehicle pollution</option>

                    <option>Other</option>

                  </select>

                </div>


                {/* LOCATION */}

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

                    placeholder="Enter incident location"

                    className="w-full rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-3 text-white placeholder-[#64748b] outline-none focus:border-[#20e0c0]"

                  />

                </div>


                {/* DESCRIPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold">

                    Description

                  </label>


                  <textarea

                    rows="5"

                    value={description}

                    onChange={(e) =>
                      setDescription(e.target.value)
                    }

                    placeholder="Describe what you observed..."

                    className="w-full resize-none rounded-xl border border-[#1e3445] bg-[#08121f] px-4 py-3 text-white placeholder-[#64748b] outline-none focus:border-[#20e0c0]"

                  />

                </div>


                {/* SUCCESS / ERROR */}

                {submitMessage && (

                  <div

                    className={`rounded-xl border px-4 py-3 text-sm ${
                      submitMessage.includes(
                        "successfully"
                      )
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}

                  >

                    {submitMessage}

                  </div>

                )}


                {/* SUBMIT */}

                <button

                  type="button"

                  onClick={handleSubmitReport}

                  className="w-full rounded-xl bg-[#00bfa6] px-5 py-4 font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"

                >

                  Submit Pollution Report →

                </button>


              </div>

            </div>

          </section>

        )}


        {/* =================================================
            TRACK / MY REPORTS
        ================================================= */}

        {activeSection === "track" && (

          <section>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">

              My Reports

            </p>


            <h1 className="mt-3 text-4xl font-bold">

              Your pollution reports

            </h1>


            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#94a3b8]">

              Monitor the progress of pollution incidents you have submitted.

            </p>


            {myReports.length === 0 ? (

              /* =================================================
                 NO REPORTS
              ================================================= */

              <div className="mt-10 rounded-3xl border border-[#1e3445] bg-[#0d1726] p-12 text-center">

                <div className="text-5xl">

                  📋

                </div>


                <h2 className="mt-5 text-2xl font-bold">

                  No reports yet

                </h2>


                <p className="mt-3 text-[#94a3b8]">

                  You haven't submitted any pollution complaints yet.

                </p>


                <button

                  onClick={() =>
                    handleSectionChange("report")
                  }

                  className="mt-6 rounded-xl bg-[#00bfa6] px-6 py-3 font-semibold text-[#02120f] hover:bg-[#20e0c0]"

                >

                  Report Pollution →

                </button>

              </div>

            ) : (

              /* =================================================
                 REPORT LIST
              ================================================= */

              <div className="mt-10 space-y-6">

                {myReports
                  .slice()
                  .reverse()
                  .map((report) => {

                    const currentIndex =
                      getStatusIndex(
                        report.status
                      )


                    return (

                      <div

                        key={report.id}

                        className="rounded-3xl border border-[#1e3445] bg-[#0d1726] p-6"

                      >


                        {/* HEADER */}

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">


                          <div>

                            <p className="text-xs uppercase tracking-widest text-[#64748b]">

                              Complaint ID

                            </p>


                            <h2 className="mt-2 text-xl font-bold text-[#20e0c0]">

                              {report.id}

                            </h2>


                            <p className="mt-3 text-sm text-[#94a3b8]">

                              Submitted on {new Date(report.timestamp).toLocaleString()}

                            </p>

                          </div>


                          <span

                            className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                              report.status
                            )}`}

                          >

                            {report.status}

                          </span>


                        </div>


                        {/* DETAILS */}

                        <div className="mt-6 grid gap-5 md:grid-cols-2">


                          <div>

                            <p className="text-xs uppercase tracking-wider text-[#64748b]">

                              Type

                            </p>


                            <p className="mt-2 font-semibold">

                              {report.pollution_type}

                            </p>

                          </div>


                          <div>

                            <p className="text-xs uppercase tracking-wider text-[#64748b]">

                              Location

                            </p>


                            <p className="mt-2 font-semibold">

                              {report.location}

                            </p>

                          </div>


                        </div>


                        {/* DESCRIPTION */}

                        <div className="mt-6">

                          <p className="text-xs uppercase tracking-wider text-[#64748b]">

                            Description

                          </p>


                          <p className="mt-2 leading-7 text-[#cbd5e1]">

                            {report.description}

                          </p>

                        </div>


                        {/* PROGRESS */}

                        <div className="mt-8 border-t border-[#1e3445] pt-6">

                          <p className="mb-6 text-sm font-semibold">

                            Complaint Progress

                          </p>


                          <div className="grid grid-cols-4 gap-2">

                            {statuses.map(
                              (status, index) => {

                                const completed =
                                  index <=
                                  currentIndex


                                return (

                                  <div
                                    key={status}
                                    className="text-center"
                                  >

                                    <div

                                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                        completed
                                          ? "bg-[#20e0c0] text-[#02120f]"
                                          : "border border-[#334155] bg-[#08121f] text-[#64748b]"
                                      }`}

                                    >

                                      {completed
                                        ? "✓"
                                        : index + 1}

                                    </div>


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

                              }
                            )}

                          </div>

                        </div>


                      </div>

                    )

                  })}

              </div>

            )}

          </section>

        )}

      </main>

    </div>

  )

}

export default PublicDashboard