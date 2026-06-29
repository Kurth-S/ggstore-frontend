import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import logo from '../../assets/logo.png'

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await api.post('/auth/register', form)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="GG Store" className="h-16 w-16 object-contain mb-3" />
          <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
          <p className="text-gray-400 text-sm mt-1">Únete a GG Store hoy</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}