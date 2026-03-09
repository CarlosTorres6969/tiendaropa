import { Empleado } from '../types';

export const empleadosData: Empleado[] = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    identificacion: '0801-1990-12345',
    telefono: '9999-1111',
    email: 'maria.gonzalez@tiendaropa.hn',
    puesto: 'gerente',
    sucursalId: '1',
    fechaContratacion: new Date('2020-01-15'),
    salario: 25000,
    estado: 'activo',
    usuario: 'mgonzalez',
    password: 'gerente123'
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Martínez',
    identificacion: '0801-1992-23456',
    telefono: '9999-2222',
    email: 'carlos.martinez@tiendaropa.hn',
    puesto: 'gerente',
    sucursalId: '2',
    fechaContratacion: new Date('2021-03-20'),
    salario: 25000,
    estado: 'activo',
    usuario: 'cmartinez',
    password: 'gerente123'
  },
  {
    id: '3',
    nombre: 'Ana',
    apellido: 'Rodríguez',
    identificacion: '0801-1995-34567',
    telefono: '9999-3333',
    email: 'ana.rodriguez@tiendaropa.hn',
    puesto: 'gerente',
    sucursalId: '3',
    fechaContratacion: new Date('2022-06-10'),
    salario: 25000,
    estado: 'activo',
    usuario: 'arodriguez',
    password: 'gerente123'
  },
  {
    id: '4',
    nombre: 'Luis',
    apellido: 'Hernández',
    identificacion: '0801-1998-45678',
    telefono: '9999-4444',
    email: 'luis.hernandez@tiendaropa.hn',
    puesto: 'cajero',
    sucursalId: '1',
    fechaContratacion: new Date('2023-01-10'),
    salario: 15000,
    estado: 'activo',
    usuario: 'lhernandez',
    password: 'cajero123'
  },
  {
    id: '5',
    nombre: 'Patricia',
    apellido: 'López',
    identificacion: '0801-1997-56789',
    telefono: '9999-5555',
    email: 'patricia.lopez@tiendaropa.hn',
    puesto: 'vendedor',
    sucursalId: '2',
    fechaContratacion: new Date('2023-05-15'),
    salario: 12000,
    estado: 'activo'
  }
];
