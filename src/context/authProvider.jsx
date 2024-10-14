import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { createContext, useEffect, useState } from "react"
import { auth } from "../services/firebase"
import PropTypes from "prop-types"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    function signWithGoogle () {
        const provider = new GoogleAuthProvider()
        return signInWithPopup(auth, provider)
    }

    function logOut() {
        return signOut(auth)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
            } else {
                setUser(null)
            }

            setIsLoading(false)
        })
    }, [])
    
    return (
        <AuthContext.Provider value={{user, isLoading, signWithGoogle, logOut}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

