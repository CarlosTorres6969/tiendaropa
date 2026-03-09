'use client';

import { useState } from 'react';
import { Producto, ItemVenta } from '../types';

interface VistaClienteProps {
  productos: Producto[];
  nombreUsuario: string;
  onCerrarSesion: () => void;
}

export default function VistaCliente({ productos, nombreUsuario, onCerrarSesion }: VistaClienteProps) {
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'paypal' | 'transferencia'>('tarjeta');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [emailPaypal, setEmailPaypal] = useState('');
  const [numeroTransferencia, setNumeroTransferencia] = useState('');

  const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))];

  const productosFiltrados = productos.filter(p => {
    const matchCategoria = categoriaFiltro === 'Todas' || p.categoria === categoriaFiltro;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.codigo.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda && p.stockDisponible > 0;
  });

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      if (itemExistente.cantidad < producto.stockDisponible) {
        setCarrito(carrito.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * producto.precio }
            : item
        ));
      } else {
        alert('No hay más stock disponible');
      }
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        subtotal: producto.precio
      }]);
    }
  };

  const eliminarDelCarrito = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    const item = carrito[index];
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(index);
    } else if (nuevaCantidad <= item.producto.stockDisponible) {
      setCarrito(carrito.map((item, i) =>
        i === index
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.producto.precio }
          : item
      ));
    } else {
      alert('Stock insuficiente');
    }
  };

  const calcularTotal = () => {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const isv = subtotal * 0.15;
    return { subtotal, isv, total: subtotal + isv };
  };

  const finalizarCompra = () => {
    setMostrarConfirmacion(true);
    setTimeout(() => {
      setCarrito([]);
      setMostrarConfirmacion(false);
      setMostrarMetodoPago(false);
      alert('¡Compra realizada exitosamente! Gracias por su preferencia.');
    }, 2000);
  };

  const { subtotal, isv, total } = calcularTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">👔 Tienda de Ropa</h1>
              <p className="text-blue-100">Bienvenido, {nombreUsuario}</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setMostrarCarrito(!mostrarCarrito)}
                className="relative bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all font-bold shadow-lg"
              >
                🛒 Carrito
                {carrito.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                    {carrito.length}
                  </span>
                )}
              </button>
              <button
                onClick={onCerrarSesion}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all font-bold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o código..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg bg-white"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 h-48 flex items-center justify-center">
                <span className="text-8xl">👔</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{producto.nombre}</h3>
                <p className="text-sm text-gray-600 mb-2">Código: {producto.codigo}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">
                    {producto.categoria}
                  </span>
                  <span className="text-xs text-gray-600">
                    {producto.talla && `Talla: ${producto.talla}`}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {producto.color && `Color: ${producto.color}`}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    L {producto.precio.toLocaleString()}
                  </span>
                  <span className={`text-sm font-bold ${
                    producto.stockDisponible > 10 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    Stock: {producto.stockDisponible}
                  </span>
                </div>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Modal Carrito */}
      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🛒 Mi Carrito</h2>
              <button
                onClick={() => setMostrarCarrito(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {carrito.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">El carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {carrito.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.producto.nombre}</p>
                        <p className="text-sm text-gray-700 font-semibold">L {item.producto.precio.toLocaleString()} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 w-8 h-8 rounded font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg text-gray-900">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 w-8 h-8 rounded font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">L {item.subtotal.toLocaleString()}</p>
                        <button
                          onClick={() => eliminarDelCarrito(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-800">Subtotal:</span>
                    <span className="font-bold text-gray-900">L {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-800">ISV (15%):</span>
                    <span className="font-bold text-gray-900">L {isv.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t-2">
                    <span>TOTAL:</span>
                    <span className="text-green-600">L {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setMostrarMetodoPago(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-lg"
                >
                  💳 Proceder al Pago
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h3>
            <p className="text-gray-600">Procesando su pedido...</p>
          </div>
        </div>
      )}

      {/* Modal Método de Pago */}
      {mostrarMetodoPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">💳 Método de Pago</h2>
              <button
                onClick={() => setMostrarMetodoPago(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700 mb-1">Total a Pagar:</p>
              <p className="text-3xl font-bold text-green-600">L {total.toLocaleString()}</p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">💳 Tarjeta de Crédito/Débito</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="paypal"
                  checked={metodoPago === 'paypal'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">🅿️ PayPal</p>
                  <p className="text-sm text-gray-600">Pago seguro con PayPal</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3 w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">🏦 Transferencia Bancaria</p>
                  <p className="text-sm text-gray-600">Transferencia en línea</p>
                </div>
              </label>
            </div>

            {metodoPago === 'tarjeta' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Tarjeta *
                  </label>
                  <input
                    type="text"
                    value={numeroTarjeta}
                    onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha Exp. *
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre en la Tarjeta *
                  </label>
                  <input
                    type="text"
                    placeholder="JUAN PEREZ"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white uppercase"
                  />
                </div>
              </div>
            )}

            {metodoPago === 'paypal' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de PayPal *
                </label>
                <input
                  type="email"
                  value={emailPaypal}
                  onChange={(e) => setEmailPaypal(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Serás redirigido a PayPal para completar el pago
                </p>
              </div>
            )}

            {metodoPago === 'transferencia' && (
              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-bold text-gray-800 mb-2">Datos Bancarios:</p>
                  <p className="text-sm text-gray-700">Banco: BAC Honduras</p>
                  <p className="text-sm text-gray-700">Cuenta: 1234567890</p>
                  <p className="text-sm text-gray-700">A nombre de: Tienda de Ropa</p>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Referencia *
                </label>
                <input
                  type="text"
                  value={numeroTransferencia}
                  onChange={(e) => setNumeroTransferencia(e.target.value)}
                  placeholder="Ingrese número de referencia"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 text-lg font-medium bg-white"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarMetodoPago(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={finalizarCompra}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold"
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
