const express = require("express")
const interviewRouter = express.Router()
const authMiddleware = require("../Middlewares/auth.middleware")
const interviewController = require("../Controllers/interviewReport.controller")
const upload = require("../Middlewares/file.middleware")

/**
 * @route POST /api/interview
 * @description Generate interview report for the candidate
 * @access Private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/interviews
 * @description get all interview reports by logged in user
 * @access Private
 */
interviewRouter.get("/interviews", authMiddleware.authUser, interviewController.getAllUserInterviewReportsController)

/**
 * @route GET /api/interview/:id
 * @description Fetch interview report by ID
 * @access Private
 */
interviewRouter.get("/:id", authMiddleware.authUser, interviewController.getInterviewReportController)

/**
 * @route GET /api/interview/
 * @description get all interview reports by logged in user
 * @access Private
 */
/**
 * @route DELETE /api/interview/:id
 * @description Delete interview report by ID
 * @access Private
 */
interviewRouter.delete("/:id", authMiddleware.authUser, interviewController.deleteInterviewReportController)

module.exports = interviewRouter

