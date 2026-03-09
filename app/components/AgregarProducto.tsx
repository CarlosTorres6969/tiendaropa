'use client';

import { useState } from 'react';
import { Producto, ItemVenta } from '../types';

interface AgregarProductoProps {
  productoSeleccionado: Producto | null;
  onAgregar: (item: ItemVenta) => void;
}

export default function AgregarProducto({ productoSeleccionado, onAgregar }: AgregarProductoProps) {
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const agregarALista = () => {
    if (!productoSeleccionado) {
      setMensaje('Debe seleccionar un producto primero');
      return;
    }

    if (cantidad <= 0) {
      setMensaje('La cantidad debe ser mayor a 0');
      return;
    }

    if (cantidad > productoSeleccionado.stockDisponible) {
      setMensaje(`Stock insuficiente. Disponible: ${productoSeleccionado.stockDisponible}`);
      return;
    }

    const item: ItemVenta = {
      producto: productoSeleccionado,
      cantidad,
      subtotal: productoSeleccionado.precio * cantidad
    };

    onAgregar(item);
    setCantidad(1);
    setMensaje('✓ Producto agregado a la venta');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ 2. Agregar Producto a la Venta</h2>
      
      {productoSeleccionado ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Producto Seleccionado:</h3>
            <p className="text-gray-700">{productoSeleccionado.nombre}</p>
            <p className="text-sm text-gray-600">Código: {productoSeleccionado.codigo}</p>
            <p className="text-sm text-gray-600">
              Talla: {productoSeleccionado.talla} | Color: {productoSeleccionado.color}
            </p>
            <p className="font-bold text-xl text-gray-900 mt-2">
              Precio: L {productoSeleccionado.precio.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Stock disponible: {productoSeleccionado.stockDisponible}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad:
            </label>
            <input
              type="number"
              min="1"
              max={productoSeleccionado.stockDisponible}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xl font-bold bg-white"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
            <p className="text-2xl font-bold text-gray-900">
              Subtotal: L {(productoSeleccionado.precio * cantidad).toLocaleString()}
            </p>
          </div>

          <button
            onClick={agregarALista}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
          >
            ➕ Agregar a la Lista
          </button>

          {mensaje && (
            <div className={`p-3 rounded-lg text-center ${
              mensaje.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {mensaje}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Busque y seleccione un producto para agregarlo a la venta</p>
        </div>
      )}
    </div>
  );
}
