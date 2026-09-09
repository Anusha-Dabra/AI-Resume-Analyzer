const { GoogleGenAI, Type } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "The overall candidate-job match score between 0 and 100 strictly reflecting the actual relevance of the candidate's background to the job description"
        },
        techQuestions: {
            type: Type.ARRAY,
            description: "Technical interview questions along with ideal answer blueprint and relevance",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Technical question" },
                    answer: { type: Type.STRING, description: "Ideal answer and approach" },
                    relevance: { type: Type.STRING, description: "Relevance to the job description" }
                },
                required: ["question", "answer", "relevance"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral interview questions along with answer approach and relevance",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Behavioral question" },
                    answer: { type: Type.STRING, description: "How to answer and key points to cover" },
                    relevance: { type: Type.STRING, description: "Relevance to the job description" }
                },
                required: ["question", "answer", "relevance"]
            }
        },
        skillGapSchema: {
            type: Type.ARRAY,
            description: "Skills the candidate is lacking along with severity and reason",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "Missing skill" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Severity of gap" },
                    reason: { type: Type.STRING, description: "Reason why this skill gap matters" }
                },
                required: ["skill", "severity", "reason"]
            }
        },
        prepPlan: {
            type: Type.ARRAY,
            description: "Day-by-day interview preparation plan",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "Day number starting from 1" },
                    focus: { type: Type.STRING, description: "Focus area for the day" },
                    task: {
                        type: Type.ARRAY,
                        description: "Specific actionable tasks for the day",
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "task"]
            }
        }
    },
    required: ["score", "techQuestions", "behavioralQuestions", "skillGapSchema", "prepPlan"]
}

async function generateInterviewReport({ resume, JD, SD }) {

    const prompt = `        
You are an expert technical recruiter and interview coach.

Analyze the following candidate information:

RESUME CONTENT:
${resume}

JOB DESCRIPTION:
${JD}

SELF DESCRIPTION:
${SD}

Generate a comprehensive, highly accurate interview preparation report for this candidate.

STRICT SCORING & ANALYSIS RULES:
1. Candidate-Job Match Score (0 to 100):
   - You MUST evaluate the candidate's actual background and skills strictly against the target job description.
   - If the candidate's resume (e.g. tutor, teacher, driver, sales associate) is unrelated or lacks the technical skills required in the job description (e.g. software engineer, developer, data scientist), give a LOW match score (e.g. 5 to 30) reflecting the real lack of fit.
   - Only give high match scores (70 to 100) if the candidate's experience and technical skills directly match the job requirements.
2. Technical Interview Questions:
   - Generate technical questions relevant to the target job description and the candidate's level.
3. Behavioral Interview Questions:
   - Generate behavioral questions tailored to the scenario.
4. Skill Gaps:
   - Identify specific missing skills, tools, or requirements from the JD that are missing or weak in the candidate's profile.
5. Preparation Plan (PrepPlan):
   - Create a realistic 5-day structured plan to help the candidate prepare and bridge their gaps.
6. Do NOT invent matching skills or experience that are absent from the resume.`

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })
    console.log("GEMINI RESPONSE TEXT:", response.text)
    return JSON.parse(response.text)
}

module.exports = generateInterviewReport
