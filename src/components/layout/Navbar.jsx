import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.png'

export default function Navbar() {
  const { usuario, estaAutenticado, esAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="GG Store" className="h-10 w-10 object-contain" />
        <span className="text-xl font-bold text-yellow-400">GG Store</span>
      </Link>

      {/* Links del centro */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-yellow-400 transition-colors">Catálogo</Link>
        {estaAutenticado && (
          <>
            <Link to="/carrito" className="hover:text-yellow-400 transition-colors">🛒 Carrito</Link>
            <Link to="/biblioteca" className="hover:text-yellow-400 transition-colors">🎮 Biblioteca</Link>
            <Link to="/wishlist" className="hover:text-yellow-400 transition-colors">❤️ Wishlist</Link>
          </>
        )}
        {esAdmin && (
          <Link to="/admin" className="hover:text-yellow-400 transition-colors">⚙️ Admin</Link>
        )}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3 text-sm">
        {estaAutenticado ? (
          <>
            <span className="text-gray-400">¡GG! Bienvenid@, <span className="text-white font-semibold">{usuario?.nombre}</span>!</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md transition-colors"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400 transition-colors">Iniciar sesión</Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-md hover:bg-yellow-300 transition-colors"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}