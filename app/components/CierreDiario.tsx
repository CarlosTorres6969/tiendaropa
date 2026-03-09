'use client';

import { useState } from 'react';
import { Factura } from '../types';

interface CierreDiarioProps {
  facturas: Factura[];
  onCerrar: () => void;
}

export default function CierreDiario({ facturas, onCerrar }: CierreDiarioProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  
  // Filtrar facturas del día seleccionado
  const facturasDelDia = facturas.filter(f => {
    const fechaFactura = new Date(f.fecha);
    const fechaFiltro = new Date(fechaSeleccionada);
    return fechaFactura.toDateString() === fechaFiltro.toDateString();
  });

  // Calcular totales
  const totalVentas = facturasDelDia.reduce((sum, f) => sum + f.total, 0);
  const totalEfectivo = facturasDelDia.filter(f => f.metodoPago === 'efectivo').reduce((sum, f) => sum + f.total, 0);
  const totalTarjeta = facturasDelDia.filter(f => f.metodoPago === 'tarjeta').reduce((sum, f) => sum + f.total, 0);
  const totalTransferencia = facturasDelDia.filter(f => f.metodoPago === 'transferencia').reduce((sum, f) => sum + f.total, 0);
  
  const cantidadEfectivo = facturasDelDia.filter(f => f.metodoPago === 'efectivo').length;
  const cantidadTarjeta = facturasDelDia.filter(f => f.metodoPago === 'tarjeta').length;
  const cantidadTransferencia = facturasDelDia.filter(f => f.metodoPago === 'transferencia').length;

  const totalDescuentos = facturasDelDia.reduce((sum, f) => sum + f.descuentoTotal, 0);
  const totalImpuestos = facturasDelDia.reduce((sum, f) => sum + f.impuesto, 0);
  const totalSubtotal = facturasDelDia.reduce((sum, f) => sum + f.subtotal, 0);

  // Productos vendidos
  const productosVendidos = facturasDelDia.flatMap(f => f.items).reduce((acc, item) => {
    const key = item.producto.nombre;
    if (!acc[key]) {
      acc[key] = { cantidad: 0, total: 0 };
    }
    acc[key].cantidad += item.cantidad;
    acc[key].total += item.subtotal;
    return acc;
  }, {} as Record<string, { cantidad: number; total: number }>);

  const descargarCierre = () => {
    let contenido = '═══════════════════════════════════════════════════\n';
    contenido += '           CIERRE DIARIO - TIENDA DE ROPA\n';
    contenido += '═══════════════════════════════════════════════════\n\n';
    contenido += `Fecha: ${new Date(fechaSeleccionada).toLocaleDateString('es-HN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}\n`;
    contenido += `Hora de cierre: ${new Date().toLocaleTimeString()}\n\n`;
    
    contenido += '───────────────────────────────────────────────────\n';
    contenido += '                 RESUMEN DE VENTAS\n';
    contenido += '───────────────────────────────────────────────────\n';
    contenido += `Total de Facturas: ${facturasDelDia.length}\n`;
    contenido += `Subtotal:          L ${totalSubtotal.toLocaleString()}\n`;
    contenido += `Descuentos:        L ${totalDescuentos.toLocaleString()}\n`;
    contenido += `ISV (15%):         L ${totalImpuestos.toLocaleString()}\n`;
    contenido += `TOTAL VENTAS:      L ${totalVentas.toLocaleString()}\n\n`;
    
    contenido += '───────────────────────────────────────────────────\n';
    contenido += '            DESGLOSE POR MÉTODO DE PAGO\n';
    contenido += '───────────────────────────────────────────────────\n';
    contenido += `EFECTIVO:\n`;
    contenido += `  Transacciones: ${cantidadEfectivo}\n`;
    contenido += `  Total:         L ${totalEfectivo.toLocaleString()}\n\n`;
    contenido += `TARJETA:\n`;
    contenido += `  Transacciones: ${cantidadTarjeta}\n`;
    contenido += `  Total:         L ${totalTarjeta.toLocaleString()}\n\n`;
    contenido += `TRANSFERENCIA:\n`;
    contenido += `  Transacciones: ${cantidadTransferencia}\n`;
    contenido += `  Total:         L ${totalTransferencia.toLocaleString()}\n\n`;
    
    contenido += '───────────────────────────────────────────────────\n';
    contenido += '              PRODUCTOS VENDIDOS\n';
    contenido += '───────────────────────────────────────────────────\n';
    Object.entries(productosVendidos)
      .sort((a, b) => b[1].cantidad - a[1].cantidad)
      .forEach(([producto, datos]) => {
        contenido += `${producto}\n`;
        contenido += `  Cantidad: ${datos.cantidad} unidades\n`;
        contenido += `  Total:    L ${datos.total.toLocaleString()}\n\n`;
      });
    
    contenido += '───────────────────────────────────────────────────\n';
    contenido += '              DETALLE DE FACTURAS\n';
    contenido += '───────────────────────────────────────────────────\n';
    facturasDelDia.forEach(f => {
      contenido += `${f.numero} | ${f.fecha.toLocaleTimeString()} | L ${f.total.toLocaleString()} | ${f.metodoPago.toUpperCase()}\n`;
    });
    
    contenido += '\n═══════════════════════════════════════════════════\n';
    contenido += '              FIN DEL CIERRE DIARIO\n';
    contenido += '═══════════════════════════════════════════════════\n';

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cierre-diario-${fechaSeleccionada}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          📊 Cierre Diario de Caja
        </h2>

        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Seleccionar Fecha:</label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold"
            />
          </div>
          
          <button
            onClick={descargarCierre}
            disabled={facturasDelDia.length === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Descargar Cierre
          </button>
        </div>

        {facturasDelDia.length === 0 ? (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8 text-center">
            <p className="text-xl font-bold text-gray-800">⚠️ No hay ventas registradas para esta fecha</p>
          </div>
        ) : (
          <>
            {/* Resumen General */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Resumen General</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-bold text-gray-700">Facturas</p>
                  <p className="text-3xl font-bold text-gray-900">{facturasDelDia.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-bold text-gray-700">Subtotal</p>
                  <p className="text-2xl font-bold text-gray-900">L {totalSubtotal.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-bold text-gray-700">Descuentos</p>
                  <p className="text-2xl font-bold text-red-600">-L {totalDescuentos.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4">
                  <p className="text-sm font-bold text-white opacity-90">TOTAL</p>
                  <p className="text-3xl font-bold text-white">L {totalVentas.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💳 Desglose por Método de Pago</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💵</span>
                    <h4 className="text-xl font-bold text-gray-900">Efectivo</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">L {totalEfectivo.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-gray-700">{cantidadEfectivo} transacciones</p>
                  <p className="text-sm font-semibold text-gray-700">
                    Promedio: L {cantidadEfectivo > 0 ? (totalEfectivo / cantidadEfectivo).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💳</span>
                    <h4 className="text-xl font-bold text-gray-900">Tarjeta</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">L {totalTarjeta.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-gray-700">{cantidadTarjeta} transacciones</p>
                  <p className="text-sm font-semibold text-gray-700">
                    Promedio: L {cantidadTarjeta > 0 ? (totalTarjeta / cantidadTarjeta).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🏦</span>
                    <h4 className="text-xl font-bold text-gray-900">Transferencia</h4>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">L {totalTransferencia.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-gray-700">{cantidadTransferencia} transacciones</p>
                  <p className="text-sm font-semibold text-gray-700">
                    Promedio: L {cantidadTransferencia > 0 ? (totalTransferencia / cantidadTransferencia).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Productos Vendidos */}
            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📦 Productos Más Vendidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-white border border-purple-700">Producto</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-white border border-purple-700">Cantidad</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-white border border-purple-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {Object.entries(productosVendidos)
                      .sort((a, b) => b[1].cantidad - a[1].cantidad)
                      .slice(0, 10)
                      .map(([producto, datos], index) => (
                        <tr key={index} className="hover:bg-purple-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-900 border border-gray-300">{producto}</td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800 border border-gray-300">
                            {datos.cantidad} unidades
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 border border-gray-300">
                            L {datos.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lista de Facturas */}
            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🧾 Detalle de Facturas ({facturasDelDia.length})</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Número</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Hora</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Cliente</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-white border border-blue-700">Método</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-white border border-blue-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {facturasDelDia.map((factura) => (
                      <tr key={factura.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-2 font-bold text-gray-900 border border-gray-300">{factura.numero}</td>
                        <td className="px-4 py-2 font-semibold text-gray-800 border border-gray-300">
                          {factura.fecha.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2 font-semibold text-gray-800 border border-gray-300">
                          {factura.cliente ? `${factura.cliente.nombre} ${factura.cliente.apellido}` : 'Sin cliente'}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold capitalize">
                            {factura.metodoPago}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-gray-900 border border-gray-300">
                          L {factura.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <button
          onClick={onCerrar}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold text-lg shadow-lg"
        >
          ❌ Cerrar
        </button>
      </div>
    </div>
  );
}
