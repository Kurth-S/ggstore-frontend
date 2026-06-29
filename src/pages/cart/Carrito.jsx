import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Carrito() {
  const [carrito, setCarrito] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    cargarCarrito()
  }, [])

  const cargarCarrito = async () => {
    try {
      const res = await api.get('/carrito')
      setCarrito(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const actualizarCantidad = async (detalleId, cantidad) => {
    try {
      const res = await api.put(`/carrito/items/${detalleId}?cantidad=${cantidad}`)
      setCarrito(res.data)
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar')
    }
  }

  const eliminarItem = async (detalleId) => {
    try {
      await api.delete(`/carrito/items/${detalleId}`)
      cargarCarrito()
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  const checkout = async () => {
    setProcesando(true)
    try {
      const res = await api.post('/pedidos/checkout', {})
      alert(`¡Compra exitosa! Pedido #${res.data.id.substring(0, 8).toUpperCase()}`)
      navigate('/biblioteca')
    } catch (err) {
      alert(err.response?.data?.error || 'Error al procesar la compra')
    } finally {
      setProcesando(false)
    }
  }

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Cargando carrito...
    </div>
  )

  const items = carrito?.items || []

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">🛒 Mi Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => navigate('/')}
              className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-300"
            >
              Ver catálogo
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-gray-900 rounded-xl p-4 flex items-center gap-4">
                  <img
                    src={item.imagenUrl || 'https://placehold.co/80x80/1f2937/9ca3af?text=GG'}
                    alt={item.tituloJuego}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.tituloJuego}</h3>
                    <p className="text-yellow-400 font-bold mt-1">
                      {item.precioFinal?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-white font-bold w-28 text-right">
                    {item.subtotal?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </p>

                  <button
                    onClick={() => eliminarItem(item.id)}
                    className="text-red-400 hover:text-red-300 text-xl ml-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl p-6 ml-auto w-full md:w-80">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>{carrito?.total?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span>
              </div>
              <div className="border-t border-gray-700 my-3"></div>
              <div className="flex justify-between text-white font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-yellow-400">
                  {carrito?.total?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </span>
              </div>
              <button
                onClick={checkout}
                disabled={procesando}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {procesando ? 'Procesando...' : '✅ Confirmar compra'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}