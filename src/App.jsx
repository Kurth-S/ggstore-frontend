import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Páginas (las crearemos a continuación)
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Catalogo from './pages/catalog/Catalogo'
import Carrito from './pages/cart/Carrito'
import Biblioteca from './pages/library/Biblioteca'
import Wishlist from './pages/wishlist/Wishlist'
import AdminDashboard from './pages/admin/AdminDashboard'

// Layouts
import Navbar from './components/layout/Navbar'

// Ruta protegida para usuarios autenticados
function RutaProtegida({ children }) {
  const { estaAutenticado, cargando } = useAuth()
  if (cargando) return <div className="flex justify-center items-center h-screen">Cargando...</div>
  return estaAutenticado ? children : <Navigate to="/login" />
}

// Ruta protegida solo para admins
function RutaAdmin({ children }) {
  const { esAdmin, cargando } = useAuth()
  if (cargando) return <div className="flex justify-center items-center h-screen">Cargando...</div>
  return esAdmin ? children : <Navigate to="/" />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Catalogo />} />
        <Route path="/carrito" element={<RutaProtegida><Carrito /></RutaProtegida>} />
        <Route path="/biblioteca" element={<RutaProtegida><Biblioteca /></RutaProtegida>} />
        <Route path="/wishlist" element={<RutaProtegida><Wishlist /></RutaProtegida>} />
        <Route path="/admin" element={<RutaAdmin><AdminDashboard /></RutaAdmin>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}