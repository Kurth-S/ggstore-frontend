import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
      Cargando dashboard...
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">⚙️ Dashboard Admin</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Usuarios registrados</p>
            <p className="text-4xl font-bold text-yellow-400">{stats?.totalUsuarios ?? 0}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total de pedidos</p>
            <p className="text-4xl font-bold text-yellow-400">{stats?.totalPedidos ?? 0}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Ingresos totales</p>
            <p className="text-4xl font-bold text-yellow-400">
              {stats?.ingresosTotales?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) ?? '$0'}
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🏆 Juegos más vendidos</h2>
          {!stats?.juegosMasVendidos?.length ? (
            <p className="text-gray-400">Aún no hay ventas</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.juegosMasVendidos.map((j, i) => (
                <div key={j.juegoId} className="flex items-center gap-4 bg-gray-800 rounded-lg px-4 py-3">
                  <span className="text-yellow-400 font-bold text-lg w-6">#{i + 1}</span>
                  <span className="flex-1 text-white font-medium">{j.titulo}</span>
                  <span className="text-gray-400 text-sm">{j.cantidadVendida} vendidos</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">📅 Ventas por mes</h2>
          {!stats?.ventasPorMes?.length ? (
            <p className="text-gray-400">Aún no hay ventas</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.ventasPorMes.map((v, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-800 rounded-lg px-4 py-3">
                  <span className="text-white font-medium w-24">{v.mes}/{v.anio}</span>
                  <span className="text-gray-400 text-sm">{v.totalPedidos} pedidos</span>
                  <span className="text-yellow-400 font-bold ml-auto">
                    {v.ingresos?.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}