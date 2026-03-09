'use client';

import { useState } from 'react';

interface ProcesarPagoProps {
  total: number;
  onPagar: (metodoPago: 'efectivo' | 'tarjeta' | 'transferencia') => void;
  deshabilitado: boolean;
}

export default function ProcesarPago({ total, onPagar, deshabilitado }: ProcesarPagoProps) {
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [montoPagado, setMontoPagado] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [numeroTransferencia, setNumeroTransferencia] = useState('');

  const abrirModalPago = () => {
    if (deshabilitado) return;
    setMostrarModal(true);
  };

  const procesarPago = () => {
    if (metodoPago === 'efectivo') {
      const pago = parseFloat(montoPagado);
      if (pago < total) {
        alert('El monto pagado es insuficiente');
        return;
      }
    }
    
    if (metodoPago === 'tarjeta' && numeroTarjeta.length < 16) {
      alert('Número de tarjeta inválido');
      return;
    }

    if (metodoPago === 'transferencia' && numeroTransferencia.length < 10) {
      alert('Número de transferencia inválido');
      return;
    }

    onPagar(metodoPago);
    setMostrarModal(false);
    setMontoPagado('');
    setNumeroTarjeta('');
    setNumeroTransferencia('');
  };

  const cambio = metodoPago === 'efectivo' && montoPagado 
    ? parseFloat(montoPagado) - total 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">💳 3. Procesar Pago</h2>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-2 border-green-300 shadow-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Total a Pagar:</p>
          <p className="text-4xl font-bold text-gray-900">
            L {total.toLocaleString()}
          </p>
        </div>

        <button
          onClick={abrirModalPago}
          disabled={deshabilitado}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg ${
            deshabilitado
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105'
          }`}
        >
          {deshabilitado ? '⚠️ Agregue productos para continuar' : '💳 Procesar Pago'}
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Seleccionar Método de Pago</h3>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="efectivo"
                  checked={metodoPago === 'efectivo'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Efectivo</p>
                  <p className="text-sm text-gray-600">Pago en efectivo</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Tarjeta</p>
                  <p className="text-sm text-gray-600">Débito o Crédito</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Transferencia</p>
                  <p className="text-sm text-gray-600">Transferencia bancaria</p>
                </div>
              </label>
            </div>

            {metodoPago === 'efectivo' && (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Recibido:
                  </label>
                  <input
                    type="number"
                    value={montoPagado}
                    onChange={(e) => setMontoPagado(e.target.value)}
                    placeholder="Ingrese el monto"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xl font-bold placeholder:text-gray-400 bg-white"
                  />
                </div>
                {cambio > 0 && (
                  <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400">
                    <p className="text-sm text-gray-700 mb-1">Cambio a devolver:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      L {cambio.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {metodoPago === 'tarjeta' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta:
                </label>
                <input
                  type="text"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, '').slice(0, 16))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
                />
              </div>
            )}

            {metodoPago === 'transferencia' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Referencia:
                </label>
                <input
                  type="text"
                  value={numeroTransferencia}
                  onChange={(e) => setNumeroTransferencia(e.target.value)}
                  placeholder="Ingrese número de transferencia"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
                />
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
                onClick={procesarPago}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
