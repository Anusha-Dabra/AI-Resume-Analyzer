const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/Ai.services")
const AIReportModel = require("../Model/Report.model")

async function generateInterviewReportController(req, res) {

    if (!req.file) {
        return res.status(400).json({
            message: "Resume is required"
        })
    }

    let resumeContent = ""
    try {
        const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeContent = parsed.text || ""
    } catch (error) {
        return res.status(500).json({
            message: "Error parsing resume",
            error: error.message
        })
    }

    const { JD, SD } = req.body

    if (!JD) {
        return res.status(400).json({
            message: "Job Description (JD) is required"
        })
    }

    try {
        const reportByAi = await generateInterviewReport({
            resume: resumeContent,
            JD: JD,
            SD: SD || ""
        })

        const interviewData = await AIReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            JD: JD,
            SD: SD || "",
            Score: reportByAi.score,
            TechnicalQuestions: reportByAi.techQuestions,
            BehavioralQuestions: reportByAi.behavioralQuestions,
            SkillGaps: reportByAi.skillGapSchema,
            PrepPlan: reportByAi.prepPlan
        })

        return res.status(201).json({
            message: "Interview report generated successfully",
            report: interviewData
        })
    }
    catch (error) {
        console.error("Error in generateInterviewReportController:", error)
        return res.status(500).json({
            message: "Error generating interview report",
            error: error.message
        })
    }
}

async function getInterviewReportController(req, res) {
    try {
        const report = await AIReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        })

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        return res.status(200).json({
            report
        })
    } catch (error) {
        console.error("Error fetching report:", error)
        return res.status(500).json({
            message: "Error fetching interview report",
            error: error.message
        })
    }
}

async function getAllUserInterviewReportsController(req, res) {
    try {
        const reports = await AIReportModel.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        })

        return res.status(200).json({
            reports
        })
    } catch (error) {
        console.error("Error fetching all reports:", error)
        return res.status(500).json({
            message: "Error fetching all reports",
            error: error.message
        })
    }
}
async function deleteInterviewReportController(req, res) {
    try {
        const report = await AIReportModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        })

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found or unauthorized"
            })
        }

        return res.status(200).json({
            message: "Interview report deleted successfully",
            reportId: req.params.id
        })
    } catch (error) {
        console.error("Error deleting report:", error)
        return res.status(500).json({
            message: "Error deleting interview report",
            error: error.message
        })
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllUserInterviewReportsController,
    deleteInterviewReportController
}
