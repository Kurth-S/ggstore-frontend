import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Catalogo() {
  const [juegos, setJuegos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const { estaAutenticado } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    cargarCategorias()
  }, [])

  useEffect(() => {
    cargarJuegos()
  }, [pagina, categoriaId])

  const cargarCategorias = async () => {
    try {
      const res = await api.get('/categorias')
      setCategorias(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const cargarJuegos = async () => {
    setCargando(true)
    try {
      const params = { page: pagina, size: 12 }
      if (busqueda) params.titulo = busqueda
      if (categoriaId) params.categoriaId = categoriaId
      const res = await api.get('/juegos', { params })
      setJuegos(res.data.content)
      setTotalPaginas(res.data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const handleBuscar = (e) => {
    e.preventDefault()
    setPagina(0)
    cargarJuegos()
  }

  const agregarAlCarrito = async (juegoId) => {
    if (!estaAutenticado) {
      navigate('/login')
      return
    }
    try {
      await api.post('/carrito/items', { juegoId, cantidad: 1 })
      alert('¡Agregado al carrito!')
    } catch (err) {
      const mensaje = err.response?.data?.error || ''
      if (mensaje.includes('duplicate') || mensaje.includes('already exists')) {
        alert('Este juego ya está en tu carrito')
      } else {
        alert(mensaje || 'Error al agregar al carrito')
      }
    }
  }

  const agregarAWishlist = async (juegoId) => {
    if (!estaAutenticado) {
      navigate('/login')
      return
    }
    try {
      await api.post(`/wishlist/${juegoId}`)
      alert('¡Agregado a tu lista de deseos!')
    } catch (err) {
      const mensaje = err.response?.data?.error || ''
      if (mensaje.includes('duplicate') || mensaje.includes('already exists')) {
        alert('Este juego ya está en tu lista de deseos')
      } else {
        alert(mensaje || 'Error al agregar a wishlist')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 px-6 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">🎮 Catálogo de Juegos</h1>
        <p className="text-gray-400">Encuentra tu próximo juego favorito</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleBuscar} className="flex gap-2 flex-1">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar juegos..."
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 font-bold px-5 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Buscar
            </button>
          </form>

          <select
            value={categoriaId}
            onChange={(e) => { setCategoriaId(e.target.value); setPagina(0) }}
            className="bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Grid de juegos */}
        {cargando ? (
          <div className="text-center py-20 text-gray-400">Cargando juegos...</div>
        ) : juegos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No se encontraron juegos</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {juegos.map(juego => (
              <div key={juego.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/10 hover:-translate-y-1 transition-all duration-200">

                {/* Imagen */}
                <div className="relative">
                  <img
                    src={juego.imagenUrl || 'https://placehold.co/400x220/1f2937/9ca3af?text=Sin+imagen'}
                    alt={juego.titulo}
                    className="w-full h-44 object-cover"
                  />
                  {juego.descuentoPorcentaje > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      -{juego.descuentoPorcentaje}%
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-gray-900/80 text-gray-300 text-xs px-2 py-1 rounded-md">
                    {juego.plataforma}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 truncate">{juego.titulo}</h3>
                  <p className="text-gray-500 text-xs mb-3">{juego.categoriaNombre || 'Sin categoría'}</p>

                  {/* Precio */}
                  <div className="flex items-center gap-2 mb-4">
                    {juego.descuentoPorcentaje > 0 && (
                      <span className="text-gray-500 text-xs line-through">
                        {juego.precio?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </span>
                    )}
                    <span className="text-yellow-400 font-bold">
                      {juego.precioFinal?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => agregarAlCarrito(juego.id)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      🛒 Agregar
                    </button>
                    <button
                      onClick={() => agregarAWishlist(juego.id)}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPagina(p => Math.max(0, p - 1))}
              disabled={pagina === 0}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="bg-gray-800 text-gray-400 px-4 py-2 rounded-lg">
              {pagina + 1} / {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas - 1, p + 1))}
              disabled={pagina === totalPaginas - 1}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}