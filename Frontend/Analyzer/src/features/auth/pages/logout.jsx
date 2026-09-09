import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useauth'
import './logout.css'

const Logout = () => {
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const onConfirmLogout = async () => {
        setIsLoggingOut(true)
        try {
            await handleLogout()
            navigate('/login')
        } catch (err) {
            console.error('Error logging out:', err)
            setIsLoggingOut(false)
        }
    }

    const userDisplayName = user?.userName || user?.email || 'User'
    const initial = userDisplayName[0].toUpperCase()

    return (
        <div className="logout-wrapper">
            {/* Header Navigation */}
            <header className="logout-header">
                <div className="brand-logo">
                    <span className="logo-icon">⚡</span>
                    <span className="brand-name">AI Resume Matcher</span>
                </div>
                <Link to="/" className="back-link">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Dashboard</span>
                </Link>
            </header>

            {/* Logout Card Container */}
            <main className="logout-container">
                <div className="logout-card">
                    <div className="logout-icon-wrapper">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>

                    <h1 className="logout-title">Sign Out</h1>
                    <p className="logout-subtitle">Are you sure you want to end your current session and sign out of AI Resume Matcher?</p>

                    {user && (
                        <div className="user-info-box">
                            <div className="user-avatar">{initial}</div>
                            <span className="user-email-text">{userDisplayName}</span>
                        </div>
                    )}

                    <div className="logout-actions">
                        <button
                            type="button"
                            className="confirm-logout-btn"
                            onClick={onConfirmLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                                    <span>Signing out...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm Logout</span>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <Link to="/" className="cancel-btn">
                            Cancel & Return to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Logout