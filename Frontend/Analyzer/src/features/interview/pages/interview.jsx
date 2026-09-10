import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { getInterviewReportByIdApi } from '../services/interview.api'
import { exportReportToPDF } from '../utils/pdfGenerator'
import { useInterview } from '../hooks/useInterview'
import './interview.css'

export default function Interview() {
    const { interviewId } = useParams()
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const { deleteInterviewReport } = useInterview()

    const [report, setReport] = useState(location.state?.report || null)
    const [loading, setLoading] = useState(!location.state?.report)
    const [fetchError, setFetchError] = useState('')

    const [activeTab, setActiveTab] = useState('all') // 'all' | 'skills' | 'prep' | 'technical' | 'behavioral'
    const [searchQuery, setSearchQuery] = useState('')
    const [skillFilter, setSkillFilter] = useState('all') // 'all' | 'matched' | 'gaps'
    const [expandedQuestions, setExpandedQuestions] = useState({})
    const [practicedQuestions, setPracticedQuestions] = useState({})
    const [completedPrepTasks, setCompletedPrepTasks] = useState({})
    const [copiedId, setCopiedId] = useState(null)

    // Dynamic AI Generation states
    const [isGeneratingTech, setIsGeneratingTech] = useState(false)
    const [isGeneratingBeh, setIsGeneratingBeh] = useState(false)
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
    const [isDeletingPdf, setIsDeletingPdf] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    // Fetch report by ID if not available in location state
    useEffect(() => {
        if (!report && interviewId) {
            setLoading(true)
            getInterviewReportByIdApi(interviewId)
                .then(data => {
                    if (data && data.report) {
                        setReport(data.report)
                    } else {
                        setFetchError('Report not found.')
                    }
                })
                .catch(err => {
                    console.error('Error fetching report:', err)
                    setFetchError('Failed to load report from server.')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [interviewId, report])

    // Dynamic questions state initialized from backend report
    const [techQuestions, setTechQuestions] = useState([])
    const [behQuestions, setBehQuestions] = useState([])

    useEffect(() => {
        if (report) {
            if (report.TechnicalQuestions && report.TechnicalQuestions.length > 0) {
                const formattedTech = report.TechnicalQuestions.map((q, idx) => ({
                    id: `tech-${idx}`,
                    category: q.relevance || 'Technical Core',
                    difficulty: 'Medium',
                    question: q.question,
                    blueprint: Array.isArray(q.answer) ? q.answer : [q.answer]
                }))
                setTechQuestions(formattedTech)
                if (formattedTech[0]) {
                    setExpandedQuestions(prev => ({ ...prev, [formattedTech[0].id]: true }))
                }
            }

            if (report.BehavioralQuestions && report.BehavioralQuestions.length > 0) {
                const formattedBeh = report.BehavioralQuestions.map((q, idx) => ({
                    id: `beh-${idx}`,
                    category: q.relevance || 'Behavioral',
                    targetCompetency: 'Scenario Analysis',
                    question: q.question,
                    starGuide: typeof q.answer === 'object' && q.answer !== null ? q.answer : {
                        situation: 'Key situation related to job requirement.',
                        task: 'Core objective to be accomplished.',
                        action: q.answer || 'Specific action taken to resolve.',
                        result: 'Positive outcome achieved.'
                    }
                }))
                setBehQuestions(formattedBeh)
                if (formattedBeh[0]) {
                    setExpandedQuestions(prev => ({ ...prev, [formattedBeh[0].id]: true }))
                }
            }
        }
    }, [report])

    // Extra questions for practice generator
    const extraTechPool = [
        {
            category: 'System Architecture',
            difficulty: 'Hard',
            question: 'How do you design a scalable state management and data caching architecture for high-concurrency requests?',
            blueprint: ['Implement centralized state store with slice selectors.', 'Use query caching with automatic revalidation (e.g. RTK Query or TanStack Query).', 'Isolate UI components from API state side-effects.']
        },
        {
            category: 'Performance Optimization',
            difficulty: 'Medium',
            question: 'What techniques do you use to diagnose and fix web application performance bottlenecks?',
            blueprint: ['Audit Core Web Vitals (LCP, INP, CLS) using Lighthouse.', 'Analyze memory heap snapshots and re-render cycles using browser Profiler.', 'Apply code splitting and lazy loading on heavy routes.']
        }
    ]

    const extraBehPool = [
        {
            category: 'Conflict & Resolution',
            targetCompetency: 'Communication & Problem Solving',
            question: 'Describe a situation where you had to push back against unreasonable project requirements or tight deadlines.',
            starGuide: {
                situation: 'Stakeholder requested 3 complex features 2 days before release.',
                task: 'Protect product quality while maintaining deadline alignment.',
                action: 'Presented data-backed effort estimation and proposed a phased rollout plan.',
                result: 'Delivered core MVP on schedule with secondary features released in sprint 2.'
            }
        }
    ]

    const handleGenerateMoreTech = async () => {
        setIsGeneratingTech(true)
        await new Promise(resolve => setTimeout(resolve, 1200))

        const nextIndex = techQuestions.length
        const extra = extraTechPool[nextIndex % extraTechPool.length]

        const newQ = {
            id: `tech-extra-${Date.now()}`,
            ...extra,
            isAiGenerated: true
        }

        setTechQuestions(prev => [...prev, newQ])
        setExpandedQuestions(prev => ({ ...prev, [newQ.id]: true }))
        setIsGeneratingTech(false)
        showToast('✨ Generated 1 new tailored technical question!')
    }

    const handleGenerateMoreBeh = async () => {
        setIsGeneratingBeh(true)
        await new Promise(resolve => setTimeout(resolve, 1200))

        const nextIndex = behQuestions.length
        const extra = extraBehPool[nextIndex % extraBehPool.length]

        const newQ = {
            id: `beh-extra-${Date.now()}`,
            ...extra,
            isAiGenerated: true
        }

        setBehQuestions(prev => [...prev, newQ])
        setExpandedQuestions(prev => ({ ...prev, [newQ.id]: true }))
        setIsGeneratingBeh(false)
        showToast('✨ Generated 1 new behavioral question!')
    }

    const handleDownloadPdf = async () => {
        if (!report) return
        setIsDownloadingPdf(true)
        try {
            await exportReportToPDF(report)
            showToast('📄 Report PDF downloaded successfully!')
        } catch (err) {
            console.error('Error generating PDF:', err)
            showToast('❌ Failed to generate PDF. Please try again.')
        } finally {
            setIsDownloadingPdf(false)
        }
    }

    const handleDeleteReport = async () => {
        if (!report || !report._id) return
        if (!window.confirm('Are you sure you want to delete this evaluation report from database?')) return
        setIsDeletingPdf(true)
        try {
            await deleteInterviewReport(report._id)
            navigate('/')
        } catch (err) {
            console.error('Error deleting report:', err)
            showToast('❌ Failed to delete report.')
            setIsDeletingPdf(false)
        }
    }

    const showToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(''), 3000)
    }

    const toggleExpand = (id) => {
        setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const togglePracticed = (id) => {
        setPracticedQuestions(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const togglePrepTask = (taskId) => {
        setCompletedPrepTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))
    }

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (loading) {
        return (
            <div className="interview-wrapper flex items-center justify-center min-h-screen">
                <div className="text-center p-8">
                    <div className="spinner mx-auto mb-4" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
                    <h2 className="text-xl font-bold text-gray-200">Loading AI Interview Report...</h2>
                </div>
            </div>
        )
    }

    if (fetchError || !report) {
        return (
            <div className="interview-wrapper flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-[#1f2028] border border-[#2e303a] rounded-2xl max-w-md">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Report Error</h2>
                    <p className="text-gray-400 mb-6">{fetchError || 'Unable to load report.'}</p>
                    <Link to="/" className="back-link inline-flex">Back to Home</Link>
                </div>
            </div>
        )
    }

    const matchScore = typeof report.Score === 'number' ? report.Score : 75
    const skillGapsList = report.SkillGaps || []
    const prepPlanList = report.PrepPlan || []

    const filteredTechQuestions = techQuestions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch && (activeTab === 'all' || activeTab === 'technical')
    })

    const filteredBehQuestions = behQuestions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch && (activeTab === 'all' || activeTab === 'behavioral')
    })

    const totalQuestionsCount = techQuestions.length + behQuestions.length
    const practicedCount = Object.values(practicedQuestions).filter(Boolean).length

    const totalPrepTasksCount = prepPlanList.reduce((acc, curr) => acc + (Array.isArray(curr.task) ? curr.task.length : 1), 0)
    const completedPrepCount = Object.values(completedPrepTasks).filter(Boolean).length
    const prepPercentage = totalPrepTasksCount > 0 ? Math.round((completedPrepCount / totalPrepTasksCount) * 100) : 0

    return (
        <div className="interview-wrapper">
            {toastMessage && (
                <div className="toast-notification">
                    <span>{toastMessage}</span>
                </div>
            )}

            <header className="interview-header">
                <div className="header-left">
                    <Link to="/" className="back-link">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back</span>
                    </Link>
                    <div className="brand-divider"></div>
                    <div className="brand-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="brand-name">Match Report</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="practice-progress-pill">
                        <span className="progress-dot"></span>
                        <span>{practicedCount} of {totalQuestionsCount} Practiced</span>
                    </div>

                    <button
                        type="button"
                        className="header-download-pdf-btn"
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf || isDeletingPdf}
                        title="Download Report as PDF"
                    >
                        {isDownloadingPdf ? (
                            <>
                                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="header-delete-pdf-btn"
                        onClick={handleDeleteReport}
                        disabled={isDeletingPdf || isDownloadingPdf}
                        title="Delete Report from Database"
                    >
                        {isDeletingPdf ? (
                            <>
                                <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            <main className="interview-container">
                <section className="overview-card">
                    <div className="overview-main">
                        <div className="score-ring-container">
                            <div className="score-ring">
                                <svg className="ring-svg" viewBox="0 0 100 100">
                                    <circle className="ring-bg" cx="50" cy="50" r="42" />
                                    <circle
                                        className="ring-progress"
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        style={{
                                            strokeDashoffset: 264 - (264 * matchScore) / 100,
                                            stroke: matchScore < 40 ? '#ef4444' : matchScore < 70 ? '#f59e0b' : '#10b981'
                                        }}
                                    />
                                </svg>
                                <div className="score-content">
                                    <span className="score-value">{matchScore}%</span>
                                    <span className="score-label">Fit Score</span>
                                </div>
                            </div>
                        </div>

                        <div className="overview-details">
                            <div className="role-badge">
                                {matchScore < 40 ? 'Low Match' : matchScore < 70 ? 'Moderate Fit' : 'High Fit Match'}
                            </div>
                            <h1 className="role-title">Candidate Evaluation Report</h1>
                            <p className="company-info">Generated on {new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>

                            <div className="meta-pills">
                                <span className="meta-pill">
                                    <span className="pill-icon">⚠️</span> {skillGapsList.length} Skill Gaps Identified
                                </span>
                                <span className="meta-pill prep-pill">
                                    <span className="pill-icon">📅</span> {prepPlanList.length}-Day Action Plan
                                </span>
                                <span className="meta-pill">
                                    <span className="pill-icon">💻</span> {techQuestions.length} Tech Questions
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="controls-bar">
                    <div className="tabs-group">
                        <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Insights</button>
                        <button className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skill Gaps ({skillGapsList.length})</button>
                        <button className={`tab-btn ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>Preparation Plan ({prepPlanList.length} Days)</button>
                        <button className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`} onClick={() => setActiveTab('technical')}>Technical Questions ({techQuestions.length})</button>
                        <button className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`} onClick={() => setActiveTab('behavioral')}>Behavioral Questions ({behQuestions.length})</button>
                    </div>

                    <div className="search-input-wrapper">
                        <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Filter insights..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>}
                    </div>
                </div>

                {(activeTab === 'all' || activeTab === 'skills') && (
                    <section className="section-block">
                        <div className="section-header">
                            <div className="section-title-group">
                                <span className="section-icon">🏷️</span>
                                <div>
                                    <h2 className="section-title">Skill Gaps & Focus Areas</h2>
                                    <p className="section-subtitle">Identified missing skills & key requirements for the target role</p>
                                </div>
                            </div>
                        </div>

                        <div className="skills-grid">
                            <div className="skills-column gaps-column flex-2">
                                <div className="column-header">
                                    <span className="column-icon amber-icon">⚠️</span>
                                    <h3>Skill Gaps Identified ({skillGapsList.length})</h3>
                                </div>
                                <div className="gaps-list">
                                    {skillGapsList.length > 0 ? (
                                        skillGapsList.map((gap, index) => (
                                            <div key={index} className="gap-card">
                                                <div className="gap-card-header">
                                                    <span className="gap-title">{gap.skill}</span>
                                                    <span className={`impact-badge impact-${(gap.severity || 'medium').toLowerCase()}`}>
                                                        {gap.severity || 'Medium'} Gap
                                                    </span>
                                                </div>
                                                <p className="gap-desc">{gap.reason || 'Missing requirement identified in job description.'}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No major skill gaps identified for this profile!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {(activeTab === 'all' || activeTab === 'prep') && (
                    <section className="section-block">
                        <div className="section-header">
                            <div className="section-title-group">
                                <span className="section-icon">📅</span>
                                <div>
                                    <h2 className="section-title">Structured Preparation Plan</h2>
                                    <p className="section-subtitle">Actionable day-by-day roadmap generated by AI for interview success</p>
                                </div>
                            </div>

                            <div className="prep-progress-badge">
                                <span>{prepPercentage}% Completed</span>
                                <div className="prep-bar-outer">
                                    <div className="prep-bar-inner" style={{ width: `${prepPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="prep-plan-grid">
                            {prepPlanList.map((planItem, idx) => {
                                // Extract and clean task items from string/array with bullet points
                                let rawTasks = []
                                if (Array.isArray(planItem.task)) {
                                    rawTasks = planItem.task.flatMap(t =>
                                        typeof t === 'string' ? t.split(/\n|■/).filter(s => s.trim()) : [t]
                                    )
                                } else if (typeof planItem.task === 'string') {
                                    rawTasks = planItem.task.split(/\n|■/).filter(s => s.trim())
                                } else if (planItem.task) {
                                    rawTasks = [planItem.task]
                                }

                                const cleanedTasks = rawTasks.map(t =>
                                    typeof t === 'string' ? t.replace(/^[■\-\*\•\d\.\s]+/, '').trim() : String(t)
                                ).filter(Boolean)

                                return (
                                    <div key={idx} className="prep-day-card">
                                        <div className="prep-day-header">
                                            <span className="day-number-badge">Day {planItem.day || idx + 1}</span>
                                            <h3 className="prep-focus-title">{planItem.focus}</h3>
                                        </div>

                                        <ul className="prep-tasks-list">
                                            {cleanedTasks.map((taskText, taskIdx) => {
                                                const taskId = `day-${planItem.day || idx + 1}-task-${taskIdx}`
                                                const isDone = !!completedPrepTasks[taskId]
                                                return (
                                                    <li key={taskId} className={`prep-task-item ${isDone ? 'done' : ''}`}>
                                                        <label className="task-checkbox-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={isDone}
                                                                onChange={() => togglePrepTask(taskId)}
                                                                className="task-checkbox"
                                                            />
                                                            <span className="task-text">{taskText}</span>
                                                        </label>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>

                    </section>
                )}

                {(activeTab === 'all' || activeTab === 'technical') && (
                    <section className="section-block">
                        <div className="section-header">
                            <div className="section-title-group">
                                <span className="section-icon">💻</span>
                                <div>
                                    <h2 className="section-title">Technical Interview Questions</h2>
                                    <p className="section-subtitle">Tailored technical questions with key answering blueprints</p>
                                </div>
                            </div>

                            <button type="button" className="practice-more-btn" onClick={handleGenerateMoreTech} disabled={isGeneratingTech}>
                                {isGeneratingTech ? 'Generating...' : '✨ Practice More'}
                            </button>
                        </div>

                        <div className="questions-list">
                            {filteredTechQuestions.map((q) => {
                                const isExpanded = !!expandedQuestions[q.id]
                                const isPracticed = !!practicedQuestions[q.id]
                                return (
                                    <div key={q.id} className={`question-card ${isPracticed ? 'practiced' : ''}`}>
                                        <div className="q-card-header" onClick={() => toggleExpand(q.id)}>
                                            <div className="q-title-group">
                                                <button type="button" className={`check-btn ${isPracticed ? 'checked' : ''}`} onClick={(e) => { e.stopPropagation(); togglePracticed(q.id); }}>{isPracticed ? '✓' : ''}</button>
                                                <div className="q-text-meta">
                                                    <div className="q-tags-row"><span className="cat-tag purple-tag">{q.category}</span></div>
                                                    <h3 className="q-title">{q.question}</h3>
                                                </div>
                                            </div>
                                            <span className={`expand-chevron ${isExpanded ? 'open' : ''}`}>▼</span>
                                        </div>
                                        {isExpanded && (
                                            <div className="q-card-body">
                                                <div className="blueprint-box">
                                                    <ul className="blueprint-list">{q.blueprint.map((p, idx) => <li key={idx}>{p}</li>)}</ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {(activeTab === 'all' || activeTab === 'behavioral') && (
                    <section className="section-block">
                        <div className="section-header">
                            <div className="section-title-group">
                                <span className="section-icon">🗣️</span>
                                <div>
                                    <h2 className="section-title">Behavioral Questions</h2>
                                    <p className="section-subtitle">Structured answers using the STAR Method</p>
                                </div>
                            </div>
                            <button type="button" className="practice-more-btn beh-more-btn" onClick={handleGenerateMoreBeh} disabled={isGeneratingBeh}>
                                {isGeneratingBeh ? 'Generating...' : '✨ Practice More'}
                            </button>
                        </div>

                        <div className="questions-list">
                            {filteredBehQuestions.map((q) => {
                                const isExpanded = !!expandedQuestions[q.id]
                                const isPracticed = !!practicedQuestions[q.id]
                                return (
                                    <div key={q.id} className={`question-card ${isPracticed ? 'practiced' : ''}`}>
                                        <div className="q-card-header" onClick={() => toggleExpand(q.id)}>
                                            <div className="q-title-group">
                                                <button type="button" className={`check-btn ${isPracticed ? 'checked' : ''}`} onClick={(e) => { e.stopPropagation(); togglePracticed(q.id); }}>{isPracticed ? '✓' : ''}</button>
                                                <div className="q-text-meta">
                                                    <div className="q-tags-row"><span className="cat-tag blue-tag">{q.category}</span></div>
                                                    <h3 className="q-title">{q.question}</h3>
                                                </div>
                                            </div>
                                            <span className={`expand-chevron ${isExpanded ? 'open' : ''}`}>▼</span>
                                        </div>
                                        {isExpanded && (
                                            <div className="q-card-body">
                                                <div className="star-container">
                                                    <div className="star-grid">
                                                        <div className="star-box star-s"><div className="star-badge">S - Situation</div><p>{q.starGuide.situation || 'Situation details.'}</p></div>
                                                        <div className="star-box star-t"><div className="star-badge">T - Task</div><p>{q.starGuide.task || 'Task goal.'}</p></div>
                                                        <div className="star-box star-a"><div className="star-badge">A - Action</div><p>{q.starGuide.action || 'Action taken.'}</p></div>
                                                        <div className="star-box star-r"><div className="star-badge">R - Result</div><p>{q.starGuide.result || 'Result achieved.'}</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}