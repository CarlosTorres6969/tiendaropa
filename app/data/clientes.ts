// Datos mock de clientes
import { Cliente } from '../types';

export const clientesData: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    identificacion: '0801-1990-12345',
    telefono: '9876-5432',
    email: 'juan.perez@email.com',
    direccion: 'Col. Palmira, Tegucigalpa',
    fechaRegistro: new Date('2024-01-15'),
    totalCompras: 15000,
    tipoCliente: 'vip'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    identificacion: '0801-1985-67890',
    telefono: '9988-7766',
    email: 'maria.garcia@email.com',
    direccion: 'Barrio La Granja, San Pedro Sula',
    fechaRegistro: new Date('2024-02-20'),
    totalCompras: 8500,
    tipoCliente: 'frecuente'
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Martínez',
    identificacion: '0801-1992-11111',
    telefono: '9654-3210',
    email: 'carlos.martinez@email.com',
    direccion: 'Col. Kennedy, Tegucigalpa',
    fechaRegistro: new Date('2024-03-10'),
    totalCompras: 3200,
    tipoCliente: 'regular'
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'López',
    identificacion: '0801-1988-22222',
    telefono: '9321-6547',
    email: 'ana.lopez@email.com',
    direccion: 'Col. Lomas del Guijarro, Tegucigalpa',
    fechaRegistro: new Date('2024-01-05'),
    totalCompras: 22000,
    tipoCliente: 'vip'
  },
  {
    id: '5',
    nombre: 'Roberto',
    apellido: 'Hernández',
    identificacion: '0801-1995-33333',
    telefono: '9147-8520',
    email: 'roberto.hernandez@email.com',
    direccion: 'Barrio El Centro, La Ceiba',
    fechaRegistro: new Date('2024-02-28'),
    totalCompras: 5600,
    tipoCliente: 'frecuente'
  }
];
