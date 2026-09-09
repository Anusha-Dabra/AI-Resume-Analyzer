import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useauth'
// import { generateInterviewReportApi } from '../services/interview.api.js'
import { useInterview } from "../hooks/useInterview.js"
import ReportHistory from '../components/ReportHistory.jsx'
import './home.css'

const Home = () => {
    const { loading, generateInterviewReport, allReports, getAllUserInterviewReports } = useInterview()
    const { user } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [historyLoading, setHistoryLoading] = useState(true)

    useEffect(() => {
        getAllUserInterviewReports()
            .catch(err => console.error("Error fetching reports history:", err))
            .finally(() => setHistoryLoading(false))
    }, [])

    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [validationError, setValidationError] = useState('')

    // File validation and handling
    const handleFileChange = (file) => {
        if (!file) return
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
            setValidationError('Please upload a PDF file for your resume.')
            return
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setValidationError('Resume file size must be less than 10MB.')
            return
        }
        setValidationError('')
        setResumeFile(file)
    }

    const handleGenerateReport = async () => {
        try {
            const response = await generateInterviewReport({ resume: resumeFile, JD: jobDescription, SD: selfDescription })
            console.log(response)
            // navigate(`/interview/${response.data.id}`)
        } catch (error) {
            console.error("Error generating report:", error)
        }
    }

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileChange(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileChange(file)
        }
    }

    const handleRemoveFile = () => {
        setResumeFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setValidationError('')

        if (!jobDescription.trim()) {
            setValidationError('Please enter or paste a job description.')
            return
        }

        if (!resumeFile) {
            setValidationError('Please upload your resume in PDF format.')
            return
        }

        setIsSubmitting(true)
        try {
            console.log('Submitting analysis request to backend...')
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            const targetReport = response?.report || response

            if (targetReport && targetReport._id) {
                navigate(`/interview/${targetReport._id}`, { state: { report: targetReport } })
            } else {
                setValidationError('Failed to generate report. Invalid server response.')
            }
        } catch (err) {
            console.error('Error generating report:', err)
            setValidationError(err.response?.data?.message || err.message || 'An error occurred while generating the report. Please check server logs.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    const getWordCount = (text) => {
        const trimmed = text.trim()
        return trimmed ? trimmed.split(/\s+/).length : 0
    }

    const isPending = isSubmitting || loading

    return (
        <div className="home-wrapper">
            {/* Header Navigation */}
            <header className="home-header">
                <div className="header-left">
                    <div className="brand-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="brand-name">AI Resume Matcher</span>
                    </div>
                </div>

                <div className="header-right">
                    {user && (
                        <div className="user-badge">
                            <div className="avatar-circle">
                                {(user.userName || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="user-name">{user.userName || user.email}</span>
                        </div>
                    )}
                    <Link to="/logout" className="logout-btn">
                        Logout
                    </Link>
                </div>
            </header>

            <main className="home-container">
                {/* Hero / Overview Banner */}
                <section className="hero-section">
                    <div className="hero-badge">Smart Interview Preparation</div>
                    <h1 className="hero-title">Optimize Your Resume for Any Job</h1>
                    <p className="hero-subtitle">
                        Paste the target job description, provide your profile details, and upload your resume PDF to receive an instant match score, skill gap analysis, and tailored interview questions.
                    </p>
                </section>

                {/* Main Form Area */}
                <form onSubmit={handleSubmit} className="analyzer-form">
                    {validationError && (
                        <div className="error-alert" role="alert">
                            <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{validationError}</span>
                        </div>
                    )}

                    <div className="form-grid">
                        {/* Left Column: Job Description */}
                        <div className="form-card job-card">
                            <div className="card-header">
                                <div className="header-title-group">
                                    <div className="icon-wrapper">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="card-title">Job Description</h2>
                                        <p className="card-hint">Paste the full job post with key responsibilities & requirements</p>
                                    </div>
                                </div>
                                <span className="counter-tag">
                                    {getWordCount(jobDescription)} words
                                </span>
                            </div>

                            <div className="card-body flex-1">
                                <textarea
                                    id="jobDescription"
                                    className="custom-textarea job-textarea"
                                    placeholder="Paste the target job description here... (e.g. Senior Frontend Engineer requirements, key skills, experience level)"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column: Resume & Self Description */}
                        <div className="right-column-stack">
                            {/* Upload Resume Card */}
                            <div className="form-card resume-card">
                                <div className="card-header">
                                    <div className="header-title-group">
                                        <div className="icon-wrapper">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="card-title">Upload Resume</h2>
                                            <p className="card-hint">Supported format: PDF (Max 10MB)</p>
                                        </div>
                                    </div>
                                    <span className="required-badge">Required</span>
                                </div>

                                <div className="card-body">
                                    <input
                                        type="file"
                                        id="resume"
                                        ref={fileInputRef}
                                        className="hidden-file-input"
                                        accept=".pdf"
                                        onChange={handleFileInputChange}
                                    />

                                    {!resumeFile ? (
                                        <div
                                            className={`dropzone ${isDragging ? 'dragging' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="dropzone-icon">
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <p className="dropzone-text">
                                                <span className="upload-link">Click to upload</span> or drag and drop your resume
                                            </p>
                                            <p className="dropzone-subtext">PDF files only (Up to 10MB)</p>
                                        </div>
                                    ) : (
                                        <div className="uploaded-file-card">
                                            <div className="file-info-group">
                                                <div className="file-icon">
                                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="file-details">
                                                    <span className="file-name">{resumeFile.name}</span>
                                                    <span className="file-size">{formatFileSize(resumeFile.size)}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={handleRemoveFile}
                                                title="Remove file"
                                            >
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Self Description Card */}
                            <div className="form-card self-card">
                                <div className="card-header">
                                    <div className="header-title-group">
                                        <div className="icon-wrapper">
                                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="card-title">Self Description</h2>
                                            <p className="card-hint">Optional context about career goals, strengths, or achievements</p>
                                        </div>
                                    </div>
                                    <span className="counter-tag">
                                        {getWordCount(selfDescription)} words
                                    </span>
                                </div>

                                <div className="card-body">
                                    <textarea
                                        id="selfDescription"
                                        className="custom-textarea self-textarea"
                                        placeholder="Enter additional background info, career summary, target roles, or specific skills you want highlighted..."
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Action Bar */}
                    <div className="action-bar">
                        <div className="feature-bullets">
                            <div className="bullet-item">
                                <span className="bullet-check">✓</span> Key Skill Match
                            </div>
                            <div className="bullet-item">
                                <span className="bullet-check">✓</span> Resume Gap Insights
                            </div>
                            <div className="bullet-item">
                                <span className="bullet-check">✓</span> Customized Q&A
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`generate-report-btn ${isPending ? 'loading' : ''}`}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Analyzing Profile & Job...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate AI Report</span>
                                    <svg className="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Saved Reports History */}
                <ReportHistory reports={allReports} loading={historyLoading} />
            </main>
        </div>
    )
}

export default Home
