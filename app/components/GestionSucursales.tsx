'use client';

import { useState } from 'react';
import { Sucursal } from '../types';

interface GestionSucursalesProps {
  sucursales: Sucursal[];
  onAgregarSucursal: (sucursal: Sucursal) => void;
  onActualizarSucursal: (id: string, sucursal: Sucursal) => void;
  onCerrar: () => void;
}

export default function GestionSucursales({ 
  sucursales, 
  onAgregarSucursal, 
  onActualizarSucursal,
  onCerrar 
}: GestionSucursalesProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    gerente: '',
    estado: 'activa' as 'activa' | 'inactiva'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sucursalEditando) {
      // Actualizar sucursal existente
      const sucursalActualizada: Sucursal = {
        ...sucursalEditando,
        ...formulario
      };
      onActualizarSucursal(sucursalEditando.id, sucursalActualizada);
    } else {
      // Crear nueva sucursal
      const nuevaSucursal: Sucursal = {
        id: Date.now().toString(),
        ...formulario,
        fechaApertura: new Date()
      };
      onAgregarSucursal(nuevaSucursal);
    }
    
    resetFormulario();
  };

  const resetFormulario = () => {
    setFormulario({
      nombre: '',
      codigo: '',
      direccion: '',
      telefono: '',
      ciudad: '',
      gerente: '',
      estado: 'activa'
    });
    setMostrarFormulario(false);
    setSucursalEditando(null);
  };

  const handleEditar = (sucursal: Sucursal) => {
    setSucursalEditando(sucursal);
    setFormulario({
      nombre: sucursal.nombre,
      codigo: sucursal.codigo,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
      ciudad: sucursal.ciudad,
      gerente: sucursal.gerente,
      estado: sucursal.estado
    });
    setMostrarFormulario(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          🏪 Gestión de Sucursales
        </h2>

        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if (mostrarFormulario) resetFormulario();
          }}
          className="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg"
        >
          {mostrarFormulario ? '❌ Cancelar' : '➕ Nueva Sucursal'}
        </button>

        {mostrarFormulario && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {sucursalEditando ? '✏️ Editar Sucursal' : '➕ Agregar Nueva Sucursal'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Nombre de la Sucursal
                </label>
                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: Tegucigalpa Centro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Código
                </label>
                <input
                  type="text"
                  value={formulario.codigo}
                  onChange={(e) => setFormulario({...formulario, codigo: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: SUC-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formulario.ciudad}
                  onChange={(e) => setFormulario({...formulario, ciudad: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: Tegucigalpa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario({...formulario, telefono: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: 2222-3333"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formulario.direccion}
                  onChange={(e) => setFormulario({...formulario, direccion: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: Col. Palmira, Avenida República de Chile"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Gerente
                </label>
                <input
                  type="text"
                  value={formulario.gerente}
                  onChange={(e) => setFormulario({...formulario, gerente: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Estado
                </label>
                <select
                  value={formulario.estado}
                  onChange={(e) => setFormulario({...formulario, estado: e.target.value as 'activa' | 'inactiva'})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-lg shadow-lg"
                >
                  {sucursalEditando ? '💾 Actualizar Sucursal' : '➕ Agregar Sucursal'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Sucursales */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Sucursales Registradas</h3>
          
          {sucursales.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay sucursales registradas</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sucursales.map((sucursal) => (
                <div 
                  key={sucursal.id} 
                  className={`border-2 rounded-xl p-5 ${
                    sucursal.estado === 'activa' 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-900">{sucursal.nombre}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      sucursal.estado === 'activa'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {sucursal.estado === 'activa' ? '✓ Activa' : '✗ Inactiva'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Código:</span>{' '}
                      <span className="text-gray-900 font-semibold">{sucursal.codigo}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Ciudad:</span>{' '}
                      <span className="text-gray-900 font-semibold">{sucursal.ciudad}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Teléfono:</span>{' '}
                      <span className="text-gray-900 font-semibold">{sucursal.telefono}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Dirección:</span>{' '}
                      <span className="text-gray-900 font-semibold">{sucursal.direccion}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Gerente:</span>{' '}
                      <span className="text-gray-900 font-semibold">{sucursal.gerente}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-bold text-gray-800">Apertura:</span>{' '}
                      <span className="text-gray-900 font-semibold">
                        {sucursal.fechaApertura.toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleEditar(sucursal)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-sm"
                  >
                    ✏️ Editar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
