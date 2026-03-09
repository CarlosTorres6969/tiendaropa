import { Sucursal } from '../types';

export const sucursalesData: Sucursal[] = [
  {
    id: '1',
    nombre: 'Tegucigalpa Centro',
    codigo: 'SUC-001',
    direccion: 'Col. Palmira, Avenida República de Chile',
    telefono: '2222-3333',
    ciudad: 'Tegucigalpa',
    gerente: 'María González',
    fechaApertura: new Date('2020-01-15'),
    estado: 'activa'
  },
  {
    id: '2',
    nombre: 'San Pedro Sula',
    codigo: 'SUC-002',
    direccion: 'Barrio Los Andes, 5ta Avenida',
    telefono: '2550-4444',
    ciudad: 'San Pedro Sula',
    gerente: 'Carlos Martínez',
    fechaApertura: new Date('2021-03-20'),
    estado: 'activa'
  },
  {
    id: '3',
    nombre: 'La Ceiba',
    codigo: 'SUC-003',
    direccion: 'Barrio La Isla, Calle Principal',
    telefono: '2440-5555',
    ciudad: 'La Ceiba',
    gerente: 'Ana Rodríguez',
    fechaApertura: new Date('2022-06-10'),
    estado: 'activa'
  }
];
