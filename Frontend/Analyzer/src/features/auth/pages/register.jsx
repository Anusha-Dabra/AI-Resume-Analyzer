import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import TextField from '@mui/material/TextField'
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

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [userName, setuserName] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        try {
            await handleRegister({ userName, email, password })
            setuserName('')
            setemail('')
            setpassword('')
            navigate('/')
        } catch (err) {
            console.error('Registration error:', err)
            setErrorMsg(err.response?.data?.message || err.message || 'Failed to create account.')
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
                        <h2 className="logout-title">Creating Account...</h2>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>

                    <h1 className="logout-title">Create Account</h1>
                    <p className="logout-subtitle">Join AI Resume Matcher to evaluate job matches & practice tailored interview questions</p>

                    {errorMsg && (
                        <div className="error-alert mb-4" style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <div>
                            <label htmlFor="userName" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '4px', display: 'block' }}>Username</label>
                            <TextField
                                value={userName}
                                onChange={(e) => setuserName(e.target.value)}
                                id="userName"
                                placeholder="johndoe"
                                variant="outlined"
                                fullWidth
                                required
                                name="userName"
                                sx={textFieldStyles}
                            />
                        </div>

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
                            <span>Register Account</span>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#ef4444', fontWeight: 700, textDecoration: 'none' }}>
                            Log In
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Register