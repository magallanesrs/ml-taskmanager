import type { QueueType } from './queue';

export type MonitoringLevel = 
  | 'Bajo'
  | 'Medio'
  | 'Alto'
  | 'Crítico';

export type NivelTag = 
  | 'Bajo'          // TL → Sup → Gte (si Sup confirma)
  | 'Medio Bajo'    // TL → Sup (cierra)
  | 'Medio Alto'    // TL → Sup (cierra)
  | 'Alto';         // TL → Sup → Gte (si Sup confirma)

export type Canal =
  | 'Chat'
  | 'Mail'
  | 'Telefono'
  | 'Social'
  | 'Otro';

export type Proceso =
  | 'PDD_FBM_Incompleto'
  | 'Money_In'
  | 'Reputacion'
  | 'PNR_ME_Contradictorio'
  | 'Reversa';

export interface DatosRepresentante {
  id: string;
  nombre: string;
  equipo: string;
  teamLeaderId: string;
  supervisorId: string;
}

export interface DatosCaso {
  numeroCaso: string;
  canal: Canal;
  proceso: Proceso;
}

export type EstadoMonitoreo = 
  | 'Pendiente'           // En cola del TL
  | 'En_Monitoreo'        // TL está revisando
  | 'En_Cola_Supervisor'  // Esperando revisión del Supervisor
  | 'En_Cola_Gerente'     // Esperando revisión del Gerente
  | 'Finalizado'          // Proceso completado
  | 'Rechazado';          // Devuelto para correcciones

export type TipoAccion =
  | 'Creacion'
  | 'Inicio_Monitoreo'
  | 'Taggeo_TL'              // TL asigna tag inicial
  | 'Revision_Supervisor'     // Supervisor revisa y puede cambiar tag
  | 'Confirmacion_Supervisor' // Supervisor confirma tag Bajo/Alto
  | 'Revision_Gerente'
  | 'Rechazo'
  | 'Completado';

export interface AccionMonitoreo {
  id: string;
  tipo: TipoAccion;
  usuarioId: string;
  rolUsuario: QueueType;
  timestamp: Date;
  comentario?: string;
  nivelMonitoreo?: MonitoringLevel;
  nivelTag?: NivelTag;
  tagAnterior?: NivelTag;      // Para trackear cambios de tag
  casoOrgullo?: boolean;
  impacto?: ('mejoraProceso' | 'ahorroOperativo' | 'satisfaccionCliente')[];
}

export interface MetricasMonitoreo {
  tiempoTotalProceso: number;      // En minutos
  tiempoMonitoreo: number;         // En minutos
  tiempoRevisionSupervisor: number; // En minutos
  tiempoRevisionGerente: number;   // En minutos
  cantidadRechazos: number;
  cantidadIteraciones: number;
  cantidadCambiosTag: number;      // Número de veces que cambió el tag
}

export interface Monitoreo {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoMonitoreo;
  fechaCreacion: Date;
  fechaUltimaActualizacion: Date;
  fechaVencimiento?: Date;
  
  // Datos del Caso
  datosCaso: DatosCaso;
  
  // Datos del Representante
  datosRepresentante: DatosRepresentante;
  
  // Asignaciones del Monitoreo
  creadorId: string;
  asignadoId: string;
  colaActual: QueueType;
  
  // Monitoreo y Clasificación
  nivelMonitoreo?: MonitoringLevel;
  nivelTag?: NivelTag;
  tagConfirmadoPorSupervisor: boolean;  // Indica si el Sup confirmó el tag
  esCasoOrgullo: boolean;
  
  // Seguimiento
  historialAcciones: AccionMonitoreo[];
  metricas: MetricasMonitoreo;
  
  // Datos adicionales
  tags: string[];
  adjuntos: string[];
  comentarios: string[];
}

export interface CambioEstadoMonitoreo {
  monitoreoId: string;
  nuevoEstado: EstadoMonitoreo;
  accion: AccionMonitoreo;
} 