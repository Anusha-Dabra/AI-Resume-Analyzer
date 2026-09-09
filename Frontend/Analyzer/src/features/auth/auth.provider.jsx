import { useState, useEffect } from "react"
import { profile } from "./services/auth.api"
import { AuthContext } from "./auth.context.jsx"

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loaduser() {
            try {
                const data = await profile()
                if (data && data.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            }
            catch (error) {
                console.error("Error loading user profile: ", error)
                setUser(null)
            }
            finally {
                setLoading(false)
            }
        }
        loaduser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}