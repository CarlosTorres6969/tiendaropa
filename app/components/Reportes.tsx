'use client';

import { Factura } from '../types';

interface ReportesProps {
  facturas: Factura[];
  onCerrar?: () => void;
}

export default function Reportes({ facturas, onCerrar }: ReportesProps) {
  const totalVentas = facturas.reduce((sum, f) => sum + f.total, 0);
  const cantidadFacturas = facturas.length;
  const promedioVenta = cantidadFacturas > 0 ? totalVentas / cantidadFacturas : 0;

  const productosMasVendidos = facturas.flatMap(f => f.items).reduce((acc, item) => {
    const key = item.producto.nombre;
    acc[key] = (acc[key] || 0) + item.cantidad;
    return acc;
  }, {} as Record<string, number>);

  const productoTop = Object.entries(productosMasVendidos).sort((a, b) => b[1] - a[1])[0];

  const metodosPago = facturas.reduce((acc, f) => {
    acc[f.metodoPago] = (acc[f.metodoPago] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const metodoMasUsado = Object.entries(metodosPago).sort((a, b) => b[1] - a[1])[0];

  const ventasPorCategoria = facturas.flatMap(f => f.items).reduce((acc, item) => {
    const cat = item.producto.categoria;
    acc[cat] = (acc[cat] || 0) + item.subtotal;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          📊 Reportes de Ventas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Total Ventas</p>
            <p className="text-4xl font-bold">L {totalVentas.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Facturas Emitidas</p>
            <p className="text-4xl font-bold">{cantidadFacturas}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Promedio por Venta</p>
            <p className="text-4xl font-bold">L {promedioVenta.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Producto Más Vendido</h3>
            {productoTop ? (
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <p className="text-lg font-bold text-gray-900">{productoTop[0]}</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{productoTop[1]} unidades</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos</p>
            )}
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">💳 Método de Pago Preferido</h3>
            {metodoMasUsado ? (
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <p className="text-lg font-bold text-gray-900 capitalize">{metodoMasUsado[0]}</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{metodoMasUsado[1]} veces</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos</p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Ventas por Categoría</h3>
          <div className="space-y-3">
            {Object.entries(ventasPorCategoria).sort((a, b) => b[1] - a[1]).map(([cat, total]) => (
              <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-800">{cat}</span>
                <span className="text-xl font-bold text-gray-900">L {total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🧾 Últimas Facturas</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Número</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Cliente</th>
                  <th className="px-4 py-3 text-right text-sm font-bold text-white border border-blue-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-white border border-blue-700">Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {facturas.slice(-10).reverse().map((factura) => (
                  <tr key={factura.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900 border border-gray-300">{factura.numero}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-300">{factura.fecha.toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-300">
                      {factura.cliente ? `${factura.cliente.nombre} ${factura.cliente.apellido}` : 'Sin cliente'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 border border-gray-300">
                      L {factura.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center border border-gray-300">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold capitalize">
                        {factura.metodoPago}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onCerrar}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold text-lg shadow-lg"
        >
          ❌ Cerrar Reportes
        </button>
      </div>
    </div>
  );
}
