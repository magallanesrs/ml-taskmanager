export type NivelTag = 'Bajo' | 'Medio Bajo' | 'Medio Alto' | 'Alto';
export type EstadoMonitoreo = 'Pendiente' | 'En Proceso' | 'Completado' | 'Rechazado';
export type RolUsuario = 'Team Leader' | 'Supervisor' | 'Gerente' | 'Administrador';
export type TipoCola = 'General' | 'Prioridad' | 'Gerencia' | 'Supervisión';
export type TipoElemento = 'Monitoreo' | 'Calibración Supervisores' | 'Calibración Managers';
export type EstadoCalibracion = 'Pendiente' | 'En Revisión' | 'Completado';

// Enums para atributos de usuario
export enum TipoPosicion {
  TeamLeader = 1,
  Supervisor = 2,
  Gerente = 3
}

export enum TipoEquipo {
  MercadoEnvios = 1,
  MktplVendedor = 2,
  MktplComprador = 3,
  FintechSellers = 4,
  FintechPagos = 5,
  FintechCredits = 6,
  MediacionesPDD = 7,
  MediacionesPNR = 8
}

export enum TipoCentro {
  HSP = 1,
  BR = 2
}

// Constantes para niveles de tag
export const NIVELES_TAG: NivelTag[] = ['Bajo', 'Medio Bajo', 'Medio Alto', 'Alto'];

// Interfaz base para elementos en cola
export interface ElementoCola {
  id: string;
  numeroTarea: string; // Formato: TAREA-YYYY-XXXX
  tipo: TipoElemento;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  colaActual: TipoCola;
  ownerActual: Usuario;
  historialTransiciones: TransicionCola[];
  asignadoA?: Usuario;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface TransicionCola {
  id: string;
  fecha: Date;
  colaOrigen: TipoCola;
  colaDestino: TipoCola;
  ownerAnterior: Usuario;
  ownerNuevo: Usuario;
  motivo?: string;
  reglaAplicada?: ReglaTransicion;
  usuario: Usuario; // Usuario que realizó la transición
}

export interface Usuario {
  id: string;
  nombre: string;
  rol: RolUsuario;
  posicion: TipoPosicion;
  equipo: TipoEquipo;
  centro: TipoCentro;
}

export interface ReglaTransicion {
  id: string;
  nombre: string;
  condiciones: {
    nivelTag?: NivelTag[];
    estado?: EstadoMonitoreo[];
    tiempoEspera?: number; // en minutos
    colaOrigen: TipoCola;
  };
  accion: {
    colaDestino: TipoCola;
    prioridad?: 'alta' | 'media' | 'baja';
    notificarA?: RolUsuario[];
  };
  activo: boolean;
}

export interface Monitoreo {
  id: string;
  tipo: 'Monitoreo';
  numeroCaso: string;
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  estado: EstadoMonitoreo;
  completado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  asignadoA?: string;
  cola: TipoCola;
  colaActual: TipoCola;
  ownerActual: Usuario;
  nivelTag?: NivelTag[];
  historialAcciones: any[];
  // Campos de evaluación
  bienvenida?: NivelTag;
  exploracion?: NivelTag;
  guiaAsesoramiento?: NivelTag;
  cierre?: NivelTag;
  adhesionGeneral?: NivelTag;
  casoDeOrgullo?: boolean;
  marcarParaCalibracion?: {
    tipo: 'Calibración Supervisores' | 'Calibración Managers';
    fechaMarcado: string;
    marcadoPor: Usuario;
  };
}

export interface Calibracion extends ElementoCola {
  tipo: 'Calibración Supervisores' | 'Calibración Managers';
  titulo: string;
  descripcion: string;
  estado: EstadoCalibracion;
  monitoreos: string[]; // IDs de los monitoreos incluidos en la calibración
  responsable: Usuario;
  participantes: Usuario[];
  fechaProgramada?: Date;
  comentarios: {
    usuario: Usuario;
    fecha: Date;
    texto: string;
  }[];
}

export interface AccionMonitoreo {
  id: string;
  tipo: 'Creacion' | 'Inicio' | 'Finalizacion' | 'Taggeo' | 'Cambio Estado' | 'Reasignacion' | 'Comentario' | 'Marcado para Calibración' | 'Cambio Cola';
  fecha: Date;
  usuario: Usuario;
  detalles: {
    estadoAnterior?: EstadoMonitoreo;
    estadoNuevo?: EstadoMonitoreo;
    tagAnterior?: NivelTag;
    tagNuevo?: NivelTag;
    colaAnterior?: TipoCola;
    colaNueva?: TipoCola;
    ownerAnterior?: Usuario;
    ownerNuevo?: Usuario;
    comentario?: string;
    casoDeOrgulloAnterior?: boolean;
    casoDeOrgulloNuevo?: boolean;
    tipoCalibracion?: 'Calibración Supervisores' | 'Calibración Managers';
    tiempoEjecucion?: number;
    tiempoTotal?: number;
  };
}

export interface MetricasSLA {
  total: number;
  cumplidos: number;
  incumplidos: number;
  porcentajeCumplimiento: number;
  tiempoPromedioResolucion: number;
  porEquipo: {
    [equipo: string]: {
      total: number;
      cumplidos: number;
      porcentaje: number;
    };
  };
}

export interface EstadisticasColas {
  [cola: string]: {
    cantidadTareas: number;
    tiempoPromedioEspera: number;
    distribucionTags: Record<NivelTag, number>;
    casosVencidos: number;
    distribucionTipos: Record<TipoElemento, number>;
  };
} 