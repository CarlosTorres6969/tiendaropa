'use client';

import { ItemVenta } from '../types';

interface ListaVentaProps {
  items: ItemVenta[];
  onEliminar: (index: number) => void;
  descuentoAplicado: any;
}

export default function ListaVenta({ items, onEliminar, descuentoAplicado }: ListaVentaProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  
  let descuentoTotal = 0;
  if (descuentoAplicado) {
    if (descuentoAplicado.tipo === 'porcentaje') {
      descuentoTotal = subtotal * (descuentoAplicado.valor / 100);
    } else {
      descuentoTotal = descuentoAplicado.valor;
    }
  }
  
  const subtotalConDescuento = subtotal - descuentoTotal;
  const impuesto = subtotalConDescuento * 0.15; // ISV 15%
  const total = subtotalConDescuento + impuesto;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🛒 Lista de Venta</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay productos en la venta</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Producto</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Precio Unit.</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Subtotal</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{item.producto.nombre}</p>
                      <p className="text-xs text-gray-500">{item.producto.codigo}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{item.cantidad}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      L {item.producto.precio.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                      L {item.subtotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onEliminar(index)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 pt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-lg text-gray-800">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold text-gray-900">L {subtotal.toLocaleString()}</span>
            </div>
            {descuentoAplicado && (
              <div className="flex justify-between text-lg text-orange-600">
                <span className="font-medium">Descuento ({descuentoAplicado.codigo}):</span>
                <span className="font-bold">- L {descuentoTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg text-gray-800">
              <span className="font-medium">ISV (15%):</span>
              <span className="font-bold text-gray-900">L {impuesto.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
              <span>TOTAL:</span>
              <span className="text-green-600">L {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
