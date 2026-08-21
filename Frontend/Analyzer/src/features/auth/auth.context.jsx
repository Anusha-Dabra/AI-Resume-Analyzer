import { createContext, useState, useEffect } from "react"
import { profile } from "./services/auth.api"


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loaduser() {
            try {
                const data = await profile()//depends on token, it will remain 
                setUser(data.user)
            }
            catch (error) {
                console.error("Error: ", error)
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