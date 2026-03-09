'use client';

import { useState } from 'react';
import { Cliente } from '../types';
import { clientesData } from '../data/clientes';

interface GestionClientesProps {
  onSeleccionarCliente: (cliente: Cliente | null) => void;
  clienteSeleccionado: Cliente | null;
}

export default function GestionClientes({ onSeleccionarCliente, clienteSeleccionado }: GestionClientesProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [clientes] = useState<Cliente[]>(clientesData);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    identificacion: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.identificacion.includes(busqueda)
  );

  const agregarCliente = () => {
    if (!nuevoCliente.nombre || !nuevoCliente.identificacion) {
      alert('Nombre e identificación son obligatorios');
      return;
    }
    alert('Cliente registrado exitosamente');
    setMostrarModal(false);
    setNuevoCliente({ nombre: '', apellido: '', identificacion: '', telefono: '', email: '', direccion: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">👤 Gestión de Clientes</h2>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar cliente por nombre o identificación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
          />
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold"
          >
            ➕ Nuevo
          </button>
        </div>

        {clienteSeleccionado && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                </p>
                <p className="text-sm text-gray-700">ID: {clienteSeleccionado.identificacion}</p>
                <p className="text-sm text-gray-700">Tel: {clienteSeleccionado.telefono}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                  clienteSeleccionado.tipoCliente === 'vip' ? 'bg-yellow-400 text-gray-900' :
                  clienteSeleccionado.tipoCliente === 'frecuente' ? 'bg-blue-400 text-white' :
                  'bg-gray-400 text-white'
                }`}>
                  {clienteSeleccionado.tipoCliente.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => onSeleccionarCliente(null)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ✕ Quitar
              </button>
            </div>
          </div>
        )}

        {busqueda && !clienteSeleccionado && (
          <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-lg">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => {
                  onSeleccionarCliente(cliente);
                  setBusqueda('');
                }}
                className="p-4 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <p className="font-bold text-gray-900">
                  {cliente.nombre} {cliente.apellido}
                </p>
                <p className="text-sm text-gray-600">ID: {cliente.identificacion}</p>
                <p className="text-sm text-gray-600">Compras: L {cliente.totalCompras.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Registrar Nuevo Cliente</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={nuevoCliente.nombre}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                <input
                  type="text"
                  value={nuevoCliente.apellido}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Identificación *</label>
                <input
                  type="text"
                  value={nuevoCliente.identificacion}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, identificacion: e.target.value})}
                  placeholder="0801-1990-12345"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                  placeholder="9876-5432"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={nuevoCliente.email}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <textarea
                  value={nuevoCliente.direccion}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 text-base bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarCliente}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
