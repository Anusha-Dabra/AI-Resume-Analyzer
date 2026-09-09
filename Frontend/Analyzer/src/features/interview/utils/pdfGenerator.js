import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Utility to generate and download a standard professional PDF report with clean white styling.
 * @param {Object} report The interview report object to render into PDF
 */
export async function exportReportToPDF(report) {
    if (!report) return

    // Create an off-screen container for rendering the styled report HTML
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '800px'
    container.style.backgroundColor = '#ffffff'
    container.style.color = '#0f172a'
    container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    container.style.padding = '40px'
    container.style.boxSizing = 'border-box'
    container.style.zIndex = '-9999'

    const matchScore = typeof report.Score === 'number' ? report.Score : 75
    const fitCategory = matchScore < 40 ? 'Low Match' : matchScore < 70 ? 'Moderate Fit' : 'High Fit Match'
    const fitBg = matchScore < 40 ? '#fef2f2' : matchScore < 70 ? '#fffbeb' : '#ecfdf5'
    const fitBorder = matchScore < 40 ? '#fca5a5' : matchScore < 70 ? '#fde68a' : '#6ee7b7'
    const fitText = matchScore < 40 ? '#dc2626' : matchScore < 70 ? '#d97706' : '#059669'

    const dateStr = report.createdAt ? new Date(report.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : new Date().toLocaleDateString()

    const skillGaps = report.SkillGaps || []
    const prepPlan = report.PrepPlan || []
    const techQuestions = report.TechnicalQuestions || []
    const behQuestions = report.BehavioralQuestions || []

    // Build standard document template
    container.innerHTML = `
        <div style="width: 100%; box-sizing: border-box; background: #ffffff;">
            <!-- Document Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 22px; color: #dc2626;">⚡</span>
                        <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">AI RESUME ANALYZER</span>
                    </div>
                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Interview Evaluation & Readiness Report</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Generated Date</div>
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${dateStr}</div>
                </div>
            </div>

            <!-- Executive Summary Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 24px;">
                <div style="width: 90px; height: 90px; border-radius: 50%; background: ${fitBg}; border: 4px solid ${fitBorder}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="font-size: 26px; font-weight: 900; color: ${fitText}; line-height: 1;">${matchScore}%</span>
                    <span style="font-size: 10px; font-weight: 700; color: ${fitText}; text-transform: uppercase; margin-top: 2px;">Fit Score</span>
                </div>
                <div style="flex: 1;">
                    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: ${fitBg}; border: 1px solid ${fitBorder}; color: ${fitText}; font-size: 12px; font-weight: 800; margin-bottom: 8px; text-transform: uppercase;">
                        ${fitCategory}
                    </div>
                    <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 8px 0; color: #0f172a;">Candidate Evaluation Overview</h1>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #334155;">⚠️ ${skillGaps.length} Skill Gaps</span>
                        <span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #334155;">📅 ${prepPlan.length}-Day Plan</span>
                        <span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #334155;">💻 ${techQuestions.length} Tech Qs</span>
                        <span style="background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; color: #334155;">🗣️ ${behQuestions.length} Behavioral Qs</span>
                    </div>
                </div>
            </div>

            <!-- Job Description Context -->
            ${report.JD ? `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 6px;">Target Job Description Snippet</div>
                    <div style="font-size: 12px; color: #334155; line-height: 1.6; max-height: 90px; overflow: hidden; white-space: pre-wrap;">${report.JD.substring(0, 320)}${report.JD.length > 320 ? '...' : ''}</div>
                </div>
            ` : ''}

            <!-- 1. Skill Gaps Section -->
            <div style="margin-bottom: 24px;">
                <div style="border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
                    <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.03em;">1. Skill Gaps & Focus Areas (${skillGaps.length})</h2>
                </div>
                ${skillGaps.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${skillGaps.map(gap => {
                            const sevBg = gap.severity === 'high' ? '#fef2f2' : gap.severity === 'medium' ? '#fffbeb' : '#eff6ff'
                            const sevBorder = gap.severity === 'high' ? '#fca5a5' : gap.severity === 'medium' ? '#fde68a' : '#bfdbfe'
                            const sevText = gap.severity === 'high' ? '#dc2626' : gap.severity === 'medium' ? '#d97706' : '#2563eb'

                            return `
                                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${sevText}; border-radius: 6px; padding: 10px 14px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">${gap.skill}</span>
                                        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; background: ${sevBg}; border: 1px solid ${sevBorder}; color: ${sevText};">
                                            ${gap.severity || 'Medium'} Impact
                                        </span>
                                    </div>
                                    <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.4;">${gap.reason || 'Requirement identified in job description missing from profile.'}</p>
                                </div>
                            `
                        }).join('')}
                    </div>
                ` : `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; color: #64748b; font-size: 12px;">No critical skill gaps identified.</div>
                `}
            </div>

            <!-- 2. Preparation Plan Section -->
            <div style="margin-bottom: 24px;">
                <div style="border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
                    <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.03em;">2. Structured Preparation Plan (${prepPlan.length} Days)</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${prepPlan.map((dayPlan, idx) => {
                        let tasks = []
                        if (Array.isArray(dayPlan.task)) {
                            tasks = dayPlan.task.flatMap(t => typeof t === 'string' ? t.split(/\n|■/).filter(s => s.trim()) : [t])
                        } else if (typeof dayPlan.task === 'string') {
                            tasks = dayPlan.task.split(/\n|■/).filter(s => s.trim())
                        } else if (dayPlan.task) {
                            tasks = [dayPlan.task]
                        }
                        const cleanedTasks = tasks.map(t => typeof t === 'string' ? t.replace(/^[■\-\*\•\d\.\s]+/, '').trim() : String(t)).filter(Boolean)

                        return `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px;">
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <span style="background: #0f172a; color: #ffffff; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Day ${dayPlan.day || idx + 1}</span>
                                    <span style="font-size: 13px; font-weight: 800; color: #0f172a;">${dayPlan.focus}</span>
                                </div>
                                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 12px; line-height: 1.6;">
                                    ${cleanedTasks.map(task => `<li style="margin-bottom: 3px;">${task}</li>`).join('')}
                                </ul>
                            </div>
                        `
                    }).join('')}
                </div>
            </div>

            <!-- 3. Technical Questions -->
            <div style="margin-bottom: 24px;">
                <div style="border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
                    <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.03em;">3. Technical Interview Questions (${techQuestions.length})</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${techQuestions.map((q, idx) => {
                        const blueprints = Array.isArray(q.answer) ? q.answer : [q.answer]
                        return `
                            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
                                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #f3e8ff; border: 1px solid #d8b4fe; color: #6b21a8; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${q.relevance || 'Technical Core'}</span>
                                    <span style="font-size: 11px; font-weight: 700; color: #64748b;">Question #${idx + 1}</span>
                                </div>
                                <div style="font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 8px; line-height: 1.4;">${q.question}</div>
                                <div style="background: #f8fafc; border-left: 3px solid #7c3aed; border: 1px solid #e2e8f0; border-left-width: 3.5px; padding: 10px 12px; border-radius: 6px;">
                                    <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;">Answering Blueprint</div>
                                    <ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 12px; line-height: 1.5;">
                                        ${blueprints.map(bp => `<li style="margin-bottom: 3px;">${bp}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>
            </div>

            <!-- 4. Behavioral Questions -->
            <div style="margin-bottom: 24px;">
                <div style="border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">
                    <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.03em;">4. Behavioral Questions & STAR Guide (${behQuestions.length})</h2>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${behQuestions.map((q, idx) => {
                        const star = typeof q.answer === 'object' && q.answer !== null ? q.answer : {
                            situation: 'Key situation related to job role.',
                            task: 'Core task or goal to accomplish.',
                            action: q.answer || 'Action taken.',
                            result: 'Measurable positive result achieved.'
                        }

                        return `
                            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
                                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                                    <span style="background: #dbeafe; border: 1px solid #93c5fd; color: #1e40af; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${q.relevance || 'Behavioral'}</span>
                                    <span style="font-size: 11px; font-weight: 700; color: #64748b;">Question #${idx + 1}</span>
                                </div>
                                <div style="font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 10px; line-height: 1.4;">${q.question}</div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 2.5px solid #2563eb; padding: 8px 10px; border-radius: 6px;">
                                        <div style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase;">S - Situation</div>
                                        <p style="margin: 3px 0 0 0; font-size: 11.5px; color: #334155; line-height: 1.4;">${star.situation || 'Situation details'}</p>
                                    </div>
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 2.5px solid #059669; padding: 8px 10px; border-radius: 6px;">
                                        <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">T - Task</div>
                                        <p style="margin: 3px 0 0 0; font-size: 11.5px; color: #334155; line-height: 1.4;">${star.task || 'Task goal'}</p>
                                    </div>
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 2.5px solid #d97706; padding: 8px 10px; border-radius: 6px;">
                                        <div style="font-size: 10px; font-weight: 800; color: #d97706; text-transform: uppercase;">A - Action</div>
                                        <p style="margin: 3px 0 0 0; font-size: 11.5px; color: #334155; line-height: 1.4;">${star.action || 'Action taken'}</p>
                                    </div>
                                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 2.5px solid #db2777; padding: 8px 10px; border-radius: 6px;">
                                        <div style="font-size: 10px; font-weight: 800; color: #db2777; text-transform: uppercase;">R - Result</div>
                                        <p style="margin: 3px 0 0 0; font-size: 11.5px; color: #334155; line-height: 1.4;">${star.result || 'Outcome'}</p>
                                    </div>
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 28px; color: #94a3b8; font-size: 11px; font-weight: 500;">
                Generated by AI Resume Matcher & Interview Analyzer System • Confidential Candidate Report
            </div>
        </div>
    `

    document.body.appendChild(container)

    try {
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        })

        const imgData = canvas.toDataURL('image/png')

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * pdfWidth) / canvas.width

        let heightLeft = imgHeight
        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pdfHeight
        }

        const reportIdSuffix = report._id ? report._id.substring(0, 8) : 'report'
        pdf.save(`Interview_Report_${reportIdSuffix}.pdf`)
    } catch (err) {
        console.error('Error generating PDF:', err)
        throw err
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container)
        }
    }
}
