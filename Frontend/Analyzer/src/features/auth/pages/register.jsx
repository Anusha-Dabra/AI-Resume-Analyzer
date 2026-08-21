import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { TextField } from "@mui/material"
import { useAuth } from "../hooks/useauth"


const Register = () => {
    const navigate = useNavigate()

    const { loading, handleRegister } = useAuth()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [userName, setuserName] = useState("")

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({ userName, email, password })
        setuserName("")
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
                <div className="w-full max-w-md rounded-2xl p-8">
                    <h1 className="mb-6 text-center text-3xl font-bold">Register</h1>

                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="userName" className="block text-left font-medium">Username: </label>
                        <TextField
                            value={userName}
                            onChange={(e) => {
                                setuserName(e.target.value)
                            }}
                            id="userName"
                            label="Username"
                            variant="outlined"
                            fullWidth margin='normal'
                            name="userName"
                            required
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                            }}
                        />
                        <label htmlFor="email" className="block text-left font-medium">Email: </label>
                        <TextField
                            value={email}
                            onChange={(e) => {
                                setemail(e.target.value)
                            }}
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth margin='normal'
                            name="email"
                            required
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                            }}
                        />
                        <label htmlFor="password" className="block text-left font-medium">Password: </label>
                        <TextField
                            value={password}
                            onChange={(e) => {
                                setpassword(e.target.value)
                            }}
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            margin='normal'
                            name="password"
                            required
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                            }}

                        />
                        <button className='bg-red-600 hover:bg-red-500 transition-all duration-200 cursor-pointer w-full py-2 rounded-xl text-white font-bold mt-4 shadow-md hover:shadow-xl hover:-translate-y-1' type='submit'>Register</button>

                        <p className="mt-6 text-center text-gray-500">
                            Already have an account?{" "}
                            <Link
                                to={"/login"}
                                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Register