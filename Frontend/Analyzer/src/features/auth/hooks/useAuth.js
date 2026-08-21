import { useContext } from "react"
import { AuthContext } from "../auth.context.jsx"
import { login, logout, register } from "../services/auth.api"


export const useAuth = () => {

    const context = useContext(AuthContext)

    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
        }
        catch (error) {
            console.error("Error: ", error)

            throw error
        }
        finally {
            setLoading(false)
        }

    }

    const handleRegister = async ({ userName, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ userName, email, password })
            setUser(data.user)
        }
        catch (error) {
            console.error("Error: ", error)

            throw error
        }
        finally {
            setLoading(false)
        }

    }


    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null) // 
        }
        catch (error) {
            console.error("Error: ", error)

            throw error
        }
        finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout
    }
}