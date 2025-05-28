import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { Monitoreo, Usuario } from '../../types/types';
import { ManagerMetrics } from './ManagerMetrics';
import { TeamLeaderMetrics } from './TeamLeaderMetrics';
import { SupervisorMetrics } from './SupervisorMetrics';

interface MetricsManagerProps {
  monitoreos: Monitoreo[];
  usuarios: Usuario[];
  usuarioActual: Usuario;
}

export const MetricsManager: React.FC<MetricsManagerProps> = ({
  monitoreos,
  usuarios,
  usuarioActual,
}) => {
  // Renderizar la vista específica según el rol
  const renderMetricasPorRol = () => {
    switch (usuarioActual.rol) {
      case 'Gerente':
        return <ManagerMetrics monitoreos={monitoreos} usuarioActual={usuarioActual} />;
      case 'Team Leader':
        return <TeamLeaderMetrics monitoreos={monitoreos} usuarioActual={usuarioActual} />;
      case 'Supervisor':
        return <SupervisorMetrics monitoreos={monitoreos} usuarioActual={usuarioActual} />;
      default:
        return <DefaultMetricsView monitoreos={monitoreos} usuarioActual={usuarioActual} />;
    }
  };

  return (
    <Box>
      {renderMetricasPorRol()}
    </Box>
  );
};

// Vista por defecto con métricas básicas
const DefaultMetricsView: React.FC<{ monitoreos: Monitoreo[]; usuarioActual: Usuario }> = ({
  monitoreos,
  usuarioActual,
}) => {
  // Calcular métricas generales
  const calcularMetricas = () => {
    const total = monitoreos.length;
    const completados = monitoreos.filter(m => m.estado === 'Completado').length;
    const enProceso = monitoreos.filter(m => m.estado === 'En Proceso').length;
    const pendientes = monitoreos.filter(m => m.estado === 'Pendiente').length;
    const casosOrgullo = monitoreos.filter(m => m.casoDeOrgullo).length;
    const cumplimientoSLA = monitoreos.filter(m => m.cumplioSLA).length;

    return {
      total,
      completados,
      enProceso,
      pendientes,
      casosOrgullo,
      cumplimientoSLA,
      porcentajeCumplimiento: total > 0 ? (cumplimientoSLA / total) * 100 : 0,
    };
  };

  const metricas = calcularMetricas();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Métricas de Monitoreos - {usuarioActual.rol}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Métricas Generales
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Total de Casos</TableCell>
                      <TableCell align="right">{metricas.total}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Completados</TableCell>
                      <TableCell align="right">{metricas.completados}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>En Proceso</TableCell>
                      <TableCell align="right">{metricas.enProceso}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pendientes</TableCell>
                      <TableCell align="right">{metricas.pendientes}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Casos de Orgullo</TableCell>
                      <TableCell align="right">{metricas.casosOrgullo}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cumplimiento SLA</TableCell>
                      <TableCell align="right">{metricas.porcentajeCumplimiento.toFixed(1)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Detalle de Casos
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de Caso</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Cola</TableCell>
              <TableCell>Caso de Orgullo</TableCell>
              <TableCell>Cumplió SLA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoreos.map((monitoreo) => (
              <TableRow key={monitoreo.id}>
                <TableCell>{monitoreo.numeroCaso}</TableCell>
                <TableCell>{monitoreo.titulo}</TableCell>
                <TableCell>{monitoreo.estado}</TableCell>
                <TableCell>{monitoreo.colaActual}</TableCell>
                <TableCell>{monitoreo.casoDeOrgullo ? 'Sí' : 'No'}</TableCell>
                <TableCell>{monitoreo.cumplioSLA ? 'Sí' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 