'use client';

import { useState } from 'react';
import { Descuento } from '../types';
import { descuentosData } from '../data/descuentos';

interface AplicarDescuentoProps {
  onAplicarDescuento: (descuento: Descuento | null) => void;
  descuentoAplicado: Descuento | null;
}

export default function AplicarDescuento({ onAplicarDescuento, descuentoAplicado }: AplicarDescuentoProps) {
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [mensaje, setMensaje] = useState('');

  const aplicarCodigo = () => {
    const descuento = descuentosData.find(
      d => d.codigo.toUpperCase() === codigoDescuento.toUpperCase() && d.activo
    );

    if (descuento) {
      onAplicarDescuento(descuento);
      setMensaje('✓ Descuento aplicado correctamente');
      setCodigoDescuento('');
      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('❌ Código de descuento inválido o inactivo');
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-yellow-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🎟️ Aplicar Descuento</h2>
      
      <div className="space-y-4">
        {descuentoAplicado ? (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-400">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold text-gray-900">{descuentoAplicado.codigo}</p>
                <p className="text-sm text-gray-700">{descuentoAplicado.descripcion}</p>
                <p className="text-lg font-bold text-green-700 mt-2">
                  {descuentoAplicado.tipo === 'porcentaje' 
                    ? `${descuentoAplicado.valor}% de descuento`
                    : `L ${descuentoAplicado.valor.toLocaleString()} de descuento`
                  }
                </p>
              </div>
              <button
                onClick={() => onAplicarDescuento(null)}
                className="text-red-600 hover:text-red-800 font-bold text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ingrese código de descuento..."
                value={codigoDescuento}
                onChange={(e) => setCodigoDescuento(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && aplicarCodigo()}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 text-lg font-bold placeholder:text-gray-400 bg-white uppercase"
              />
              <button
                onClick={aplicarCodigo}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-bold"
              >
                Aplicar
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-800 mb-2">Códigos disponibles:</p>
              <div className="grid grid-cols-2 gap-2">
                {descuentosData.filter(d => d.activo).map(d => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setCodigoDescuento(d.codigo);
                      setTimeout(() => aplicarCodigo(), 100);
                    }}
                    className="text-left px-3 py-2 bg-white rounded border border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
                  >
                    <p className="font-bold text-sm text-gray-900">{d.codigo}</p>
                    <p className="text-xs text-gray-600">
                      {d.tipo === 'porcentaje' ? `${d.valor}%` : `L ${d.valor}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {mensaje && (
          <div className={`p-3 rounded-lg text-center font-bold ${
            mensaje.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}
