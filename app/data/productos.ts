// Datos mock de productos
import { Producto } from '../types';

export const productosData: Producto[] = [
  // Camisas
  {
    id: '1',
    codigo: 'CAM001',
    nombre: 'Camisa Formal Blanca',
    precio: 450,
    stockDisponible: 25,
    categoria: 'Camisas',
    talla: 'M',
    color: 'Blanco'
  },
  {
    id: '2',
    codigo: 'CAM002',
    nombre: 'Camiseta Polo Roja',
    precio: 350,
    stockDisponible: 30,
    categoria: 'Camisas',
    talla: 'M',
    color: 'Rojo'
  },
  {
    id: '3',
    codigo: 'CAM003',
    nombre: 'Camisa Casual Azul',
    precio: 420,
    stockDisponible: 18,
    categoria: 'Camisas',
    talla: 'L',
    color: 'Azul'
  },
  {
    id: '4',
    codigo: 'CAM004',
    nombre: 'Camiseta Básica Negra',
    precio: 280,
    stockDisponible: 40,
    categoria: 'Camisas',
    talla: 'S',
    color: 'Negro'
  },
  {
    id: '5',
    codigo: 'CAM005',
    nombre: 'Camisa Manga Larga Gris',
    precio: 480,
    stockDisponible: 22,
    categoria: 'Camisas',
    talla: 'XL',
    color: 'Gris'
  },
  
  // Pantalones
  {
    id: '6',
    codigo: 'PAN001',
    nombre: 'Pantalón Jean Azul',
    precio: 850,
    stockDisponible: 20,
    categoria: 'Pantalones',
    talla: '32',
    color: 'Azul'
  },
  {
    id: '7',
    codigo: 'PAN002',
    nombre: 'Pantalón Formal Negro',
    precio: 920,
    stockDisponible: 15,
    categoria: 'Pantalones',
    talla: '34',
    color: 'Negro'
  },
  {
    id: '8',
    codigo: 'PAN003',
    nombre: 'Pantalón Cargo Verde',
    precio: 780,
    stockDisponible: 12,
    categoria: 'Pantalones',
    talla: '30',
    color: 'Verde'
  },
  {
    id: '9',
    codigo: 'PAN004',
    nombre: 'Pantalón Deportivo Gris',
    precio: 650,
    stockDisponible: 28,
    categoria: 'Pantalones',
    talla: 'M',
    color: 'Gris'
  },
  {
    id: '10',
    codigo: 'PAN005',
    nombre: 'Short Jean Azul Claro',
    precio: 520,
    stockDisponible: 25,
    categoria: 'Pantalones',
    talla: '32',
    color: 'Azul Claro'
  },
  
  // Vestidos
  {
    id: '11',
    codigo: 'VES001',
    nombre: 'Vestido Casual Negro',
    precio: 1200,
    stockDisponible: 10,
    categoria: 'Vestidos',
    talla: 'S',
    color: 'Negro'
  },
  {
    id: '12',
    codigo: 'VES002',
    nombre: 'Vestido Floral Primavera',
    precio: 1350,
    stockDisponible: 8,
    categoria: 'Vestidos',
    talla: 'M',
    color: 'Multicolor'
  },
  {
    id: '13',
    codigo: 'VES003',
    nombre: 'Vestido Elegante Rojo',
    precio: 1580,
    stockDisponible: 6,
    categoria: 'Vestidos',
    talla: 'L',
    color: 'Rojo'
  },
  {
    id: '14',
    codigo: 'VES004',
    nombre: 'Vestido Playero Blanco',
    precio: 980,
    stockDisponible: 14,
    categoria: 'Vestidos',
    talla: 'S',
    color: 'Blanco'
  },
  
  // Calzado
  {
    id: '15',
    codigo: 'ZAP001',
    nombre: 'Zapatos Deportivos Nike',
    precio: 1500,
    stockDisponible: 18,
    categoria: 'Calzado',
    talla: '40',
    color: 'Negro/Blanco'
  },
  {
    id: '16',
    codigo: 'ZAP002',
    nombre: 'Zapatos Formales Café',
    precio: 1280,
    stockDisponible: 12,
    categoria: 'Calzado',
    talla: '42',
    color: 'Café'
  },
  {
    id: '17',
    codigo: 'ZAP003',
    nombre: 'Sandalias Casuales',
    precio: 680,
    stockDisponible: 22,
    categoria: 'Calzado',
    talla: '38',
    color: 'Beige'
  },
  {
    id: '18',
    codigo: 'ZAP004',
    nombre: 'Botas de Cuero Negro',
    precio: 1850,
    stockDisponible: 9,
    categoria: 'Calzado',
    talla: '41',
    color: 'Negro'
  },
  {
    id: '19',
    codigo: 'ZAP005',
    nombre: 'Tenis Running Azul',
    precio: 1420,
    stockDisponible: 16,
    categoria: 'Calzado',
    talla: '39',
    color: 'Azul'
  },
  
  // Chaquetas
  {
    id: '20',
    codigo: 'CHQ001',
    nombre: 'Chaqueta de Cuero',
    precio: 2500,
    stockDisponible: 7,
    categoria: 'Chaquetas',
    talla: 'L',
    color: 'Café'
  },
  {
    id: '21',
    codigo: 'CHQ002',
    nombre: 'Chaqueta Deportiva Negra',
    precio: 1680,
    stockDisponible: 15,
    categoria: 'Chaquetas',
    talla: 'M',
    color: 'Negro'
  },
  {
    id: '22',
    codigo: 'CHQ003',
    nombre: 'Chaqueta Jean Azul',
    precio: 1450,
    stockDisponible: 11,
    categoria: 'Chaquetas',
    talla: 'L',
    color: 'Azul'
  },
  {
    id: '23',
    codigo: 'CHQ004',
    nombre: 'Chaqueta Impermeable Verde',
    precio: 1920,
    stockDisponible: 13,
    categoria: 'Chaquetas',
    talla: 'XL',
    color: 'Verde'
  },
  
  // Accesorios
  {
    id: '24',
    codigo: 'ACC001',
    nombre: 'Gorra Deportiva',
    precio: 280,
    stockDisponible: 35,
    categoria: 'Accesorios',
    talla: 'Única',
    color: 'Negro'
  },
  {
    id: '25',
    codigo: 'ACC002',
    nombre: 'Cinturón de Cuero',
    precio: 420,
    stockDisponible: 20,
    categoria: 'Accesorios',
    talla: 'M',
    color: 'Café'
  },
  {
    id: '26',
    codigo: 'ACC003',
    nombre: 'Bufanda de Lana',
    precio: 350,
    stockDisponible: 18,
    categoria: 'Accesorios',
    talla: 'Única',
    color: 'Gris'
  },
  {
    id: '27',
    codigo: 'ACC004',
    nombre: 'Guantes de Cuero',
    precio: 480,
    stockDisponible: 14,
    categoria: 'Accesorios',
    talla: 'L',
    color: 'Negro'
  },
  {
    id: '28',
    codigo: 'ACC005',
    nombre: 'Mochila Deportiva',
    precio: 850,
    stockDisponible: 12,
    categoria: 'Accesorios',
    talla: 'Única',
    color: 'Azul'
  },
  
  // Ropa Interior
  {
    id: '29',
    codigo: 'INT001',
    nombre: 'Pack 3 Boxers',
    precio: 380,
    stockDisponible: 45,
    categoria: 'Ropa Interior',
    talla: 'M',
    color: 'Variado'
  },
  {
    id: '30',
    codigo: 'INT002',
    nombre: 'Pack 5 Calcetines',
    precio: 220,
    stockDisponible: 50,
    categoria: 'Ropa Interior',
    talla: 'Única',
    color: 'Negro'
  },
  {
    id: '31',
    codigo: 'INT003',
    nombre: 'Camiseta Interior Blanca',
    precio: 180,
    stockDisponible: 40,
    categoria: 'Ropa Interior',
    talla: 'L',
    color: 'Blanco'
  },
  
  // Ropa Deportiva
  {
    id: '32',
    codigo: 'DEP001',
    nombre: 'Conjunto Deportivo Completo',
    precio: 1280,
    stockDisponible: 16,
    categoria: 'Deportiva',
    talla: 'M',
    color: 'Negro/Rojo'
  },
  {
    id: '33',
    codigo: 'DEP002',
    nombre: 'Shorts Deportivos',
    precio: 420,
    stockDisponible: 28,
    categoria: 'Deportiva',
    talla: 'L',
    color: 'Azul'
  },
  {
    id: '34',
    codigo: 'DEP003',
    nombre: 'Top Deportivo Mujer',
    precio: 380,
    stockDisponible: 22,
    categoria: 'Deportiva',
    talla: 'S',
    color: 'Rosa'
  },
  {
    id: '35',
    codigo: 'DEP004',
    nombre: 'Leggins Deportivos',
    precio: 520,
    stockDisponible: 24,
    categoria: 'Deportiva',
    talla: 'M',
    color: 'Negro'
  }
];
