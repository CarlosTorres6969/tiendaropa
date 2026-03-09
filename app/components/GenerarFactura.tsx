'use client';

import { Factura } from '../types';

interface GenerarFacturaProps {
  factura: Factura | null;
  onNuevaVenta: () => void;
}

export default function GenerarFactura({ factura, onNuevaVenta }: GenerarFacturaProps) {
  const imprimirFactura = () => {
    window.print();
  };

  if (!factura) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="print:block" id="factura">
          <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">TIENDA DE ROPA</h1>
            <p className="text-gray-800 font-semibold">RTN: 08019001234567</p>
            <p className="text-gray-800 font-medium">Dirección: Col. Palmira, Tegucigalpa, Honduras</p>
            <p className="text-gray-800 font-medium">Tel: (504) 2234-5678</p>
            <p className="text-gray-800 font-medium">Email: ventas@tiendaropa.hn</p>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">FACTURA DE VENTA</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-900 font-bold">Número: <span className="font-normal">{factura.numero}</span></p>
                <p className="text-gray-900 font-bold">Fecha: <span className="font-normal">{factura.fecha.toLocaleDateString()}</span></p>
                <p className="text-gray-900 font-bold">Hora: <span className="font-normal">{factura.fecha.toLocaleTimeString()}</span></p>
              </div>
              <div>
                <p className="text-gray-900 font-bold">Método de Pago: <span className="font-normal uppercase">{factura.metodoPago}</span></p>
                <p className="text-gray-900 font-bold">Estado: <span className="font-normal uppercase">{factura.estado}</span></p>
              </div>
            </div>
            {factura.cliente && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
                <p className="font-bold text-gray-900 mb-1">Cliente:</p>
                <p className="text-gray-900 font-semibold">{factura.cliente.nombre} {factura.cliente.apellido}</p>
                <p className="text-sm text-gray-800 font-medium">ID: {factura.cliente.identificacion}</p>
                <p className="text-sm text-gray-800 font-medium">Tel: {factura.cliente.telefono}</p>
              </div>
            )}
          </div>

          <div className="mb-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400">
            <p className="text-xs font-bold text-gray-900 mb-2">INFORMACIÓN FISCAL:</p>
            <p className="text-xs text-gray-900 font-semibold">CAI: {factura.cai || 'A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-67'}</p>
            <p className="text-xs text-gray-900 font-semibold">Rango Autorizado: {factura.rangoAutorizado || '001-001-01-00000001 al 001-001-01-00005000'}</p>
            <p className="text-xs text-gray-900 font-semibold">Fecha Límite de Emisión: {factura.fechaLimiteEmision?.toLocaleDateString() || '31/12/2026'}</p>
          </div>

          <div className="mb-6">
            <table className="w-full text-sm border-2 border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-bold text-gray-900 border-b-2 border-gray-300">Producto</th>
                  <th className="px-4 py-2 text-center font-bold text-gray-900 border-b-2 border-gray-300">Cant.</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-900 border-b-2 border-gray-300">Precio</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-900 border-b-2 border-gray-300">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {factura.items.map((item, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 text-gray-900 font-medium">
                      {item.producto.nombre}
                      <br />
                      <span className="text-xs text-gray-700 font-semibold">{item.producto.codigo}</span>
                    </td>
                    <td className="px-4 py-2 text-center text-gray-900 font-bold">{item.cantidad}</td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">L {item.producto.precio.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-900 font-bold">L {item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-gray-800 pt-4 space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-900">Subtotal:</span>
              <span className="font-bold text-gray-900">L {factura.subtotal.toLocaleString()}</span>
            </div>
            {factura.descuentoTotal > 0 && (
              <div className="flex justify-between text-lg text-orange-700">
                <span className="font-semibold">Descuento:</span>
                <span className="font-bold">- L {factura.descuentoTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-900">ISV (15%):</span>
              <span className="font-bold text-gray-900">L {factura.impuesto.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t-2 border-gray-800 pt-3 mt-2">
              <span className="text-gray-900">TOTAL:</span>
              <span className="text-gray-900">L {factura.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm border-t-2 border-gray-300 pt-4">
            <p className="text-gray-900 font-bold">Gracias por su compra</p>
            <p className="text-gray-800 font-medium">Esta factura es válida como comprobante de pago</p>
            <p className="text-gray-800 font-medium mt-2">Original: Cliente | Copia: Archivo</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6 print:hidden">
          <button
            onClick={imprimirFactura}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
          >
            🖨️ Imprimir Factura
          </button>
          <button
            onClick={onNuevaVenta}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
          >
            ✨ Nueva Venta
          </button>
        </div>
      </div>
    </div>
  );
}
