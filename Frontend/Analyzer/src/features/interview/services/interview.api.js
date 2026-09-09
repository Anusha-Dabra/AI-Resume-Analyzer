import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

/**
 * @description send request to generate interview report
 * @returns {Promise} response from the API
 */
export async function generateInterviewReportApi({ jobDescription, selfDescription, resumeFile }) {
    const formData = new FormData()
    formData.append("JD", jobDescription)
    formData.append("SD", selfDescription || "")
    formData.append("resume", resumeFile)

    try {
        const response = await api.post("/api/interview", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    } catch (error) {
        console.error("Error generating report:", error)
        throw error
    }
}

/**
 * @description fetch interview report by id
 * @param {string} id 
 * @returns {Promise} 
 */
export async function getInterviewReportByIdApi(id) {
    try {
        const response = await api.get(`/api/interview/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching report:", error)
        throw error
    }
}

/**
 * @description fetch all interview reports by logged in user  
 * @returns {Promise} 
 */
export async function getAllUserInterviewReportsApi() {
    try {
        const response = await api.get("/api/interview/interviews")
        return response.data
    } catch (error) {
        console.error("Error fetching all reports:", error)
        throw error
    }
}

/**
 * @description delete interview report by id
 * @param {string} id 
 * @returns {Promise} 
 */
export async function deleteInterviewReportApi(id) {
    try {
        const response = await api.delete(`/api/interview/${id}`)
        return response.data
    } catch (error) {
        console.error("Error deleting report:", error)
        throw error
    }
}


