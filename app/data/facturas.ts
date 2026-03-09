import { Factura } from '../types';
import { productosData } from './productos';

// Generar facturas de prueba para los últimos 30 días
const generarFacturasPrueba = (): Factura[] => {
  const facturas: Factura[] = [];
  const metodosPago: ('efectivo' | 'tarjeta' | 'transferencia')[] = ['efectivo', 'tarjeta', 'transferencia'];
  const hoy = new Date();
  
  // Generar 150 facturas de los últimos 30 días
  for (let i = 0; i < 150; i++) {
    const diasAtras = Math.floor(Math.random() * 30);
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - diasAtras);
    fecha.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60), 0, 0);
    
    // Seleccionar productos aleatorios
    const cantidadItems = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < cantidadItems; j++) {
      const producto = productosData[Math.floor(Math.random() * productosData.length)];
      const cantidad = Math.floor(Math.random() * 3) + 1;
      const itemSubtotal = producto.precio * cantidad;
      
      items.push({
        producto,
        cantidad,
        subtotal: itemSubtotal
      });
      
      subtotal += itemSubtotal;
    }
    
    // Aplicar descuento aleatorio (30% de probabilidad)
    const descuentoTotal = Math.random() > 0.7 ? subtotal * 0.1 : 0;
    const subtotalConDescuento = subtotal - descuentoTotal;
    const impuesto = subtotalConDescuento * 0.15;
    const total = subtotalConDescuento + impuesto;
    
    // Método de pago con distribución realista
    let metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    const rand = Math.random();
    if (rand < 0.45) metodoPago = 'efectivo';
    else if (rand < 0.85) metodoPago = 'tarjeta';
    else metodoPago = 'transferencia';
    
    facturas.push({
      id: `FAC-${1000 + i}`,
      numero: `FAC-${String(100000 + i).slice(-6)}`,
      fecha,
      cliente: Math.random() > 0.3 ? {
        id: `CLI-${Math.floor(Math.random() * 50)}`,
        nombre: ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Patricia', 'José', 'Carmen'][Math.floor(Math.random() * 8)],
        apellido: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Ramírez'][Math.floor(Math.random() * 8)],
        identificacion: `0801-${1980 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        telefono: `${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: 'cliente@email.com',
        direccion: 'Tegucigalpa, Honduras',
        fechaRegistro: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        totalCompras: 0,
        tipoCliente: 'regular'
      } : undefined,
      items,
      subtotal,
      descuentoTotal,
      impuesto,
      total,
      metodoPago,
      estado: 'pagada',
      cai: 'A1B2C3-D4E5F6-G7H8I9-J0K1L2-M3N4O5-67',
      rangoAutorizado: '001-001-01-00000001 al 001-001-01-00005000',
      fechaLimiteEmision: new Date('2026-12-31')
    });
  }
  
  // Ordenar por fecha
  return facturas.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
};

export const facturasData = generarFacturasPrueba();
