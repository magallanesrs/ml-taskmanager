import type { Monitoreo } from '../types/types';

export const mockMonitoreos: Monitoreo[] = [
  {
    id: '1',
    titulo: 'Reclamo de Cliente - Demora en Entrega',
    descripcion: 'Cliente reporta retraso de 48 horas en la entrega de su pedido #45678',
    completado: true,
    fechaCreacion: new Date('2024-03-01'),
    prioridad: 'alta'
  },
  {
    id: '2',
    titulo: 'Consulta de Facturación',
    descripcion: 'Cliente necesita aclaración sobre cargos adicionales en su última factura',
    completado: false,
    fechaCreacion: new Date('2024-03-05'),
    prioridad: 'media'
  },
  {
    id: '3',
    titulo: 'Solicitud de Cambio de Producto',
    descripcion: 'Cliente solicita cambio por talla incorrecta',
    completado: false,
    fechaCreacion: new Date('2024-03-10'),
    prioridad: 'media'
  },
  {
    id: '4',
    titulo: 'Problema con Aplicación Móvil',
    descripcion: 'Usuario no puede acceder a su cuenta desde la app',
    completado: false,
    fechaCreacion: new Date('2024-03-11'),
    prioridad: 'alta'
  },
  {
    id: '5',
    titulo: 'Actualización de Información',
    descripcion: 'Cliente requiere actualizar su dirección de envío',
    completado: true,
    fechaCreacion: new Date('2024-03-12'),
    prioridad: 'baja'
  }
]; 