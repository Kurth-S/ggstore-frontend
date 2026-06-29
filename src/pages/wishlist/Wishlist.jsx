import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    cargarWishlist()
  }, [])

  const cargarWishlist = async () => {
    try {
      const res = await api.get('/wishlist')
      setItems(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const eliminar = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`)
      setItems(items.filter(i => i.id !== id))
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  const agregarAlCarrito = async (juegoId) => {
    try {
      await api.post('/carrito/items', { juegoId, cantidad: 1 })
      alert('¡Agregado al carrito!')
      navigate('/carrito')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al agregar')
    }
  }

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Cargando wishlist...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">❤️ Lista de Deseos</h1>
        <p className="text-gray-400 mb-8">Juegos que quieres comprar más adelante</p>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">Tu lista de deseos está vacía</p>
            <p className="text-sm">Agrega juegos desde el catálogo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    src={item.imagenUrl || 'https://placehold.co/400x220/1f2937/9ca3af?text=GG'}
                    alt={item.tituloJuego}
                    className="w-full h-44 object-cover"
                  />
                  {item.descuentoPorcentaje > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      -{item.descuentoPorcentaje}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 truncate">{item.tituloJuego}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {item.descuentoPorcentaje > 0 && (
                      <span className="text-gray-500 text-xs line-through">
                        {item.precio?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                      </span>
                    )}
                    <span className="text-yellow-400 font-bold">
                      {item.precioFinal?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => agregarAlCarrito(item.juegoId)}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                      🛒 Agregar
                    </button>
                    <button
                      onClick={() => eliminar(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}