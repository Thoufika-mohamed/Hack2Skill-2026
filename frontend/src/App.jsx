import { BrowserRouter, Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import RoleSelection from "./pages/RoleSelection"
import Login from "./pages/Login"
import CreateAccount from "./pages/CreateAccount"

import PublicDashboard from "./pages/public/PublicDashboard"

import OfficialDashboard from "./pages/official/OfficialDashboard"


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =================================================
            LANDING PAGE
        ================================================= */}

        <Route
          path="/"
          element={<Landing />}
        />


        {/* =================================================
            ROLE SELECTION
        ================================================= */}

        <Route
          path="/roles"
          element={<RoleSelection />}
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            CREATE ACCOUNT
        ================================================= */}

        <Route
          path="/create-account"
          element={<CreateAccount />}
        />


        {/* =================================================
            PUBLIC DASHBOARD
        ================================================= */}

        <Route
          path="/public-dashboard"
          element={<PublicDashboard />}
        />


        {/* =================================================
            PUBLIC REPORT
        ================================================= */}

        <Route
          path="/public/report"
          element={<PublicDashboard />}
        />


        {/* =================================================
            PUBLIC MY REPORTS
        ================================================= */}

        <Route
          path="/public/reports"
          element={<PublicDashboard />}
        />


        {/* =================================================
            OFFICIAL DASHBOARD
        ================================================= */}

        <Route
          path="/official-dashboard"
          element={<OfficialDashboard />}
        />


        {/* =================================================
            OFFICIAL ANALYSIS
            Landing → Analyse
        ================================================= */}

        <Route
          path="/official/analyse"
          element={<OfficialDashboard />}
        />


        {/* =================================================
            OFFICIAL RESPONSE
            Landing → Act
        ================================================= */}

        <Route
          path="/official/respond"
          element={<OfficialDashboard />}
        />


      </Routes>

    </BrowserRouter>

  )
}

export default App