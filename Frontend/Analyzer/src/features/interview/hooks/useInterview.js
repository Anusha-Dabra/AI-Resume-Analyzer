import {
    generateInterviewReportApi,
    getAllUserInterviewReportsApi,
    getInterviewReportByIdApi,
    deleteInterviewReportApi
} from "../services/interview.api"

import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        error,
        setError,
        report,
        setReport,
        allReports,
        setAllReports
    } = context

    const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, JD, SD, resume }) => {
        setLoading(true)
        if (setError) setError(null)

        const payload = {
            jobDescription: jobDescription || JD || "",
            selfDescription: selfDescription || SD || "",
            resumeFile: resumeFile || resume || null
        }

        try {
            const data = await generateInterviewReportApi(payload)
            const generatedReport = data.report || data
            setReport(generatedReport)
            return data
        } catch (err) {
            console.error("Error in generateInterviewReport hook:", err)
            if (setError) setError(err.response?.data?.message || err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getInterviewReportById = async (id) => {
        setLoading(true)
        if (setError) setError(null)
        try {
            const data = await getInterviewReportByIdApi(id)
            const fetchedReport = data.report || data
            setReport(fetchedReport)
            return data
        } catch (err) {
            console.error("Error in getInterviewReportById hook:", err)
            if (setError) setError(err.response?.data?.message || err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getAllUserInterviewReports = async () => {
        setLoading(true)
        if (setError) setError(null)
        try {
            const data = await getAllUserInterviewReportsApi()
            const reportsList = data.reports || data
            setAllReports(reportsList)
            return data
        } catch (err) {
            console.error("Error in getAllUserInterviewReports hook:", err)
            if (setError) setError(err.response?.data?.message || err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteInterviewReport = async (id) => {
        setLoading(true)
        if (setError) setError(null)
        try {
            const data = await deleteInterviewReportApi(id)
            setAllReports(prev => prev.filter(r => r._id !== id))
            if (report && report._id === id) {
                setReport(null)
            }
            return data
        } catch (err) {
            console.error("Error in deleteInterviewReport hook:", err)
            if (setError) setError(err.response?.data?.message || err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        report,
        allReports,
        generateInterviewReport,
        getAllUserInterviewReports,
        getInterviewReportById,
        deleteInterviewReport
    }
}