'use client';

import { useState } from 'react';
import { Devolucion, Producto } from '../types';

interface DevolucionProductoProps {
  onDevolucion: (devolucion: Devolucion) => void;
}

export default function DevolucionProducto({ onDevolucion }: DevolucionProductoProps) {
  const [numeroFactura, setNumeroFactura] = useState('');
  const [codigoProducto, setCodigoProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const solicitarDevolucion = () => {
    if (!numeroFactura || !codigoProducto || !motivo) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    const devolucion: Devolucion = {
      id: Date.now().toString(),
      numeroFactura,
      producto: {
        id: codigoProducto,
        codigo: codigoProducto,
        nombre: 'Producto',
        precio: 0,
        stockDisponible: 0,
        categoria: ''
      },
      cantidad,
      motivo,
      fecha: new Date(),
      estado: 'pendiente'
    };

    onDevolucion(devolucion);
    setMensaje('✓ Devolución registrada exitosamente');
    setTimeout(() => {
      setMostrarModal(false);
      setNumeroFactura('');
      setCodigoProducto('');
      setCantidad(1);
      setMotivo('');
      setMensaje('');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-bold shadow-lg text-lg"
      >
        🔄 Gestionar Devoluciones
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🔄 5. Devolución de Producto</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Factura:
                </label>
                <input
                  type="text"
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  placeholder="Ej: FAC-001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Producto:
                </label>
                <input
                  type="text"
                  value={codigoProducto}
                  onChange={(e) => setCodigoProducto(e.target.value)}
                  placeholder="Ej: CAM001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad:
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-xl font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de Devolución:
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Describa el motivo de la devolución..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 text-base font-medium placeholder:text-gray-400 bg-white"
                />
              </div>

              {mensaje && (
                <div className={`p-3 rounded-lg text-center ${
                  mensaje.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {mensaje}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={solicitarDevolucion}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  Solicitar Devolución
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
