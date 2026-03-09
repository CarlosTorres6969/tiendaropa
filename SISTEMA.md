# Sistema de Facturación - Tienda de Ropa

## Descripción del Sistema

Sistema completo de facturación para tienda de ropa implementado en Next.js 16 con TypeScript y Tailwind CSS. El sistema implementa todos los flujos del diagrama de secuencia UML proporcionado.

## Funcionalidades Implementadas

### 1. Buscar Prenda
- Búsqueda por código o nombre de producto
- Resultados en tiempo real
- Visualización de stock disponible
- Información detallada: talla, color, precio

### 2. Agregar Producto a la Venta
- Selección de cantidad
- Validación de stock disponible
- Cálculo automático de subtotales
- Confirmación visual al agregar

### 3. Lista de Venta
- Tabla con todos los productos agregados
- Cálculo automático de subtotal, IVA (19%) y total
- Opción para eliminar productos
- Actualización en tiempo real

### 4. Procesar Pago
- Tres métodos de pago disponibles:
  - **Efectivo**: Con cálculo de cambio
  - **Tarjeta**: Débito o crédito
  - **Transferencia**: Con número de referencia
- Modal interactivo para selección de método
- Validaciones específicas por método

### 5. Generar Factura
- Factura completa con todos los detalles
- Información de la tienda
- Detalle de productos vendidos
- Totales y método de pago
- Opciones para imprimir o iniciar nueva venta

### 6. Devolución de Producto (Opcional)
- Formulario para solicitar devoluciones
- Ingreso de número de factura
- Código de producto y cantidad
- Motivo de devolución
- Registro de solicitud

## Estructura del Proyecto

```
tiendaropa/
├── app/
│   ├── components/
│   │   ├── BuscarPrenda.tsx          # Flujo 1: Búsqueda
│   │   ├── AgregarProducto.tsx       # Flujo 2: Agregar a venta
│   │   ├── ListaVenta.tsx            # Visualización de items
│   │   ├── ProcesarPago.tsx          # Flujo 3: Pago
│   │   ├── GenerarFactura.tsx        # Flujo 4: Factura
│   │   └── DevolucionProducto.tsx    # Flujo 5: Devoluciones
│   ├── data/
│   │   └── productos.ts              # Datos mock de productos
│   ├── types.ts                      # Interfaces TypeScript
│   ├── page.tsx                      # Página principal
│   ├── layout.tsx                    # Layout de la app
│   └── globals.css                   # Estilos globales
└── package.json
```

## Componentes Principales

### BuscarPrenda
- Input de búsqueda con autocompletado
- Filtrado por código o nombre
- Dropdown con resultados
- Selección de producto

### AgregarProducto
- Muestra producto seleccionado
- Input de cantidad con validación
- Verificación de stock
- Cálculo de subtotal

### ListaVenta
- Tabla responsive
- Columnas: Producto, Cantidad, Precio, Subtotal
- Botón eliminar por item
- Resumen de totales

### ProcesarPago
- Modal con métodos de pago
- Formularios específicos por método
- Validaciones de entrada
- Confirmación de pago

### GenerarFactura
- Modal con factura completa
- Diseño para impresión
- Información detallada
- Botones de acción

### DevolucionProducto
- Botón flotante de acceso
- Formulario de devolución
- Validación de campos
- Confirmación de registro

## Tipos de Datos

```typescript
interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  stockDisponible: number;
  categoria: string;
  talla?: string;
  color?: string;
}

interface ItemVenta {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface Factura {
  id: string;
  numero: string;
  fecha: Date;
  items: ItemVenta[];
  subtotal: number;
  impuesto: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  estado: 'pagada' | 'pendiente' | 'anulada';
}
```

## Productos de Ejemplo

El sistema incluye 6 productos de ejemplo:
- Camisa Formal Blanca (CAM001)
- Pantalón Jean Azul (PAN001)
- Vestido Casual Negro (VES001)
- Zapatos Deportivos (ZAP001)
- Chaqueta de Cuero (CHQ001)
- Camiseta Polo Roja (CAM002)

## Flujo de Uso

1. **Buscar producto**: Escribir código o nombre en el buscador
2. **Seleccionar**: Click en el producto deseado
3. **Agregar cantidad**: Ingresar cantidad y agregar a la venta
4. **Repetir**: Agregar más productos si es necesario
5. **Procesar pago**: Click en "Procesar Pago"
6. **Seleccionar método**: Elegir efectivo, tarjeta o transferencia
7. **Confirmar**: Completar información y confirmar
8. **Factura**: Ver, imprimir o iniciar nueva venta

## Características Técnicas

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Estado**: React Hooks (useState)
- **Sin base de datos**: Datos en memoria (mock data)
- **Responsive**: Diseño adaptable a móviles y desktop
- **Accesibilidad**: Formularios con labels y validaciones

## Validaciones Implementadas

- Stock disponible antes de agregar
- Cantidad mayor a cero
- Monto suficiente en pago efectivo
- Número de tarjeta válido (16 dígitos)
- Número de transferencia válido
- Campos obligatorios en devoluciones

## Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

## Próximas Mejoras (Opcionales)

- Integración con base de datos real
- Autenticación de cajeros
- Reportes de ventas
- Gestión de inventario
- Impresión térmica
- Código de barras
- Descuentos y promociones
- Clientes frecuentes
