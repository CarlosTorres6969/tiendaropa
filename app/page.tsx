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
import GestionSucursales from './components/GestionSucursales';
import GestionEmpleados from './components/GestionEmpleados';
import CierreDiario from './components/CierreDiario';
import { Producto, ItemVenta, Factura, Devolucion, Cliente, Descuento, Sucursal, Empleado } from './types';
import { productosData } from './data/productos';
import { sucursalesData } from './data/sucursales';
import { empleadosData } from './data/empleados';
import { facturasData } from './data/facturas';

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
  const [facturas, setFacturas] = useState<Factura[]>(facturasData); // Inicializar con datos de prueba
  const [sucursales, setSucursales] = useState<Sucursal[]>(sucursalesData);
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosData);
  const [mostrarReportes, setMostrarReportes] = useState(false);
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [mostrarSucursales, setMostrarSucursales] = useState(false);
  const [mostrarEmpleados, setMostrarEmpleados] = useState(false);
  const [mostrarCierreDiario, setMostrarCierreDiario] = useState(false);

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
    setMostrarSucursales(false);
    setMostrarEmpleados(false);
    setMostrarCierreDiario(false);
  };

  const agregarSucursal = (sucursal: Sucursal) => {
    setSucursales([...sucursales, sucursal]);
  };

  const actualizarSucursal = (id: string, sucursalActualizada: Sucursal) => {
    setSucursales(sucursales.map(s => s.id === id ? sucursalActualizada : s));
  };

  const agregarEmpleado = (empleado: Empleado) => {
    setEmpleados([...empleados, empleado]);
  };

  const actualizarEmpleado = (id: string, empleadoActualizado: Empleado) => {
    setEmpleados(empleados.map(e => e.id === id ? empleadoActualizado : e));
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

        <div className="flex justify-end gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setMostrarDashboard(!mostrarDashboard)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            📊 {mostrarDashboard ? 'Ocultar' : 'Ver'} Dashboard
          </button>
          <button
            onClick={() => setMostrarCierreDiario(!mostrarCierreDiario)}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            💰 {mostrarCierreDiario ? 'Ocultar' : 'Ver'} Cierre Diario
          </button>
          <button
            onClick={() => setMostrarSucursales(!mostrarSucursales)}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            🏪 {mostrarSucursales ? 'Ocultar' : 'Gestionar'} Sucursales
          </button>
          <button
            onClick={() => setMostrarEmpleados(!mostrarEmpleados)}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            👥 {mostrarEmpleados ? 'Ocultar' : 'Gestionar'} Empleados
          </button>
          <button
            onClick={() => setMostrarInventario(!mostrarInventario)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            📦 {mostrarInventario ? 'Ocultar' : 'Gestionar'} Inventario
          </button>
          <button
            onClick={() => setMostrarReportes(!mostrarReportes)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-bold shadow-lg"
          >
            📈 {mostrarReportes ? 'Ocultar' : 'Ver'} Reportes
          </button>
          <DevolucionProducto onDevolucion={manejarDevolucion} />
        </div>

        {mostrarDashboard && <Dashboard facturas={facturas} />}

        {mostrarCierreDiario && (
          <CierreDiario 
            facturas={facturas}
            onCerrar={() => setMostrarCierreDiario(false)}
          />
        )}

        {mostrarSucursales && (
          <GestionSucursales 
            sucursales={sucursales}
            onAgregarSucursal={agregarSucursal}
            onActualizarSucursal={actualizarSucursal}
            onCerrar={() => setMostrarSucursales(false)}
          />
        )}

        {mostrarEmpleados && (
          <GestionEmpleados 
            empleados={empleados}
            sucursales={sucursales}
            onAgregarEmpleado={agregarEmpleado}
            onActualizarEmpleado={actualizarEmpleado}
            onCerrar={() => setMostrarEmpleados(false)}
          />
        )}

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
