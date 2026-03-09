'use client';

import { useState } from 'react';
import { Producto } from '../types';

interface GestionInventarioProps {
  productos: Producto[];
  onAgregarProducto: (producto: Producto) => void;
  onActualizarStock: (id: string, nuevoStock: number) => void;
}

export default function GestionInventario({ productos, onAgregarProducto, onActualizarStock }: GestionInventarioProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    precio: '',
    stock: '',
    categoria: 'Camisas',
    talla: '',
    color: ''
  });

  const categorias = ['Camisas', 'Pantalones', 'Vestidos', 'Calzado', 'Chaquetas', 'Accesorios', 'Ropa Interior', 'Deportiva'];
  const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', 'Única'];

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarProducto = () => {
    if (!nuevoProducto.codigo || !nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      alert('Todos los campos obligatorios deben ser completados');
      return;
    }

    const producto: Producto = {
      id: Date.now().toString(),
      codigo: nuevoProducto.codigo.toUpperCase(),
      nombre: nuevoProducto.nombre,
      precio: parseFloat(nuevoProducto.precio),
      stockDisponible: parseInt(nuevoProducto.stock),
      categoria: nuevoProducto.categoria,
      talla: nuevoProducto.talla,
      color: nuevoProducto.color
    };

    onAgregarProducto(producto);
    setMostrarModal(false);
    setNuevoProducto({ codigo: '', nombre: '', precio: '', stock: '', categoria: 'Camisas', talla: '', color: '' });
    alert('✓ Producto agregado exitosamente');
  };

  const actualizarStock = () => {
    if (!productoEditar) return;
    const nuevoStock = parseInt(prompt(`Stock actual: ${productoEditar.stockDisponible}\nIngrese nuevo stock:`) || '0');
    if (nuevoStock >= 0) {
      onActualizarStock(productoEditar.id, nuevoStock);
      setMostrarEditar(false);
      setProductoEditar(null);
      alert('✓ Stock actualizado');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-indigo-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📦 Gestión de Inventario</h2>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar producto por código, nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-lg font-medium placeholder:text-gray-400 bg-white"
          />
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold whitespace-nowrap"
          >
            ➕ Agregar Producto
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-bold">Total productos:</span> {productos.length} | 
            <span className="font-bold ml-3">Stock total:</span> {productos.reduce((sum, p) => sum + p.stockDisponible, 0)} unidades
          </p>
        </div>

        {busqueda && (
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-bold">Código</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Producto</th>
                  <th className="px-4 py-2 text-left text-sm font-bold">Categoría</th>
                  <th className="px-4 py-2 text-right text-sm font-bold">Precio</th>
                  <th className="px-4 py-2 text-center text-sm font-bold">Stock</th>
                  <th className="px-4 py-2 text-center text-sm font-bold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-indigo-50">
                    <td className="px-4 py-3 font-mono text-sm">{producto.codigo}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{producto.nombre}</p>
                      <p className="text-xs text-gray-600">
                        {producto.talla && `Talla: ${producto.talla}`} 
                        {producto.color && ` | Color: ${producto.color}`}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">{producto.categoria}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      L {producto.precio.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        producto.stockDisponible > 10 ? 'bg-green-100 text-green-800' :
                        producto.stockDisponible > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {producto.stockDisponible}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setProductoEditar(producto);
                          setMostrarEditar(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm"
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

      {/* Modal Agregar Producto */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">➕ Agregar Nuevo Producto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                <input
                  type="text"
                  value={nuevoProducto.codigo}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, codigo: e.target.value.toUpperCase()})}
                  placeholder="Ej: CAM001"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-lg font-bold bg-white uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                <select
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-lg font-medium bg-white"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                  placeholder="Ej: Camisa Formal Blanca"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-lg font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (L) *</label>
                <input
                  type="number"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                  placeholder="450"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-xl font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Inicial *</label>
                <input
                  type="number"
                  value={nuevoProducto.stock}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
                  placeholder="25"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-xl font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                <select
                  value={nuevoProducto.talla}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, talla: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-lg font-medium bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {tallas.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  value={nuevoProducto.color}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, color: e.target.value})}
                  placeholder="Ej: Blanco, Negro, Azul"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 text-lg font-medium bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={agregarProducto}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold"
              >
                Agregar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Stock */}
      {mostrarEditar && productoEditar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">✏️ Editar Producto</h3>
            
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="font-bold text-gray-900">{productoEditar.nombre}</p>
              <p className="text-sm text-gray-600">Código: {productoEditar.codigo}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                Stock actual: {productoEditar.stockDisponible} unidades
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setMostrarEditar(false);
                  setProductoEditar(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarStock}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold"
              >
                Actualizar Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
