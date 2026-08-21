import React from "react"

import TextField from '@mui/material/TextField'

const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted");
}
const Logout = () => {
    return (
        <main>
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-400">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h1 className="mb-6 text-center text-3xl font-bold">Logout</h1>
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="email">Email: </label>
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth margin='normal'
                            required
                        />
                        <label htmlFor="password">Password: </label>
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            margin='normal'
                            required
                        />
                        <button className='bg-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer w-full py-2 rounded-xl text-white font-bold mt-4 shadow-md hover:shadow-xl hover:-translate-y-1' type='submit'>Logout</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Logout