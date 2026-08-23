import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

// GET pollution data
export const getPollutionData = async (latitude, longitude) => {
  const response = await api.get("/api/pollution", {
    params: {
      latitude,
      longitude,
    },
  })

  return response.data
}
// GET all pollution reports
export const getReports = async () => {
  const response = await api.get("/api/reports")
  return response.data
}
// POST pollution report
export const submitPollutionReport = async (reportData) => {
  const response = await api.post("/api/reports", reportData)
  return response.data
}
// UPDATE REPORT STATUS
export const updateReportStatus = async (
  reportId,
  status
) => {

  const response = await api.patch(
    `/api/reports/${reportId}/status`,
    null,
    {
      params: {
        status,
      },
    }
  )

  return response.data
}
export default api