import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('gymtrack_token')
    const saved = localStorage.getItem('gymtrack_user')
    if (token && saved) {
      setUser(JSON.parse(saved))
      // Verify token still valid
      authService.getMe()
        .then(res => setUser(res.data.data))
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authService.login({ email, password })
    const { user, token } = res.data.data
    localStorage.setItem('gymtrack_token', token)
    localStorage.setItem('gymtrack_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (formData) => {
    const res = await authService.register(formData)
    const { user, token } = res.data.data
    localStorage.setItem('gymtrack_token', token)
    localStorage.setItem('gymtrack_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('gymtrack_token')
    localStorage.removeItem('gymtrack_user')
    setUser(null)
  }

  const updateUser = (updated) => {
    const merged = { ...user, ...updated }
    localStorage.setItem('gymtrack_user', JSON.stringify(merged))
    setUser(merged)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
