import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

function Sidebar({
  role,
  open,
  setOpen,
  activeSection,
  setActiveSection,
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // =========================================================
  // PROFILE
  // =========================================================

  const [profileOpen, setProfileOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    age: "",
    address: "",
    phone: "",
    about: "",
    department: "",
    designation: "",
  })

  // =========================================================
  // PUBLIC NAVIGATION
  // =========================================================

  const publicItems = [
    {
      name: "Explore",
      icon: "🗺️",
      description: "Nearby pollution zones",
      section: "explore",
    },
    {
      name: "Report Pollution",
      icon: "📝",
      description: "Submit pollution incidents",
      section: "report",
    },
    {
      name: "My Reports",
      icon: "📊",
      description: "Monitor your complaints",
      section: "track",
    },
  ]

  // =========================================================
  // OFFICIAL NAVIGATION
  // =========================================================

  const officialItems = [
    {
      name: "Monitor",
      icon: "🗺️",
      description: "Live pollution hotspots",
      section: "monitor",
    },
    {
      name: "Analyse",
      icon: "📈",
      description: "Risk & pollution trends",
      section: "analyse",
    },
    {
      name: "Respond",
      icon: "⚡",
      description: "Prioritize incidents",
      section: "respond",
    },
  ]

  const items =
    role === "public"
      ? publicItems
      : officialItems

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    try {
      const savedAccount = JSON.parse(
        localStorage.getItem("aeroShieldAccount") || "{}"
      )

      setProfile({
        fullName:
          savedAccount.fullName ||
          localStorage.getItem("aeroShieldUserName") ||
          "",

        email:
          savedAccount.email ||
          localStorage.getItem("aeroShieldEmail") ||
          "",

        age: savedAccount.age || "",

        address: savedAccount.address || "",

        phone: savedAccount.phone || "",

        about: savedAccount.about || "",

        department:
          savedAccount.department || "",

        designation:
          savedAccount.designation || "",
      })
    } catch {
      setProfile({
        fullName:
          localStorage.getItem("aeroShieldUserName") || "",

        email:
          localStorage.getItem("aeroShieldEmail") || "",

        age: "",
        address: "",
        phone: "",
        about: "",
        department: "",
        designation: "",
      })
    }
  }, [open])

  // =========================================================
  // PROFILE INPUT CHANGE
  // =========================================================

  const handleProfileChange = (field, value) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = () => {
    try {
      const currentAccount = JSON.parse(
        localStorage.getItem("aeroShieldAccount") || "{}"
      )

      const updatedAccount = {
        ...currentAccount,

        fullName: profile.fullName.trim(),

        email: profile.email
          .trim()
          .toLowerCase(),

        age: profile.age.trim(),

        address: profile.address.trim(),

        phone: profile.phone.trim(),

        about: profile.about.trim(),

        department:
          profile.department.trim(),

        designation:
          profile.designation.trim(),

        role: role,
      }

      // Save current account
      localStorage.setItem(
        "aeroShieldAccount",
        JSON.stringify(updatedAccount)
      )

      // Save quick-access information
      localStorage.setItem(
        "aeroShieldUserName",
        updatedAccount.fullName
      )

      localStorage.setItem(
        "aeroShieldEmail",
        updatedAccount.email
      )

      localStorage.setItem(
        "aeroShieldRole",
        updatedAccount.role
      )

      // =====================================================
      // UPDATE ALL ACCOUNTS
      // =====================================================

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

      const oldEmail =
        currentAccount.email || ""

      const oldRole =
        currentAccount.role || role

      const accountIndex =
        accounts.findIndex(
          (account) =>
            (account.email || "")
              .trim()
              .toLowerCase() ===
              oldEmail
              .trim()
              .toLowerCase() &&
            account.role === oldRole
        )

      if (accountIndex !== -1) {
        accounts[accountIndex] =
          updatedAccount
      } else {
        accounts.push(updatedAccount)
      }

      localStorage.setItem(
        "aeroShieldAccounts",
        JSON.stringify(accounts)
      )

      setProfile({
        fullName:
          updatedAccount.fullName,

        email:
          updatedAccount.email,

        age:
          updatedAccount.age,

        address:
          updatedAccount.address,

        phone:
          updatedAccount.phone,

        about:
          updatedAccount.about,

        department:
          updatedAccount.department,

        designation:
          updatedAccount.designation,
      })

      setEditingProfile(false)

      alert("Profile updated successfully.")
    } catch {
      alert("Unable to update profile.")
    }
  }

  // =========================================================
  // CANCEL PROFILE EDIT
  // =========================================================

  const handleCancelEdit = () => {
    try {
      const savedAccount = JSON.parse(
        localStorage.getItem("aeroShieldAccount") || "{}"
      )

      setProfile({
        fullName:
          savedAccount.fullName || "",

        email:
          savedAccount.email || "",

        age:
          savedAccount.age || "",

        address:
          savedAccount.address || "",

        phone:
          savedAccount.phone || "",

        about:
          savedAccount.about || "",

        department:
          savedAccount.department || "",

        designation:
          savedAccount.designation || "",
      })
    } catch {
      // Keep current values if account data is invalid
    }

    setEditingProfile(false)
  }

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    const currentAccount = JSON.parse(
      localStorage.getItem(
        "aeroShieldAccount"
      ) || "{}"
    )

    // Remove from all accounts
    try {
      const accounts = JSON.parse(
        localStorage.getItem(
          "aeroShieldAccounts"
        ) || "[]"
      )

      const remainingAccounts =
        accounts.filter(
          (account) =>
            !(
              (account.email || "")
                .trim()
                .toLowerCase() ===
                (currentAccount.email || "")
                  .trim()
                  .toLowerCase() &&
              account.role ===
                currentAccount.role
            )
        )

      localStorage.setItem(
        "aeroShieldAccounts",
        JSON.stringify(
          remainingAccounts
        )
      )
    } catch {
      // Ignore invalid account list
    }

    localStorage.removeItem(
      "aeroShieldAccount"
    )

    localStorage.removeItem(
      "aeroShieldUserName"
    )

    localStorage.removeItem(
      "aeroShieldEmail"
    )

    localStorage.removeItem(
      "aeroShieldRole"
    )

    localStorage.removeItem(
      "aeroShieldLoggedIn"
    )

    setOpen(false)

    window.location.href = "/"
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "aeroShieldLoggedIn"
    )

    localStorage.removeItem(
      "aeroShieldUserName"
    )

    localStorage.removeItem(
      "aeroShieldEmail"
    )

    localStorage.removeItem(
      "aeroShieldRole"
    )

    localStorage.removeItem(
      "aeroShieldAccount"
    )

    setOpen(false)

    window.location.href = "/"
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = (section) => {
    setOpen(false)
    setProfileOpen(false)

    // PUBLIC
    if (role === "public") {
      setActiveSection(section)
      return
    }

    // OFFICIAL
    if (role === "official") {
      navigate(
        `/official-dashboard?view=${section}`
      )
    }
  }

  // =========================================================
  // OVERVIEW
  // =========================================================

  const handleOverview = () => {
    setOpen(false)
    setProfileOpen(false)

    if (role === "public") {
      setActiveSection("overview")
      return
    }

    navigate(
      "/official-dashboard?view=overview"
    )
  }

  // =========================================================
  // PROFILE NAME
  // =========================================================

  const profileName =
    profile.fullName ||
    "AeroShield User"

  const profileInitial =
    profileName
      .charAt(0)
      .toUpperCase()

  // =========================================================
  // CURRENT OFFICIAL VIEW
  // =========================================================

  const currentOfficialView =
    searchParams.get("view") ||
    "overview"

  return (
    <>
      {/* =====================================================
          OVERLAY
      ====================================================== */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto border-r border-[#1e3445] bg-[#08121f] p-6 shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">

              <span className="text-[#20e0c0]">
                Aero
              </span>

              Shield

            </h2>

            <p className="mt-1 text-xs uppercase tracking-widest text-[#64748b]">

              {role === "public"
                ? "Public Portal"
                : "Official Portal"}

            </p>

          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1e3445] text-[#94a3b8] transition hover:border-[#20e0c0] hover:text-white"
          >
            ✕
          </button>

        </div>


        {/* ===================================================
            PROFILE CARD
        ==================================================== */}

        <div className="mt-8">

          <button
            onClick={() =>
              setProfileOpen(
                !profileOpen
              )
            }
            className="w-full rounded-2xl border border-[#1e3445] bg-[#0d1726] p-4 text-left transition hover:border-[#20e0c0]/50"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00bfa6] text-lg font-bold text-[#02120f]">
                {profileInitial}
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate font-semibold text-white">
                  {profileName}
                </p>

                <p className="truncate text-xs text-[#64748b]">
                  {role === "public"
                    ? "Public User"
                    : "Environmental Official"}
                </p>

              </div>

              <span className="text-[#64748b]">
                {profileOpen
                  ? "▲"
                  : "▼"}
              </span>

            </div>

          </button>


          {/* =================================================
              PROFILE PANEL
          ================================================== */}

          {profileOpen && (

            <div className="mt-3 rounded-2xl border border-[#1e3445] bg-[#0d1726] p-5">

              <div className="mb-5">

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#20e0c0]">
                  My Profile
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {role === "public"
                    ? "Public Profile"
                    : "Official Profile"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#64748b]">
                  Keep your profile information
                  updated for a professional
                  AeroShield experience.
                </p>

              </div>


              {/* FULL NAME */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  FULL NAME
                </label>

                {editingProfile ? (

                  <input
                    type="text"
                    value={
                      profile.fullName
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "fullName",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="text-sm text-[#cbd5e1]">
                    {profile.fullName ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* EMAIL */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  EMAIL
                </label>

                {editingProfile ? (

                  <input
                    type="email"
                    value={
                      profile.email
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "email",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="break-all text-sm text-[#cbd5e1]">
                    {profile.email ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* AGE */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  AGE
                </label>

                {editingProfile ? (

                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={
                      profile.age
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "age",
                        e.target.value
                      )
                    }
                    placeholder="Enter your age"
                    className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="text-sm text-[#cbd5e1]">
                    {profile.age ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* ADDRESS */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  ADDRESS
                </label>

                {editingProfile ? (

                  <textarea
                    rows="3"
                    value={
                      profile.address
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="Enter your address"
                    className="w-full resize-none rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="text-sm leading-5 text-[#cbd5e1]">
                    {profile.address ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* PHONE */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  PHONE
                </label>

                {editingProfile ? (

                  <input
                    type="tel"
                    value={
                      profile.phone
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "phone",
                        e.target.value
                      )
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="text-sm text-[#cbd5e1]">
                    {profile.phone ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* ABOUT */}

              <div className="mb-4">

                <label className="mb-2 block text-xs font-medium text-[#64748b]">
                  ABOUT
                </label>

                {editingProfile ? (

                  <textarea
                    rows="3"
                    value={
                      profile.about
                    }
                    onChange={(e) =>
                      handleProfileChange(
                        "about",
                        e.target.value
                      )
                    }
                    placeholder={
                      role === "public"
                        ? "Tell us a little about yourself"
                        : "Professional summary"
                    }
                    className="w-full resize-none rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                  />

                ) : (

                  <p className="text-sm leading-5 text-[#cbd5e1]">
                    {profile.about ||
                      "Not added"}
                  </p>

                )}

              </div>


              {/* OFFICIAL DETAILS */}

              {role === "official" && (

                <>

                  {/* DEPARTMENT */}

                  <div className="mb-4">

                    <label className="mb-2 block text-xs font-medium text-[#64748b]">
                      DEPARTMENT
                    </label>

                    {editingProfile ? (

                      <input
                        type="text"
                        value={
                          profile.department
                        }
                        onChange={(e) =>
                          handleProfileChange(
                            "department",
                            e.target.value
                          )
                        }
                        placeholder="Environmental Department"
                        className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                      />

                    ) : (

                      <p className="text-sm text-[#cbd5e1]">
                        {profile.department ||
                          "Not added"}
                      </p>

                    )}

                  </div>


                  {/* DESIGNATION */}

                  <div className="mb-4">

                    <label className="mb-2 block text-xs font-medium text-[#64748b]">
                      DESIGNATION
                    </label>

                    {editingProfile ? (

                      <input
                        type="text"
                        value={
                          profile.designation
                        }
                        onChange={(e) =>
                          handleProfileChange(
                            "designation",
                            e.target.value
                          )
                        }
                        placeholder="Environmental Officer"
                        className="w-full rounded-lg border border-[#1e3445] bg-[#08121f] px-3 py-2.5 text-sm text-white outline-none focus:border-[#20e0c0]"
                      />

                    ) : (

                      <p className="text-sm text-[#cbd5e1]">
                        {profile.designation ||
                          "Not added"}
                      </p>

                    )}

                  </div>

                </>

              )}


              {/* PROFILE BUTTONS */}

              <div className="mt-5 border-t border-[#1e3445] pt-4">

                {!editingProfile ? (

                  <button
                    onClick={() =>
                      setEditingProfile(
                        true
                      )
                    }
                    className="w-full rounded-lg bg-[#00bfa6] px-4 py-2.5 text-sm font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
                  >
                    ✏️ Edit Profile
                  </button>

                ) : (

                  <div className="space-y-2">

                    <button
                      onClick={
                        handleSaveProfile
                      }
                      className="w-full rounded-lg bg-[#00bfa6] px-4 py-2.5 text-sm font-semibold text-[#02120f] transition hover:bg-[#20e0c0]"
                    >
                      ✓ Save Changes
                    </button>

                    <button
                      onClick={
                        handleCancelEdit
                      }
                      className="w-full rounded-lg border border-[#1e3445] px-4 py-2.5 text-sm font-medium text-[#94a3b8] transition hover:bg-[#112033] hover:text-white"
                    >
                      Cancel
                    </button>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>


        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav className="mt-8 space-y-3">

          {/* OVERVIEW */}

          <button
            onClick={
              handleOverview
            }
            className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${
              (
                role === "public"
                  ? activeSection ===
                    "overview"
                  : currentOfficialView ===
                    "overview"
              )
                ? "border-[#20e0c0]/40 bg-[#112033] text-white"
                : "border-transparent text-[#cbd5e1] hover:border-[#1e3445] hover:bg-[#112033] hover:text-white"
            }`}
          >

            <span className="text-lg">
              ⌂
            </span>

            <div>

              <p className="font-medium">
                Overview
              </p>

              <p className="text-xs text-[#64748b]">
                Dashboard
              </p>

            </div>

          </button>


          {/* ROLE-SPECIFIC ITEMS */}

          {items.map((item) => (

            <button
              key={item.name}
              onClick={() =>
                handleNavigation(
                  item.section
                )
              }
              className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${
                (
                  role === "public"
                    ? activeSection ===
                      item.section
                    : currentOfficialView ===
                      item.section
                )
                  ? "border-[#20e0c0]/40 bg-[#112033] text-white"
                  : "border-transparent text-[#cbd5e1] hover:border-[#1e3445] hover:bg-[#112033] hover:text-white"
              }`}
            >

              <span className="text-xl">
                {item.icon}
              </span>

              <div>

                <p className="font-medium">
                  {item.name}
                </p>

                <p className="text-xs text-[#64748b]">
                  {item.description}
                </p>

              </div>

            </button>

          ))}

        </nav>


        {/* ===================================================
            ACCOUNT ACTIONS
        ==================================================== */}

        <div className="mt-8 space-y-3 border-t border-[#1e3445] pt-6">

          <button
            onClick={
              handleDeleteAccount
            }
            className="w-full rounded-xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10"
          >
            🗑️ Delete Account
          </button>

          <button
            onClick={
              handleLogout
            }
            className="w-full rounded-xl border border-[#1e3445] px-4 py-3 text-sm font-medium text-[#94a3b8] transition hover:bg-[#112033] hover:text-white"
          >
            Logout
          </button>

        </div>

      </aside>
    </>
  )
}

export default Sidebar