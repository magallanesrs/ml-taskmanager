import type { Monitoreo } from '../types/types';

interface Metricas {
  totalTareas: number;
  tareasCompletadas: number;
  tareasPendientes: number;
  porcentajeCompletado: number;
  distribucionPrioridad: {
    alta: number;
    media: number;
    baja: number;
  };
}

export class MetricasService {
  calcularMetricas(monitoreos: Monitoreo[]): Metricas {
    const totalTareas = monitoreos.length;
    const tareasCompletadas = monitoreos.filter(m => m.completado).length;
    const tareasPendientes = totalTareas - tareasCompletadas;
    const porcentajeCompletado = (tareasCompletadas / totalTareas) * 100;

    const distribucionPrioridad = {
      alta: monitoreos.filter(m => m.prioridad === 'alta').length,
      media: monitoreos.filter(m => m.prioridad === 'media').length,
      baja: monitoreos.filter(m => m.prioridad === 'baja').length,
    };

    return {
      totalTareas,
      tareasCompletadas,
      tareasPendientes,
      porcentajeCompletado,
      distribucionPrioridad,
    };
  }
} 