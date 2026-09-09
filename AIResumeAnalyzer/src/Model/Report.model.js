const mongoose = require("mongoose")


/**
 * Job Description: String
 * Resume: String
 * Self Description: String
 * 
 * 
 * Score: Number
 * Tech Questions: 
 *          [{
 *              Question: "",
 *              Answer: "",
 *              Relevance: ""
 *          }]
 * Behavioral Questions: 
 *          [{
 *              Question: "",
 *              Answer: "",
 *              Relevance: ""
 *          }]
 * Skill Gaps: 
 *          [{
 *              Skill: "",
 *              Severity:{
 *                  Type: String,
 *                  enum: ["low", "medium", "high"]
 *              }
 *          }]
 * Prep plan: 
 *          [{
 *              Day: Number,
 *              Focus: String,
 *              Task: [String]
 *          }]
 */

const TechnicalSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    relevance: {
        type: String,
        required: [true, "Relevance is required"]
    }
}, {
    _id: false // no need of id, no uniqueness required
})

const BehavSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    relevance: {
        type: String,
        required: [true, "Relevance is required"]
    }
}, {
    _id: false // no need of id, no uniqueness required
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    }
}, {
    _id: false
})

const prepPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    task: {
        type: [String],
        required: [true, "Task is required"]
    }
})

const BehavioralSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    },
    relevance: {
        type: String,
        required: [true, "Relevance is required"]
    }
})

const SkillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    },
    reason: {
        type: String,
        required: [true, "Reason is required"]
    }
})

const PrepPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    task: {
        type: [String],
        required: [true, "Task is required"]
    }
})

const ReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    JD: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    SD: {
        type: String
    },
    Score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    TechnicalQuestions: [TechnicalSchema],
    BehavioralQuestions: [BehavSchema],
    SkillGaps: [SkillGapSchema],
    PrepPlan: [PrepPlanSchema],


}, {
    timestamps: true
})

const reportModel = mongoose.model("Report", ReportSchema)

module.exports = reportModel