import axios from "axios"
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({ userName, email, password }) {

    try {
        const response = await api.post("/api/auth/register",
            {
                userName,
                email,
                password
            })

        return response.data
    } catch (error) {
        console.error("Error: ", error)

        throw error
    }

}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login",
            {
                email,
                password
            })

        return response.data
    } catch (error) {
        console.error("Error: ", error)

        throw error
    }

}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")

        return response.data
    } catch (error) {
        console.error("Error: ", error)

        throw error
    }

}


export async function profile() {
    try {
        const Response = await api.get("/api/auth/profile")
        return Response.data

    } catch (error) {
        console.error("Error: ", error)
    }

}