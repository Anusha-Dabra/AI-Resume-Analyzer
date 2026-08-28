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
        resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        console.log(resumeContent.text)
    } catch (error) {
        return res.status(500).json({
            message: "Error parsing resume",
            error: error.message
        })
    }

    const { JD, SD } = req.body

    if (!JD || !SD) {
        return res.status(400).json({
            message: "JD and SD are required"
        })
    }

    try {
        const reportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            JD: JD,
            SD: SD
        })

        const interviewData = await AIReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            JD: JD,
            SD: SD,
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




module.exports = { generateInterviewReportController }