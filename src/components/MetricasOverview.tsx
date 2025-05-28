import { Grid, Paper, Typography, Box } from '@mui/material';

interface MetricasOverviewProps {
  metricas: {
    totalTareas: number;
    tareasCompletadas: number;
    tareasPendientes: number;
    porcentajeCompletado: number;
    distribucionPrioridad: {
      alta: number;
      media: number;
      baja: number;
    };
  };
}

export const MetricasOverview = ({ metricas }: MetricasOverviewProps) => {
  return (
    <Grid container spacing={3}>
      {/* Métricas Principales */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Total Tareas</Typography>
          <Typography variant="h3">{metricas.totalTareas}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Completadas</Typography>
          <Typography variant="h3">{metricas.tareasCompletadas}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Pendientes</Typography>
          <Typography variant="h3">{metricas.tareasPendientes}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Progreso</Typography>
          <Typography variant="h3">{Math.round(metricas.porcentajeCompletado)}%</Typography>
        </Paper>
      </Grid>

      {/* Distribución por Prioridad */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Distribución por Prioridad
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography color="error" variant="h4">
                  {metricas.distribucionPrioridad.alta}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alta
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography color="warning.main" variant="h4">
                  {metricas.distribucionPrioridad.media}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Media
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography color="success.main" variant="h4">
                  {metricas.distribucionPrioridad.baja}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Baja
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}; 