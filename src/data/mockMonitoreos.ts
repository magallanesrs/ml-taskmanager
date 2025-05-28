import type { Monitoreo, Usuario, NivelTag, RolUsuario } from '../types/types';
import { TipoEquipo, TipoCentro, TipoPosicion } from '../types/types';

const gerente: Usuario = {
  id: '0',
  nombre: 'Roberto Silva',
  rol: 'Gerente',
  equipo: TipoEquipo.MercadoEnvios,
  centro: TipoCentro.HSP,
  posicion: TipoPosicion.Gerente,
};

const teamLeader: Usuario = {
  id: '1',
  nombre: 'Juan Pérez',
  rol: 'Team Leader',
  equipo: TipoEquipo.MercadoEnvios,
  centro: TipoCentro.HSP,
  posicion: TipoPosicion.TeamLeader,
};

const representantes: Usuario[] = [
  {
    id: '2',
    nombre: 'María García',
    rol: 'Team Leader',
    equipo: TipoEquipo.MercadoEnvios,
    centro: TipoCentro.HSP,
    posicion: TipoPosicion.TeamLeader,
  },
  {
    id: '3',
    nombre: 'Carlos López',
    rol: 'Team Leader',
    equipo: TipoEquipo.MktplVendedor,
    centro: TipoCentro.BR,
    posicion: TipoPosicion.TeamLeader,
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    rol: 'Team Leader',
    equipo: TipoEquipo.FintechSellers,
    centro: TipoCentro.HSP,
    posicion: TipoPosicion.TeamLeader,
  },
];

// Función auxiliar para generar fechas en el pasado
const getFechaPasada = (diasAtras: number): Date => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - diasAtras);
  return fecha;
};

// Función para generar un número de caso
const generarNumeroCaso = (index: number): string => {
  return `CASO-2024-${String(index).padStart(4, '0')}`;
};

export const monitoreosMock: Monitoreo[] = [
  // Monitoreo con alto desempeño y caso de orgullo
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0001',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(1),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Atención destacada al cliente con resolución excepcional',
    fechaCreacion: getFechaPasada(5),
    estado: 'Completado',
    nivelTag: 'Alto',
    colaActual: 'Gerencia',
    ownerActual: representantes[0],
    bienvenida: 'Alto',
    exploracion: 'Alto',
    guiaAsesoramiento: 'Alto',
    cierre: 'Alto',
    adhesionGeneral: 'Alto',
    casoDeOrgullo: true,
    prioridad: 'alta',
    historialTransiciones: [],
    historialAcciones: [],
  },
  // Monitoreo con desempeño medio-alto
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0002',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(2),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Buena gestión general del caso',
    fechaCreacion: getFechaPasada(4),
    estado: 'Completado',
    nivelTag: 'Medio Alto',
    colaActual: 'General',
    ownerActual: representantes[1],
    bienvenida: 'Medio Alto',
    exploracion: 'Alto',
    guiaAsesoramiento: 'Medio Alto',
    cierre: 'Medio Alto',
    adhesionGeneral: 'Medio Alto',
    casoDeOrgullo: false,
    prioridad: 'media',
    historialTransiciones: [],
    historialAcciones: [],
  },
  // Monitoreo con desempeño medio-bajo
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0003',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(3),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Caso con áreas de mejora identificadas',
    fechaCreacion: getFechaPasada(3),
    estado: 'Completado',
    nivelTag: 'Medio Bajo',
    colaActual: 'General',
    ownerActual: representantes[2],
    bienvenida: 'Medio Bajo',
    exploracion: 'Medio Bajo',
    guiaAsesoramiento: 'Medio Alto',
    cierre: 'Medio Bajo',
    adhesionGeneral: 'Medio Bajo',
    casoDeOrgullo: false,
    prioridad: 'media',
    historialTransiciones: [],
    historialAcciones: [],
  },
  // Monitoreo con bajo desempeño
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0004',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(4),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Necesita mejoras significativas en la atención',
    fechaCreacion: getFechaPasada(2),
    estado: 'Completado',
    nivelTag: 'Bajo',
    colaActual: 'General',
    ownerActual: representantes[0],
    bienvenida: 'Bajo',
    exploracion: 'Medio Bajo',
    guiaAsesoramiento: 'Bajo',
    cierre: 'Bajo',
    adhesionGeneral: 'Bajo',
    casoDeOrgullo: false,
    prioridad: 'alta',
    historialTransiciones: [],
    historialAcciones: [],
  },
  // Monitoreo en proceso con buen desempeño parcial
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0005',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(5),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Evaluación en curso - buenos indicadores preliminares',
    fechaCreacion: getFechaPasada(1),
    estado: 'En Proceso',
    nivelTag: 'Medio Alto',
    colaActual: 'General',
    ownerActual: representantes[1],
    bienvenida: 'Alto',
    exploracion: 'Medio Alto',
    guiaAsesoramiento: 'Medio Alto',
    cierre: 'Medio Alto',
    adhesionGeneral: 'Medio Alto',
    casoDeOrgullo: false,
    prioridad: 'media',
    historialTransiciones: [],
    historialAcciones: [],
  },
  // Otro caso de orgullo con alto desempeño
  {
    id: crypto.randomUUID(),
    numeroTarea: 'TAREA-2024-0006',
    tipo: 'Monitoreo',
    numeroCaso: generarNumeroCaso(6),
    titulo: 'Monitoreo de Caso',
    descripcion: 'Excelente manejo de caso complejo',
    fechaCreacion: getFechaPasada(1),
    estado: 'Completado',
    nivelTag: 'Alto',
    colaActual: 'Gerencia',
    ownerActual: representantes[2],
    bienvenida: 'Alto',
    exploracion: 'Alto',
    guiaAsesoramiento: 'Alto',
    cierre: 'Alto',
    adhesionGeneral: 'Alto',
    casoDeOrgullo: true,
    prioridad: 'alta',
    historialTransiciones: [],
    historialAcciones: [],
  },
];

export const usuariosMock = {
  gerente,
  teamLeader,
  representantes,
}; 