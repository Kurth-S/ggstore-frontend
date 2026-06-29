import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (tokenGuardado && usuarioGuardado) {
      setToken(tokenGuardado)
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify({
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
    }))
    setToken(data.token)
    setUsuario({ nombre: data.nombre, email: data.email, rol: data.rol })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  const esAdmin = usuario?.rol === 'ADMIN'
  const estaAutenticado = !!token

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, esAdmin, estaAutenticado, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}