import React, { useState } from 'react'
import { Link } from 'react-router'
import { exportReportToPDF } from '../utils/pdfGenerator'
import { useInterview } from '../hooks/useInterview'
import './ReportHistory.css'

export default function ReportHistory({ reports = [], loading = false }) {
    const { deleteInterviewReport } = useInterview()
    const [downloadingId, setDownloadingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const handleDownloadPDF = async (report, e) => {
        e.preventDefault()
        e.stopPropagation()
        setDownloadingId(report._id)
        try {
            await exportReportToPDF(report)
        } catch (err) {
            console.error('Failed to download PDF:', err)
            alert('Failed to generate PDF. Please try again.')
        } finally {
            setDownloadingId(null)
        }
    }

    const handleDeleteReport = async (reportId, e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return
        }
        setDeletingId(reportId)
        try {
            await deleteInterviewReport(reportId)
        } catch (err) {
            console.error('Failed to delete report:', err)
            alert('Failed to delete report. Please try again.')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="report-history-section">
                <div className="history-header">
                    <div>
                        <h2 className="history-title">Your Reports History</h2>
                        <p className="history-subtitle">Loading your past generated evaluation reports...</p>
                    </div>
                </div>
                <div className="no-reports-box">
                    <div className="spinner mx-auto mb-2" style={{ margin: '0 auto' }}></div>
                    <span>Fetching saved reports...</span>
                </div>
            </div>
        )
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="report-history-section">
                <div className="history-header">
                    <div>
                        <h2 className="history-title">Your Saved Reports</h2>
                        <p className="history-subtitle">All your past generated interview evaluation reports will appear here</p>
                    </div>
                </div>
                <div className="no-reports-box">
                    <div className="no-reports-icon">📄</div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#d1d5db' }}>No reports generated yet</p>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>Upload your resume and a job description above to generate your first AI report.</p>
                </div>
            </div>
        )
    }

    return (
        <section className="report-history-section">
            <div className="history-header">
                <div className="history-title-group">
                    <span className="history-icon">📊</span>
                    <div>
                        <h2 className="history-title">Your Saved Reports</h2>
                        <p className="history-subtitle">Access, download, or delete your generated evaluation reports</p>
                    </div>
                </div>
                <span className="reports-count-pill">{reports.length} Reports Saved</span>
            </div>

            <div className="reports-grid">
                {reports.map((rep) => {
                    const matchScore = typeof rep.Score === 'number' ? rep.Score : 75
                    const scoreClass = matchScore < 40 ? 'score-low' : matchScore < 70 ? 'score-medium' : 'score-high'
                    const isDownloading = downloadingId === rep._id
                    const isDeleting = deletingId === rep._id
                    const dateFormatted = rep.createdAt ? new Date(rep.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                    }) : 'Recent'

                    return (
                        <div key={rep._id} className="report-card">
                            <div className="card-top">
                                <div className="card-score-row">
                                    <div className={`score-badge-mini ${scoreClass}`}>
                                        <span>⚡</span>
                                        <span>{matchScore}% Score</span>
                                    </div>
                                    <span className="report-date">{dateFormatted}</span>
                                </div>

                                <div className="card-jd-snippet">
                                    {rep.JD ? rep.JD : 'Job Description Analysis'}
                                </div>

                                <div className="card-stats-chips">
                                    <span className="stat-chip">⚠️ {rep.SkillGaps?.length || 0} Skill Gaps</span>
                                    <span className="stat-chip">📅 {rep.PrepPlan?.length || 0}-Day Plan</span>
                                    <span className="stat-chip">💻 {rep.TechnicalQuestions?.length || 0} Tech Qs</span>
                                </div>
                            </div>

                            <div className="card-actions">
                                <Link to={`/interview/${rep._id}`} state={{ report: rep }} className="view-btn">
                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                </Link>

                                <button
                                    type="button"
                                    className="download-pdf-btn"
                                    onClick={(e) => handleDownloadPDF(rep, e)}
                                    disabled={isDownloading || isDeleting}
                                    title="Download PDF report"
                                >
                                    {isDownloading ? (
                                        <>
                                            <span className="spinner" style={{ width: '12px', height: '12px' }}></span>
                                            <span>PDF...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <span>PDF</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="delete-report-btn"
                                    onClick={(e) => handleDeleteReport(rep._id, e)}
                                    disabled={isDeleting || isDownloading}
                                    title="Delete report from database"
                                >
                                    {isDeleting ? (
                                        <span className="spinner" style={{ width: '12px', height: '12px' }}></span>
                                    ) : (
                                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
