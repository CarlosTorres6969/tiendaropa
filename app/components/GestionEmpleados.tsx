'use client';

import { useState } from 'react';
import { Empleado, Sucursal } from '../types';

interface GestionEmpleadosProps {
  empleados: Empleado[];
  sucursales: Sucursal[];
  onAgregarEmpleado: (empleado: Empleado) => void;
  onActualizarEmpleado: (id: string, empleado: Empleado) => void;
  onCerrar: () => void;
}

export default function GestionEmpleados({ 
  empleados, 
  sucursales,
  onAgregarEmpleado, 
  onActualizarEmpleado,
  onCerrar 
}: GestionEmpleadosProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<Empleado | null>(null);
  const [filtroSucursal, setFiltroSucursal] = useState<string>('todas');
  const [filtroPuesto, setFiltroPuesto] = useState<string>('todos');
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    identificacion: '',
    telefono: '',
    email: '',
    puesto: 'vendedor' as 'gerente' | 'cajero' | 'vendedor' | 'supervisor',
    sucursalId: '',
    salario: 0,
    estado: 'activo' as 'activo' | 'inactivo',
    usuario: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (empleadoEditando) {
      const empleadoActualizado: Empleado = {
        ...empleadoEditando,
        ...formulario
      };
      onActualizarEmpleado(empleadoEditando.id, empleadoActualizado);
    } else {
      const nuevoEmpleado: Empleado = {
        id: Date.now().toString(),
        ...formulario,
        fechaContratacion: new Date()
      };
      onAgregarEmpleado(nuevoEmpleado);
    }
    
    resetFormulario();
  };

  const resetFormulario = () => {
    setFormulario({
      nombre: '',
      apellido: '',
      identificacion: '',
      telefono: '',
      email: '',
      puesto: 'vendedor',
      sucursalId: '',
      salario: 0,
      estado: 'activo',
      usuario: '',
      password: ''
    });
    setMostrarFormulario(false);
    setEmpleadoEditando(null);
  };

  const handleEditar = (empleado: Empleado) => {
    setEmpleadoEditando(empleado);
    setFormulario({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      identificacion: empleado.identificacion,
      telefono: empleado.telefono,
      email: empleado.email,
      puesto: empleado.puesto,
      sucursalId: empleado.sucursalId,
      salario: empleado.salario,
      estado: empleado.estado,
      usuario: empleado.usuario || '',
      password: empleado.password || ''
    });
    setMostrarFormulario(true);
  };

  const empleadosFiltrados = empleados.filter(emp => {
    const cumpleSucursal = filtroSucursal === 'todas' || emp.sucursalId === filtroSucursal;
    const cumplePuesto = filtroPuesto === 'todos' || emp.puesto === filtroPuesto;
    return cumpleSucursal && cumplePuesto;
  });

  const getSucursalNombre = (sucursalId: string) => {
    return sucursales.find(s => s.id === sucursalId)?.nombre || 'Sin asignar';
  };

  const getPuestoColor = (puesto: string) => {
    switch(puesto) {
      case 'gerente': return 'bg-purple-600';
      case 'supervisor': return 'bg-blue-600';
      case 'cajero': return 'bg-green-600';
      case 'vendedor': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          👥 Gestión de Empleados
        </h2>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              if (mostrarFormulario) resetFormulario();
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg"
          >
            {mostrarFormulario ? '❌ Cancelar' : '➕ Nuevo Empleado'}
          </button>

          <div className="flex gap-3">
            <select
              value={filtroSucursal}
              onChange={(e) => setFiltroSucursal(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold"
            >
              <option value="todas">Todas las Sucursales</option>
              {sucursales.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>

            <select
              value={filtroPuesto}
              onChange={(e) => setFiltroPuesto(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold"
            >
              <option value="todos">Todos los Puestos</option>
              <option value="gerente">Gerente</option>
              <option value="supervisor">Supervisor</option>
              <option value="cajero">Cajero</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
        </div>

        {mostrarFormulario && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {empleadoEditando ? '✏️ Editar Empleado' : '➕ Agregar Nuevo Empleado'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({...formulario, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Apellido</label>
                <input
                  type="text"
                  value={formulario.apellido}
                  onChange={(e) => setFormulario({...formulario, apellido: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Identificación</label>
                <input
                  type="text"
                  value={formulario.identificacion}
                  onChange={(e) => setFormulario({...formulario, identificacion: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  placeholder="0801-1990-12345"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formulario.telefono}
                  onChange={(e) => setFormulario({...formulario, telefono: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Puesto</label>
                <select
                  value={formulario.puesto}
                  onChange={(e) => setFormulario({...formulario, puesto: e.target.value as any})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="cajero">Cajero</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="gerente">Gerente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Sucursal</label>
                <select
                  value={formulario.sucursalId}
                  onChange={(e) => setFormulario({...formulario, sucursalId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {sucursales.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Salario (L)</label>
                <input
                  type="number"
                  value={formulario.salario}
                  onChange={(e) => setFormulario({...formulario, salario: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Estado</label>
                <select
                  value={formulario.estado}
                  onChange={(e) => setFormulario({...formulario, estado: e.target.value as 'activo' | 'inactivo'})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Usuario (opcional)</label>
                <input
                  type="text"
                  value={formulario.usuario}
                  onChange={(e) => setFormulario({...formulario, usuario: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Contraseña (opcional)</label>
                <input
                  type="password"
                  value={formulario.password}
                  onChange={(e) => setFormulario({...formulario, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 font-semibold"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold text-lg shadow-lg"
                >
                  {empleadoEditando ? '💾 Actualizar Empleado' : '➕ Agregar Empleado'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Total Empleados</p>
            <p className="text-3xl font-bold">{empleados.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Activos</p>
            <p className="text-3xl font-bold">{empleados.filter(e => e.estado === 'activo').length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Gerentes</p>
            <p className="text-3xl font-bold">{empleados.filter(e => e.puesto === 'gerente').length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90">Cajeros</p>
            <p className="text-3xl font-bold">{empleados.filter(e => e.puesto === 'cajero').length}</p>
          </div>
        </div>

        {/* Lista de Empleados */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📋 Empleados Registrados ({empleadosFiltrados.length})
          </h3>
          
          {empleadosFiltrados.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay empleados que coincidan con los filtros</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Identificación</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Puesto</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-white border border-blue-700">Sucursal</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-white border border-blue-700">Salario</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-white border border-blue-700">Estado</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-white border border-blue-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {empleadosFiltrados.map((empleado) => (
                    <tr key={empleado.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 border border-gray-300">
                        <div>
                          <p className="font-bold text-gray-900">{empleado.nombre} {empleado.apellido}</p>
                          <p className="text-sm text-gray-700">{empleado.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 border border-gray-300">
                        {empleado.identificacion}
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        <span className={`px-3 py-1 rounded-lg text-white text-sm font-bold capitalize ${getPuestoColor(empleado.puesto)}`}>
                          {empleado.puesto}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 border border-gray-300">
                        {getSucursalNombre(empleado.sucursalId)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 border border-gray-300">
                        L {empleado.salario.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center border border-gray-300">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          empleado.estado === 'activo' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {empleado.estado === 'activo' ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center border border-gray-300">
                        <button
                          onClick={() => handleEditar(empleado)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold text-sm"
                        >
                          ✏️ Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
