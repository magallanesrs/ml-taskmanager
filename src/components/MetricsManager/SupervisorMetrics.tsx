import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import type { Monitoreo, Usuario } from '../../types/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleIcon from '@mui/icons-material/People';

interface SupervisorMetricsProps {
  monitoreos: Monitoreo[];
  usuarioActual: Usuario;
}

export const SupervisorMetrics: React.FC<SupervisorMetricsProps> = ({
  monitoreos,
  usuarioActual,
}) => {
  // Calcular tiempo promedio de tareas pendientes
  const calcularTiempoPendientes = () => {
    const tareasPendientes = monitoreos.filter(m => m.estado === 'Pendiente');
    if (tareasPendientes.length === 0) return 0;

    const tiempoTotal = tareasPendientes.reduce((total, tarea) => {
      const tiempoTranscurrido = new Date().getTime() - new Date(tarea.fechaCreacion).getTime();
      return total + tiempoTranscurrido;
    }, 0);

    return Math.round(tiempoTotal / (tareasPendientes.length * 1000 * 60 * 60)); // Convertir a horas
  };

  // Calcular monitoreos de la última semana
  const calcularMonitoreosUltimaSemana = () => {
    const unaSemanaPasada = new Date();
    unaSemanaPasada.setDate(unaSemanaPasada.getDate() - 7);

    return monitoreos.filter(m => 
      new Date(m.fechaCreacion) > unaSemanaPasada && 
      m.estado === 'Completado'
    ).length;
  };

  // Calcular distribución de niveles de adhesión por equipo
  const calcularDistribucionNivelesPorEquipo = () => {
    const distribucion = monitoreos.reduce((acc, monitoreo) => {
      const equipo = monitoreo.ownerActual.equipo;
      if (!acc[equipo]) {
        acc[equipo] = {
          bajo: 0,
          medioBajo: 0,
          medioAlto: 0,
          alto: 0,
          total: 0
        };
      }
      
      if (monitoreo.nivelTag) {
        switch (monitoreo.nivelTag) {
          case 'Bajo':
            acc[equipo].bajo++;
            break;
          case 'Medio Bajo':
            acc[equipo].medioBajo++;
            break;
          case 'Medio Alto':
            acc[equipo].medioAlto++;
            break;
          case 'Alto':
            acc[equipo].alto++;
            break;
        }
        acc[equipo].total++;
      }
      
      return acc;
    }, {} as Record<string, { bajo: number; medioBajo: number; medioAlto: number; alto: number; total: number }>);

    return distribucion;
  };

  const tiempoPendientes = calcularTiempoPendientes();
  const monitoreosUltimaSemana = calcularMonitoreosUltimaSemana();
  const distribucionPorEquipo = calcularDistribucionNivelesPorEquipo();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Métricas de Monitoreos
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  Tiempo Promedio de Tareas Pendientes
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {tiempoPendientes} horas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentTurnedInIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  Monitoreos Completados (Última Semana)
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {monitoreosUltimaSemana}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h6">
            Niveles de Adhesión por Equipo
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipo</TableCell>
                <TableCell align="right">Bajo</TableCell>
                <TableCell align="right">Medio Bajo</TableCell>
                <TableCell align="right">Medio Alto</TableCell>
                <TableCell align="right">Alto</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(distribucionPorEquipo).map(([equipo, datos]) => {
                const total = datos.total;
                return (
                  <TableRow key={equipo}>
                    <TableCell>{equipo}</TableCell>
                    <TableCell align="right">{datos.bajo} ({((datos.bajo/total)*100).toFixed(1)}%)</TableCell>
                    <TableCell align="right">{datos.medioBajo} ({((datos.medioBajo/total)*100).toFixed(1)}%)</TableCell>
                    <TableCell align="right">{datos.medioAlto} ({((datos.medioAlto/total)*100).toFixed(1)}%)</TableCell>
                    <TableCell align="right">{datos.alto} ({((datos.alto/total)*100).toFixed(1)}%)</TableCell>
                    <TableCell align="right">{total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
