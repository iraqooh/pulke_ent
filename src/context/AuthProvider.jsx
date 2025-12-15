import { useEffect, useState } from "react";
import { account } from "../api/appwrite";
import { AuthContext } from "./AuthContext";


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        account.get().then(setUser).catch(() => setUser(null))
    }, [])

    return (
        <AuthContext.AuthProvider value={{ user, setUser }}>
            {children}
        </AuthContext.AuthProvider>
    )
}