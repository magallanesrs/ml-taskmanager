export interface DatosCaso {
  numeroCaso: string;
  descripcion: string;
  impacto: string;
  fecha: Date;
  categoria: string;
}

export interface DatosRepresentante {
  id: string;
  nombre: string;
  equipo: string;
  supervisorId: string;
  teamLeaderId: string;
}

export interface AccionMonitoreo {
  tipo: string;
  fecha: Date;
  comentarios: string;
  realizada_por: string;
}

export type EstadoMonitoreo = 'Pendiente' | 'En Proceso' | 'Completado';
export type NivelTag = 'Bajo' | 'Medio Bajo' | 'Medio Alto' | 'Alto';

export interface Monitoreo {
  id: string;
  datosCaso: DatosCaso;
  datosRepresentante: DatosRepresentante;
  estado: EstadoMonitoreo;
  esPride: boolean;
  etiquetaInicial: NivelTag;
  etiquetaFinal?: NivelTag;
  acciones: AccionMonitoreo[];
}

export interface MetricasCumplimiento {
  total: number;
  completados: number;
  enProceso: number;
  distribucionEtiquetas: {
    'Bajo': number;
    'Medio Bajo': number;
    'Medio Alto': number;
    'Alto': number;
  };
  casosPride: number;
  tasaCumplimiento: number;
} 