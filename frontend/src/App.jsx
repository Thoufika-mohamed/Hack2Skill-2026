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
            PUBLIC LOGIN
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
            PublicDashboard handles the Report section.
        ================================================= */}

        <Route
          path="/public/report"
          element={<PublicDashboard />}
        />


        {/* =================================================
            PUBLIC MY REPORTS
            PublicDashboard handles the Track section.
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


      </Routes>

    </BrowserRouter>

  )

}

export default App