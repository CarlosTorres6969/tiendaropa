'use client';

import { Factura } from '../types';

interface DashboardProps {
  facturas: Factura[];
}

const descargarReporte = (facturas: Factura[]) => {
  const totalVentas = facturas.reduce((sum, f) => sum + f.total, 0);
  const totalFacturas = facturas.length;
  const promedioGeneral = totalFacturas > 0 ? totalVentas / totalFacturas : 0;

  // Crear contenido del reporte
  let contenido = '=== REPORTE DE VENTAS - TIENDA DE ROPA ===\n\n';
  contenido += `Fecha de generación: ${new Date().toLocaleString()}\n\n`;
  contenido += '--- RESUMEN GENERAL ---\n';
  contenido += `Total de Ventas: L ${totalVentas.toLocaleString()}\n`;
  contenido += `Facturas Emitidas: ${totalFacturas}\n`;
  contenido += `Promedio por Venta: L ${promedioGeneral.toLocaleString(undefined, {maximumFractionDigits: 0})}\n\n`;

  // Ventas por método de pago
  const metodosPago = facturas.reduce((acc, f) => {
    acc[f.metodoPago] = (acc[f.metodoPago] || 0) + f.total;
    return acc;
  }, {} as Record<string, number>);

  contenido += '--- VENTAS POR MÉTODO DE PAGO ---\n';
  Object.entries(metodosPago).forEach(([metodo, total]) => {
    const cantidad = facturas.filter(f => f.metodoPago === metodo).length;
    contenido += `${metodo.toUpperCase()}: L ${total.toLocaleString()} (${cantidad} transacciones)\n`;
  });

  // Ventas por sucursal
  contenido += '\n--- VENTAS POR SUCURSAL ---\n';
  const sucursales = [
    { nombre: 'Tegucigalpa Centro', facturas: facturas.filter((_, i) => i % 3 === 0) },
    { nombre: 'San Pedro Sula', facturas: facturas.filter((_, i) => i % 3 === 1) },
    { nombre: 'La Ceiba', facturas: facturas.filter((_, i) => i % 3 === 2) }
  ];

  sucursales.forEach(s => {
    const ventas = s.facturas.reduce((sum, f) => sum + f.total, 0);
    contenido += `${s.nombre}: L ${ventas.toLocaleString()} (${s.facturas.length} facturas)\n`;
  });

  // Últimas facturas
  contenido += '\n--- ÚLTIMAS 10 FACTURAS ---\n';
  facturas.slice(-10).reverse().forEach(f => {
    contenido += `${f.numero} | ${f.fecha.toLocaleDateString()} | L ${f.total.toLocaleString()} | ${f.metodoPago}\n`;
  });

  // Crear y descargar archivo
  const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-ventas-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface VentasSucursal {
  nombre: string;
  ventas: number;
  facturas: number;
  promedio: number;
}

export default function Dashboard({ facturas }: DashboardProps) {
  // Simular ventas por sucursal
  const sucursales: VentasSucursal[] = [
    {
      nombre: 'Tegucigalpa Centro',
      ventas: facturas.filter((_, i) => i % 3 === 0).reduce((sum, f) => sum + f.total, 0),
      facturas: facturas.filter((_, i) => i % 3 === 0).length,
      promedio: 0
    },
    {
      nombre: 'San Pedro Sula',
      ventas: facturas.filter((_, i) => i % 3 === 1).reduce((sum, f) => sum + f.total, 0),
      facturas: facturas.filter((_, i) => i % 3 === 1).length,
      promedio: 0
    },
    {
      nombre: 'La Ceiba',
      ventas: facturas.filter((_, i) => i % 3 === 2).reduce((sum, f) => sum + f.total, 0),
      facturas: facturas.filter((_, i) => i % 3 === 2).length,
      promedio: 0
    }
  ];

  // Calcular promedios
  sucursales.forEach(s => {
    s.promedio = s.facturas > 0 ? s.ventas / s.facturas : 0;
  });

  const totalVentas = facturas.reduce((sum, f) => sum + f.total, 0);
  const totalFacturas = facturas.length;
  const promedioGeneral = totalFacturas > 0 ? totalVentas / totalFacturas : 0;

  // Ventas de hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const ventasHoy = facturas.filter(f => {
    const fechaFactura = new Date(f.fecha);
    fechaFactura.setHours(0, 0, 0, 0);
    return fechaFactura.getTime() === hoy.getTime();
  });
  const totalHoy = ventasHoy.reduce((sum, f) => sum + f.total, 0);

  // Método de pago más usado
  const metodosPago = facturas.reduce((acc, f) => {
    acc[f.metodoPago] = (acc[f.metodoPago] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const metodoMasUsado = Object.entries(metodosPago).sort((a, b) => b[1] - a[1])[0];

  // Ventas por método de pago con totales
  const ventasPorMetodo = facturas.reduce((acc, f) => {
    acc[f.metodoPago] = (acc[f.metodoPago] || 0) + f.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Botón de descarga */}
      <div className="flex justify-end">
        <button
          onClick={() => descargarReporte(facturas)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg"
        >
          📥 Descargar Reporte
        </button>
      </div>

      {/* Resumen General */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Dashboard General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Total Ventas</p>
            <p className="text-3xl font-bold">L {totalVentas.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Facturas Emitidas</p>
            <p className="text-3xl font-bold">{totalFacturas}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Promedio por Venta</p>
            <p className="text-3xl font-bold">L {promedioGeneral.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Ventas Hoy</p>
            <p className="text-3xl font-bold">L {totalHoy.toLocaleString()}</p>
            <p className="text-xs opacity-90 mt-1">{ventasHoy.length} facturas</p>
          </div>
        </div>

        {metodoMasUsado && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
            <p className="text-sm font-semibold text-gray-800 mb-1">💳 Método de Pago Preferido:</p>
            <p className="text-2xl font-bold text-gray-900 capitalize">{metodoMasUsado[0]}</p>
            <p className="text-sm text-gray-700 font-medium">{metodoMasUsado[1]} transacciones</p>
          </div>
        )}
      </div>

      {/* Ventas por Método de Pago */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">💳 Ventas por Método de Pago</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(ventasPorMetodo).map(([metodo, total], index) => {
            const cantidad = facturas.filter(f => f.metodoPago === metodo).length;
            const porcentaje = totalVentas > 0 ? (total / totalVentas) * 100 : 0;
            const colores = [
              { bg: 'from-green-500 to-green-600', icon: '💵' },
              { bg: 'from-blue-500 to-blue-600', icon: '💳' },
              { bg: 'from-purple-500 to-purple-600', icon: '🏦' }
            ];
            const color = colores[index] || colores[0];
            
            return (
              <div key={metodo} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{color.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{metodo}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${color.bg}`}>
                    {porcentaje.toFixed(1)}%
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Total Ventas</p>
                    <p className="text-2xl font-bold text-gray-900">L {total.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Transacciones</p>
                    <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Promedio</p>
                    <p className="text-xl font-bold text-gray-900">
                      L {(total / cantidad).toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${color.bg} transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ventas por Sucursal */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🏪 Ventas por Sucursal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sucursales.map((sucursal, index) => {
            const porcentaje = totalVentas > 0 ? (sucursal.ventas / totalVentas) * 100 : 0;
            const colores = [
              'from-blue-500 to-blue-600',
              'from-green-500 to-green-600',
              'from-purple-500 to-purple-600'
            ];
            
            return (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{sucursal.nombre}</h3>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${colores[index]}`}>
                    {porcentaje.toFixed(1)}%
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">Total Ventas</p>
                    <p className="text-2xl font-bold text-gray-900">L {sucursal.ventas.toLocaleString()}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-700 font-medium">Facturas</p>
                      <p className="text-xl font-bold text-gray-900">{sucursal.facturas}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-700 font-medium">Promedio</p>
                      <p className="text-xl font-bold text-gray-900">L {sucursal.promedio.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    </div>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colores[index]} transition-all duration-500`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparativa de Sucursales */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📈 Comparativa de Rendimiento</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Sucursal</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Ventas Totales</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900">Facturas</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-gray-900">Ticket Promedio</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900">Participación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sucursales.sort((a, b) => b.ventas - a.ventas).map((sucursal, index) => {
                const porcentaje = totalVentas > 0 ? (sucursal.ventas / totalVentas) * 100 : 0;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                        <span className="font-bold text-gray-900">{sucursal.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      L {sucursal.ventas.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900">
                      {sucursal.facturas}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      L {sucursal.promedio.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                        {porcentaje.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td className="px-4 py-3 text-gray-900">TOTAL</td>
                <td className="px-4 py-3 text-right text-gray-900">L {totalVentas.toLocaleString()}</td>
                <td className="px-4 py-3 text-center text-gray-900">{totalFacturas}</td>
                <td className="px-4 py-3 text-right text-gray-900">L {promedioGeneral.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                <td className="px-4 py-3 text-center text-gray-900">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
