// Datos mock de descuentos
import { Descuento } from '../types';

export const descuentosData: Descuento[] = [
  {
    id: '1',
    codigo: 'VIP10',
    descripcion: 'Descuento 10% para clientes VIP',
    tipo: 'porcentaje',
    valor: 10,
    activo: true,
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31')
  },
  {
    id: '2',
    codigo: 'PROMO15',
    descripcion: 'Promoción 15% en toda la tienda',
    tipo: 'porcentaje',
    valor: 15,
    activo: true,
    fechaInicio: new Date('2024-03-01'),
    fechaFin: new Date('2024-03-31')
  },
  {
    id: '3',
    codigo: 'NUEVO5',
    descripcion: 'Descuento 5% para nuevos clientes',
    tipo: 'porcentaje',
    valor: 5,
    activo: true,
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31')
  },
  {
    id: '4',
    codigo: 'FIJO200',
    descripcion: 'Descuento fijo de L 200',
    tipo: 'monto',
    valor: 200,
    activo: true,
    fechaInicio: new Date('2024-03-01'),
    fechaFin: new Date('2024-03-31')
  },
  {
    id: '5',
    codigo: 'VERANO20',
    descripcion: 'Descuento 20% temporada de verano',
    tipo: 'porcentaje',
    valor: 20,
    activo: false,
    fechaInicio: new Date('2024-06-01'),
    fechaFin: new Date('2024-08-31')
  }
];
