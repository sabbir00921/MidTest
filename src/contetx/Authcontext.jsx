import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { createContext, useEffect, useState } from 'react'

// Create the AuthContext
export const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => {},
  loading: true
})

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, user => {
      setAuthUser(user || null)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
