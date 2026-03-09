'use client';

import { useState } from 'react';
import { Producto } from '../types';

interface BuscarPrendaProps {
  onSeleccionar: (producto: Producto) => void;
  productos: Producto[];
}

export default function BuscarPrenda({ onSeleccionar, productos }: BuscarPrendaProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const buscarProducto = (termino: string) => {
    setBusqueda(termino);
    if (termino.length > 0) {
      const filtrados = productos.filter(
        p => 
          p.codigo.toLowerCase().includes(termino.toLowerCase()) ||
          p.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      setResultados(filtrados);
      setMostrarResultados(true);
    } else {
      setResultados([]);
      setMostrarResultados(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔍 1. Buscar Prenda</h2>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Ingrese código o nombre del producto..."
          value={busqueda}
          onChange={(e) => buscarProducto(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
        />
        
        {mostrarResultados && resultados.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {resultados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => {
                  onSeleccionar(producto);
                  setBusqueda('');
                  setMostrarResultados(false);
                }}
                className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">Código: {producto.codigo}</p>
                    <p className="text-sm text-gray-600">
                      Talla: {producto.talla} | Color: {producto.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      L {producto.precio.toLocaleString()}
                    </p>
                    <p className={`text-sm font-semibold ${producto.stockDisponible > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                      Stock: {producto.stockDisponible}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {mostrarResultados && resultados.length === 0 && busqueda.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-gray-500 text-center">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}
