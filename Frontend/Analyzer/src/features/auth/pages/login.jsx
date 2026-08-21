import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useauth"

const Login = () => {
    const navigate = useNavigate()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const { loading, handleLogin } = useAuth()

    const handleFormSubmit = async (e) => {

        e.preventDefault()
        await handleLogin({ email, password })

        setemail("")
        setpassword("")
        navigate("/")

    }

    if (loading) {
        return (
            <main>
                <div className="min-h-screen flex items-center justify-center dark:bg-gray-400">
                    <div className="w-full max-w-md p-8">
                        <h1 className="mb-6 text-center text-3xl font-bold">Loading...</h1>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main>
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-400">
                <div className="w-full max-w-md p-8">

                    <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>

                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="email" className="block text-left font-medium">Email: </label>
                        <TextField
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth margin='normal'
                            required
                            name="email"
                            type="email"
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                            }}
                        />

                        <label htmlFor="password" className="block text-left font-medium">Password: </label>
                        <TextField
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            required
                            name="password"
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                            }}
                        />
                        <button className='bg-red-600 hover:bg-red-500 transition-all duration-200 cursor-pointer w-full py-2 rounded-xl text-white font-bold mt-4 shadow-md hover:shadow-xl hover:-translate-y-1' type='submit'>Login</button>
                    </form>

                    <p className="mt-6 text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to={"/register"}
                            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login