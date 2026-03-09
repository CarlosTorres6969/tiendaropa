'use client';

import { useState } from 'react';
import { Producto, ItemVenta, Cliente, Descuento } from '../types';
import { clientesData } from '../data/clientes';
import { descuentosData } from '../data/descuentos';

interface VistaCajeroProps {
  productos: Producto[];
  nombreUsuario: string;
  onCerrarSesion: () => void;
  onVentaRealizada: (items: ItemVenta[], cliente: Cliente | null, descuento: Descuento | null, metodoPago: string) => void;
}

export default function VistaCajero({ productos, nombreUsuario, onCerrarSesion, onVentaRealizada }: VistaCajeroProps) {
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState<ItemVenta[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [descuentoAplicado, setDescuentoAplicado] = useState<Descuento | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [montoPagado, setMontoPagado] = useState('');

  const productosFiltrados = productos.filter(p =>
    (p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.toLowerCase())) &&
    p.stockDisponible > 0
  ).slice(0, 8);

  const clientesFiltrados = clientesData.filter(c =>
    c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.apellido.toLowerCase().includes(busquedaCliente.toLowerCase()) ||
    c.identificacion.includes(busquedaCliente)
  );

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
        alert('Stock insuficiente');
      }
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        subtotal: producto.precio
      }]);
    }
    setBusqueda('');
  };

  const actualizarCantidad = (index: number, nuevaCantidad: number) => {
    const item = carrito[index];
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter((_, i) => i !== index));
    } else if (nuevaCantidad <= item.producto.stockDisponible) {
      setCarrito(carrito.map((item, i) =>
        i === index
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.producto.precio }
          : item
      ));
    }
  };

  const aplicarDescuento = () => {
    const descuento = descuentosData.find(d => d.codigo.toUpperCase() === codigoDescuento.toUpperCase() && d.activo);
    if (descuento) {
      setDescuentoAplicado(descuento);
      setCodigoDescuento('');
      alert('✓ Descuento aplicado');
    } else {
      alert('❌ Código inválido');
    }
  };

  const calcularTotales = () => {
    const subtotal = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    let descuentoTotal = 0;
    
    if (descuentoAplicado) {
      if (descuentoAplicado.tipo === 'porcentaje') {
        descuentoTotal = subtotal * (descuentoAplicado.valor / 100);
      } else {
        descuentoTotal = descuentoAplicado.valor;
      }
    }
    
    const subtotalConDescuento = subtotal - descuentoTotal;
    const isv = subtotalConDescuento * 0.15;
    const total = subtotalConDescuento + isv;
    
    return { subtotal, descuentoTotal, isv, total };
  };

  const procesarVenta = () => {
    const { total } = calcularTotales();
    
    if (metodoPago === 'efectivo') {
      const pago = parseFloat(montoPagado);
      if (pago < total) {
        alert('Monto insuficiente');
        return;
      }
    }

    onVentaRealizada(carrito, clienteSeleccionado, descuentoAplicado, metodoPago);
    
    // Limpiar todo
    setCarrito([]);
    setClienteSeleccionado(null);
    setDescuentoAplicado(null);
    setMostrarPago(false);
    setMontoPagado('');
    alert('✓ Venta procesada exitosamente');
  };

  const { subtotal, descuentoTotal, isv, total } = calcularTotales();
  const cambio = metodoPago === 'efectivo' && montoPagado ? parseFloat(montoPagado) - total : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header POS */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🏪 Punto de Venta - Tienda Física</h1>
              <p className="text-green-100">Cajero: {nombreUsuario}</p>
            </div>
            <button
              onClick={onCerrarSesion}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Panel Izquierdo - Búsqueda y Productos */}
        <div className="col-span-7 space-y-4">
          {/* Búsqueda de Productos */}
          <div className="bg-white rounded-lg shadow p-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="🔍 Buscar producto por código o nombre..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 text-xl font-bold bg-white"
              autoFocus
            />
          </div>

          {/* Grid de Productos */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto" style={{height: 'calc(100vh - 250px)'}}>
            <div className="grid grid-cols-4 gap-3">
              {productosFiltrados.map((producto) => (
                <button
                  key={producto.id}
                  onClick={() => agregarAlCarrito(producto)}
                  className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-lg transition-all transform hover:scale-105 text-left"
                >
                  <p className="font-bold text-sm mb-1 truncate">{producto.nombre}</p>
                  <p className="text-xs opacity-90 mb-2">{producto.codigo}</p>
                  <p className="text-lg font-bold">L {producto.precio.toLocaleString()}</p>
                  <p className="text-xs">Stock: {producto.stockDisponible}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Derecho - Carrito y Totales */}
        <div className="col-span-5 space-y-4">
          {/* Cliente */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">👤 Cliente</h3>
            {clienteSeleccionado ? (
              <div className="bg-purple-50 p-3 rounded-lg flex justify-between items-center border-2 border-purple-300">
                <div>
                  <p className="font-bold text-gray-900">{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</p>
                  <p className="text-sm text-gray-800 font-medium">{clienteSeleccionado.identificacion}</p>
                </div>
                <button
                  onClick={() => setClienteSeleccionado(null)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-white mb-2"
                />
                {busquedaCliente && (
                  <div className="max-h-32 overflow-y-auto border rounded">
                    {clientesFiltrados.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setClienteSeleccionado(c);
                          setBusquedaCliente('');
                        }}
                        className="w-full text-left p-2 hover:bg-gray-100 border-b"
                      >
                        <p className="font-bold text-sm text-gray-900">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-gray-800 font-medium">{c.identificacion}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Descuento */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-gray-800 mb-2">🎟️ Descuento</h3>
            {descuentoAplicado ? (
              <div className="bg-yellow-50 p-3 rounded-lg flex justify-between items-center border-2 border-yellow-400">
                <div>
                  <p className="font-bold text-gray-900">{descuentoAplicado.codigo}</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {descuentoAplicado.tipo === 'porcentaje' ? `${descuentoAplicado.valor}%` : `L ${descuentoAplicado.valor}`}
                  </p>
                </div>
                <button
                  onClick={() => setDescuentoAplicado(null)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codigoDescuento}
                  onChange={(e) => setCodigoDescuento(e.target.value.toUpperCase())}
                  placeholder="Código"
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-gray-900 font-bold bg-white uppercase"
                />
                <button
                  onClick={aplicarDescuento}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>

          {/* Carrito */}
          <div className="bg-white rounded-lg shadow p-4 overflow-y-auto" style={{height: '300px'}}>
            <h3 className="font-bold text-gray-800 mb-3">🛒 Carrito ({carrito.length})</h3>
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Carrito vacío</p>
            ) : (
              <div className="space-y-2">
                {carrito.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{item.producto.nombre}</p>
                      <p className="text-xs text-gray-800 font-semibold">L {item.producto.precio.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                        className="bg-gray-300 hover:bg-gray-400 w-7 h-7 rounded font-bold text-gray-900"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                        className="bg-gray-300 hover:bg-gray-400 w-7 h-7 rounded font-bold text-gray-900"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 w-20 text-right">L {item.subtotal.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totales */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800">Subtotal:</span>
                <span className="font-bold text-gray-900">L {subtotal.toLocaleString()}</span>
              </div>
              {descuentoTotal > 0 && (
                <div className="flex justify-between text-lg text-orange-600">
                  <span className="font-semibold">Descuento:</span>
                  <span className="font-bold">- L {descuentoTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-800">ISV (15%):</span>
                <span className="font-bold text-gray-900">L {isv.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-3xl font-bold text-green-600 pt-2 border-t-2">
                <span>TOTAL:</span>
                <span>L {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setMostrarPago(true)}
              disabled={carrito.length === 0}
              className={`w-full mt-4 py-4 rounded-lg font-bold text-xl ${
                carrito.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              💳 COBRAR
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pago */}
      {mostrarPago && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">💳 Procesar Pago</h2>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-300">
              <p className="text-3xl font-bold text-green-700">L {total.toLocaleString()}</p>
            </div>

            <div className="space-y-3 mb-4">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="metodo"
                  value="efectivo"
                  checked={metodoPago === 'efectivo'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3"
                />
                <span className="font-bold text-gray-900">💵 Efectivo</span>
              </label>
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="metodo"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3"
                />
                <span className="font-bold text-gray-900">💳 Tarjeta</span>
              </label>
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="metodo"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={(e) => setMetodoPago(e.target.value as any)}
                  className="mr-3"
                />
                <span className="font-bold text-gray-900">🏦 Transferencia</span>
              </label>
            </div>

            {metodoPago === 'efectivo' && (
              <div className="mb-4">
                <label className="block font-bold mb-2 text-gray-900">Monto Recibido:</label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 text-2xl font-bold bg-white"
                  autoFocus
                />
                {cambio > 0 && (
                  <div className="mt-3 bg-green-100 p-3 rounded-lg border-2 border-green-400">
                    <p className="text-sm text-gray-800 font-semibold">Cambio:</p>
                    <p className="text-2xl font-bold text-gray-900">L {cambio.toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarPago(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={procesarVenta}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
