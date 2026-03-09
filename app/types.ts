// Tipos de datos para el sistema
export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  stockDisponible: number;
  categoria: string;
  talla?: string;
  color?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaRegistro: Date;
  totalCompras: number;
  tipoCliente: 'regular' | 'frecuente' | 'vip';
}

export interface Descuento {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: 'porcentaje' | 'monto';
  valor: number;
  activo: boolean;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
  descuento?: number;
}

export interface Factura {
  id: string;
  numero: string;
  fecha: Date;
  cliente?: Cliente;
  items: ItemVenta[];
  subtotal: number;
  descuentoTotal: number;
  impuesto: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  estado: 'pagada' | 'pendiente' | 'anulada';
  cai?: string;
  rangoAutorizado?: string;
  fechaLimiteEmision?: Date;
}

export interface Devolucion {
  id: string;
  numeroFactura: string;
  producto: Producto;
  cantidad: number;
  motivo: string;
  fecha: Date;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
}

export interface ReporteVentas {
  totalVentas: number;
  cantidadFacturas: number;
  promedioVenta: number;
  productoMasVendido: string;
  metodoPagoMasUsado: string;
  ventasPorDia: { fecha: string; total: number }[];
}
