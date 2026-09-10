import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import './logout.css'

const textFieldStyles = {
    backgroundColor: '#16171d',
    borderRadius: '0.6rem',
    input: { color: '#f3f4f6' },
    label: { color: '#9ca3af' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#2e303a' },
        '&:hover fieldset': { borderColor: '#ef4444' },
        '&.Mui-focused fieldset': { borderColor: '#ef4444' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ef4444' }
}

const Login = () => {
    const navigate = useNavigate()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const { loading, handleLogin } = useAuth()
    const [errorMsg, setErrorMsg] = useState('')

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        try {
            await handleLogin({ email, password })
            setemail('')
            setpassword('')
            navigate('/')
        } catch (err) {
            console.error('Login error:', err)
            setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password.')
        }
    }

    if (loading) {
        return (
            <div className="logout-wrapper">
                <header className="logout-header">
                    <div className="brand-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="brand-name">AI Resume Matcher</span>
                    </div>
                </header>
                <div className="logout-container">
                    <div className="logout-card">
                        <div className="spinner mx-auto mb-3" style={{ width: '32px', height: '32px', margin: '0 auto' }}></div>
                        <h2 className="logout-title">Authenticating...</h2>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="logout-wrapper">
            <header className="logout-header">
                <div className="brand-logo">
                    <span className="logo-icon">⚡</span>
                    <span className="brand-name">AI Resume Matcher</span>
                </div>
            </header>

            <main className="logout-container">
                <div className="logout-card">
                    <div className="logout-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>

                    <h1 className="logout-title">Welcome Back</h1>
                    <p className="logout-subtitle">Log in to analyze resumes, track skill gaps, and access saved reports</p>

                    {errorMsg && (
                        <div className="error-alert mb-4" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div>
                            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Email Address</label>
                            <TextField
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                id="email"
                                placeholder="name@example.com"
                                variant="outlined"
                                fullWidth
                                required
                                name="email"
                                type="email"
                                sx={textFieldStyles}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Password</label>
                            <TextField
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                id="password"
                                placeholder="••••••••"
                                variant="outlined"
                                type="password"
                                fullWidth
                                required
                                name="password"
                                sx={textFieldStyles}
                            />
                        </div>

                        <button className="confirm-logout-btn" type="submit" style={{ marginTop: '0.5rem' }}>
                            <span>Log In</span>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#ef4444', fontWeight: 700, textDecoration: 'none' }}>
                            Create an Account
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Login