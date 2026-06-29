import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function Biblioteca() {
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/biblioteca')
      .then(res => setJuegos(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Cargando biblioteca...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">🎮 Mi Biblioteca</h1>
        <p className="text-gray-400 mb-8">Tus juegos comprados</p>

        {juegos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No tienes juegos en tu biblioteca</p>
            <p className="text-sm">¡Compra tu primer juego en el catálogo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {juegos.map(juego => (
              <div key={juego.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={juego.imagenUrl || 'https://placehold.co/400x220/1f2937/9ca3af?text=GG'}
                  alt={juego.tituloJuego}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{juego.tituloJuego}</h3>
                  <p className="text-gray-500 text-xs mb-3">
                    Adquirido: {new Date(juego.fechaAdquisicion).toLocaleDateString('es-CL')}
                  </p>
                  {juego.claveDigital && (
                    <div className="bg-gray-800 rounded-lg px-3 py-2 mt-2">
                      <p className="text-xs text-gray-400 mb-1">Clave digital:</p>
                      <p className="text-yellow-400 font-mono text-xs font-bold">{juego.claveDigital}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}