'use client';

import { useState } from 'react';
import Login from './components/Login';
import VistaCliente from './components/VistaCliente';
import VistaCajero from './components/VistaCajero';
import Dashboard from './components/Dashboard';
import BuscarPrenda from './components/BuscarPrenda';
import AgregarProducto from './components/AgregarProducto';
import ListaVenta from './components/ListaVenta';
import ProcesarPago from './components/ProcesarPago';
import GenerarFactura from './components/GenerarFactura';
import DevolucionProducto from './components/DevolucionProducto';
import GestionClientes from './components/GestionClientes';
import AplicarDescuento from './components/AplicarDescuento';
import Reportes from './components/Reportes';
import GestionInventario from './components/GestionInventario';
import { Producto, ItemVenta, Factura, Devolucion, Cliente, Descuento } from './types';
import { productosData } from './data/productos';

export default function Home() {
  const [usuarioActual, setUsuarioActual] = useState<{ rol: 'cliente' | 'admin' | 'cajero' | null; nombre: string }>({ 
    rol: null, 
    nombre: '' 
  });
  const [productos, setProductos] = useState<Producto[]>(productosData);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);
  const [facturaGenerada, setFacturaGenerada] = useState<Factura | null>(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [descuentoAplicado, setDescuentoAplicado] = useState<Descuento | null>(null);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [mostrarReportes, setMostrarReportes] = useState(false);
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);

  const handleLogin = (rol: 'cliente' | 'admin' | 'cajero', nombre: string) => {
    setUsuarioActual({ rol, nombre });
  };

  const handleCerrarSesion = () => {
    setUsuarioActual({ rol: null, nombre: '' });
    setItemsVenta([]);
    setFacturaGenerada(null);
    setClienteSeleccionado(null);
    setDescuentoAplicado(null);
    setMostrarReportes(false);
    setMostrarInventario(false);
  };

  const agregarProductoInventario = (producto: Producto) => {
    setProductos([...productos, producto]);
  };

  const actualizarStockProducto = (id: string, nuevoStock: number) => {
    setProductos(productos.map(p => p.id === id ? {...p, stockDisponible: nuevoStock} : p));
  };

  const agregarItem = (item: ItemVenta) => {
    setItemsVenta([...itemsVenta, item]);
    setProductos(productos.map(p => 
      p.id === item.producto.id 
        ? {...p, stockDisponible: p.stockDisponible - item.cantidad}
        : p
    ));
  };

  const eliminarItem = (index: number) => {
    const item = itemsVenta[index];
    setProductos(productos.map(p => 
      p.id === item.producto.id 
        ? {...p, stockDisponible: p.stockDisponible + item.cantidad}
        : p
    ));
    setItemsVenta(itemsVenta.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    const subtotal = itemsVenta.reduce((sum, item) => sum + item.subtotal, 0);
    
    let descuentoTotal = 0;
    if (descuentoAplicado) {
      if (descuentoAplicado.tipo === 'porcentaje') {
        descuentoTotal = subtotal * (descuentoAplicado.valor / 100);
      } else {
        descuentoTotal = descuentoAplicado.valor;
      }
    }
    
    const subtotalConDescuento = subtotal - descuentoTotal;
    const impuesto = subtotalConDescuento * 0.15;
    const total = subtotalConDescuento + impuesto;
    
    return { subtotal, descuentoTotal, impuesto, total };
  };

  const procesarPago = (metodoPago: 'efectivo' | 'tarjeta' | 'transferencia') => {
    const { subtotal, descuentoTotal, impuesto, total } = calcularTotales();
    
    const factura: Factura = {
      id: Date.now().toString(),
      numero: `FAC-${Date.now().toString().slice(-6)}`,
      fecha: new Date(),
      cliente: clienteSeleccionado || undefined,
      items: itemsVenta,
      subtotal,
      descuentoTotal,
      impuesto,
      total,
      metodoPago,
      estado: 'pagada',
      cai: 'A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-67',
      rangoAutorizado: '001-001-01-00000001 al 001-001-01-00005000',
      fechaLimiteEmision: new Date('2026-12-31')
    };

    setFacturaGenerada(factura);
    setFacturas([...facturas, factura]);
  };

  const nuevaVenta = () => {
    setItemsVenta([]);
    setProductoSeleccionado(null);
    setFacturaGenerada(null);
    setClienteSeleccionado(null);
    setDescuentoAplicado(null);
  };

  const manejarDevolucion = (devolucion: Devolucion) => {
    console.log('Devolución registrada:', devolucion);
    alert(`Devolución registrada exitosamente.\nNúmero de solicitud: ${devolucion.id}`);
  };

  const manejarVentaCajero = (items: ItemVenta[], cliente: Cliente | null, descuento: Descuento | null, metodoPago: string) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    let descuentoTotal = 0;
    if (descuento) {
      if (descuento.tipo === 'porcentaje') {
        descuentoTotal = subtotal * (descuento.valor / 100);
      } else {
        descuentoTotal = descuento.valor;
      }
    }
    
    const subtotalConDescuento = subtotal - descuentoTotal;
    const impuesto = subtotalConDescuento * 0.15;
    const total = subtotalConDescuento + impuesto;
    
    const factura: Factura = {
      id: Date.now().toString(),
      numero: `FAC-${Date.now().toString().slice(-6)}`,
      fecha: new Date(),
      cliente: cliente || undefined,
      items,
      subtotal,
      descuentoTotal,
      impuesto,
      total,
      metodoPago: metodoPago as any,
      estado: 'pagada',
      cai: 'A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-67',
      rangoAutorizado: '001-001-01-00000001 al 001-001-01-00005000',
      fechaLimiteEmision: new Date('2026-12-31')
    };

    setFacturas([...facturas, factura]);
    
    items.forEach(item => {
      setProductos(productos.map(p => 
        p.id === item.producto.id 
          ? {...p, stockDisponible: p.stockDisponible - item.cantidad}
          : p
      ));
    });
  };

  if (!usuarioActual.rol) {
    return <Login onLogin={handleLogin} />;
  }

  if (usuarioActual.rol === 'cliente') {
    return (
      <VistaCliente 
        productos={productos}
        nombreUsuario={usuarioActual.nombre}
        onCerrarSesion={handleCerrarSesion}
      />
    );
  }

  if (usuarioActual.rol === 'cajero') {
    return (
      <VistaCajero 
        productos={productos}
        nombreUsuario={usuarioActual.nombre}
        onCerrarSesion={handleCerrarSesion}
        onVentaRealizada={manejarVentaCajero}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                👔 Sistema de Facturación - Tienda de Ropa
              </h1>
              <p className="text-blue-100 text-lg">Panel de Administración - {usuarioActual.nombre}</p>
            </div>
            <button
              onClick={handleCerrarSesion}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all font-bold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setMostrarDashboard(!mostrarDashboard)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 font-bold shadow-lg text-lg"
          >
            📊 {mostrarDashboard ? 'Ocultar' : 'Ver'} Dashboard
          </button>
          <button
            onClick={() => setMostrarInventario(!mostrarInventario)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold shadow-lg text-lg"
          >
            📦 {mostrarInventario ? 'Ocultar' : 'Gestionar'} Inventario
          </button>
          <button
            onClick={() => setMostrarReportes(!mostrarReportes)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-bold shadow-lg text-lg"
          >
            📈 {mostrarReportes ? 'Ocultar' : 'Ver'} Reportes
          </button>
          <DevolucionProducto onDevolucion={manejarDevolucion} />
        </div>

        {mostrarDashboard && <Dashboard facturas={facturas} />}

        {mostrarInventario && (
          <GestionInventario 
            productos={productos}
            onAgregarProducto={agregarProductoInventario}
            onActualizarStock={actualizarStockProducto}
          />
        )}

        {mostrarReportes && <Reportes facturas={facturas} onCerrar={() => setMostrarReportes(false)} />}

        {!facturaGenerada ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <GestionClientes 
                onSeleccionarCliente={setClienteSeleccionado}
                clienteSeleccionado={clienteSeleccionado}
              />
              <BuscarPrenda onSeleccionar={setProductoSeleccionado} productos={productos} />
              <AgregarProducto 
                productoSeleccionado={productoSeleccionado}
                onAgregar={agregarItem}
              />
            </div>

            <div>
              <AplicarDescuento 
                onAplicarDescuento={setDescuentoAplicado}
                descuentoAplicado={descuentoAplicado}
              />
              <ListaVenta 
                items={itemsVenta} 
                onEliminar={eliminarItem}
                descuentoAplicado={descuentoAplicado}
              />
              <ProcesarPago 
                total={calcularTotales().total}
                onPagar={procesarPago}
                deshabilitado={itemsVenta.length === 0}
              />
            </div>
          </div>
        ) : (
          <GenerarFactura factura={facturaGenerada} onNuevaVenta={nuevaVenta} />
        )}
      </div>
    </div>
  );
}
