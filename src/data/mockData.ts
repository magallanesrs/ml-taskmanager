import type { Monitoreo, Usuario } from '../types/types';
import { TipoPosicion, TipoEquipo, TipoCentro } from '../types/types';

// Mock Users
export const mockUsers: Usuario[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    rol: 'Team Leader',
    posicion: TipoPosicion.TeamLeader,
    equipo: TipoEquipo.MercadoEnvios,
    centro: TipoCentro.HSP,
  },
  {
    id: '2',
    nombre: 'Ana Silva',
    rol: 'Supervisor',
    posicion: TipoPosicion.Supervisor,
    equipo: TipoEquipo.MercadoEnvios,
    centro: TipoCentro.HSP,
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    rol: 'Supervisor',
    posicion: TipoPosicion.Supervisor,
    equipo: TipoEquipo.FintechPagos,
    centro: TipoCentro.HSP,
  },
  {
    id: '4',
    nombre: 'María González',
    rol: 'Team Leader',
    posicion: TipoPosicion.TeamLeader,
    equipo: TipoEquipo.FintechPagos,
    centro: TipoCentro.HSP,
  },
  {
    id: '5',
    nombre: 'Roberto Martínez',
    rol: 'Gerente',
    posicion: TipoPosicion.Gerente,
    equipo: TipoEquipo.MktplVendedor,
    centro: TipoCentro.HSP,
  }
];

export const monitoreosMock: Monitoreo[] = [
  {
    id: '1',
    tipo: 'Monitoreo',
    numeroCaso: 'CASO-001',
    titulo: 'Revisar documentación del cliente',
    comentario: 'Es necesario revisar la documentación actualizada del cliente para el caso de soporte.',
    completado: true,
    fechaCreacion: new Date('2024-03-01').toISOString(),
    fechaActualizacion: new Date('2024-03-02').toISOString(),
    estado: 'Completado',
    ownerActual: mockUsers[0], // Juan Pérez (TL)
    bienvenida: 'Alto',
    exploracion: 'Medio Alto',
    guiaAsesoramiento: 'Alto',
    cierre: 'Medio Alto',
    adhesionGeneral: 'Alto',
    casoDeOrgullo: true,
    historialAcciones: []
  },
  {
    id: '2',
    tipo: 'Monitoreo',
    numeroCaso: 'CASO-002',
    titulo: 'Actualizar información de contacto',
    comentario: 'Actualizar la información de contacto del cliente en el sistema.',
    completado: false,
    fechaCreacion: new Date('2024-03-02').toISOString(),
    fechaActualizacion: new Date('2024-03-02').toISOString(),
    estado: 'Pendiente',
    ownerActual: mockUsers[3], // María González (TL)
    bienvenida: 'Medio Alto',
    exploracion: 'Medio Alto',
    guiaAsesoramiento: 'Medio Bajo',
    cierre: 'Medio Alto',
    adhesionGeneral: 'Medio Alto',
    historialAcciones: []
  },
  {
    id: '3',
    tipo: 'Monitoreo',
    numeroCaso: 'CASO-003',
    titulo: 'Seguimiento de caso',
    comentario: 'Realizar seguimiento del caso abierto con el equipo técnico.',
    completado: false,
    fechaCreacion: new Date('2024-03-03').toISOString(),
    fechaActualizacion: new Date('2024-03-03').toISOString(),
    estado: 'En Proceso',
    ownerActual: mockUsers[1], // Ana Silva (Sup)
    bienvenida: 'Medio Bajo',
    exploracion: 'Bajo',
    guiaAsesoramiento: 'Medio Bajo',
    cierre: 'Medio Bajo',
    adhesionGeneral: 'Medio Bajo',
    historialAcciones: []
  },
  {
    id: '4',
    tipo: 'Monitoreo',
    numeroCaso: 'CASO-004',
    titulo: 'Caso urgente de cliente VIP',
    comentario: 'Atender caso urgente reportado por cliente VIP.',
    completado: false,
    fechaCreacion: new Date('2024-03-04').toISOString(),
    fechaActualizacion: new Date('2024-03-04').toISOString(),
    estado: 'Pendiente',
    ownerActual: mockUsers[2], // Carlos Rodríguez (Sup)
    bienvenida: 'Medio Alto',
    exploracion: 'Alto',
    guiaAsesoramiento: 'Alto',
    cierre: 'Medio Alto',
    adhesionGeneral: 'Alto',
    historialAcciones: []
  },
  {
    id: '5',
    tipo: 'Monitoreo',
    numeroCaso: 'CASO-005',
    titulo: 'Documentar solución implementada',
    comentario: 'Documentar la solución implementada para el caso resuelto.',
    completado: true,
    fechaCreacion: new Date('2024-03-05').toISOString(),
    fechaActualizacion: new Date('2024-03-05').toISOString(),
    estado: 'Completado',
    ownerActual: mockUsers[4], // Roberto Martínez (Gerente)
    bienvenida: 'Alto',
    exploracion: 'Alto',
    guiaAsesoramiento: 'Alto',
    cierre: 'Alto',
    adhesionGeneral: 'Alto',
    casoDeOrgullo: true,
    historialAcciones: []
  }
]; 