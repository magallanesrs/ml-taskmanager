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
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';

interface TeamLeaderMetricsProps {
  monitoreos: Monitoreo[];
  usuarioActual: Usuario;
}

export const TeamLeaderMetrics: React.FC<TeamLeaderMetricsProps> = ({
  monitoreos,
  usuarioActual,
}) => {
  // Calcular métricas por representante
  const calcularMetricasPorRepresentante = () => {
    return monitoreos.reduce((acc, monitoreo) => {
      const representante = monitoreo.ownerActual.nombre;
      if (!acc[representante]) {
        acc[representante] = {
          total: 0,
          completados: 0,
          cumplioSLA: 0,
          nivelesAdhesion: {
            bajo: 0,
            medioBajo: 0,
            medioAlto: 0,
            alto: 0
          }
        };
      }
      
      acc[representante].total++;
      if (monitoreo.estado === 'Completado') acc[representante].completados++;
      if (monitoreo.cumplioSLA) acc[representante].cumplioSLA++;
      
      if (monitoreo.nivelTag) {
        switch (monitoreo.nivelTag) {
          case 'Bajo':
            acc[representante].nivelesAdhesion.bajo++;
            break;
          case 'Medio Bajo':
            acc[representante].nivelesAdhesion.medioBajo++;
            break;
          case 'Medio Alto':
            acc[representante].nivelesAdhesion.medioAlto++;
            break;
          case 'Alto':
            acc[representante].nivelesAdhesion.alto++;
            break;
        }
      }
      
      return acc;
    }, {} as Record<string, {
      total: number;
      completados: number;
      cumplioSLA: number;
      nivelesAdhesion: {
        bajo: number;
        medioBajo: number;
        medioAlto: number;
        alto: number;
      };
    }>);
  };

  const metricasPorRepresentante = calcularMetricasPorRepresentante();
  const totalMonitoreos = monitoreos.length;
  const monitoreosCompletados = monitoreos.filter(m => m.estado === 'Completado').length;
  const cumplimientoSLA = monitoreos.filter(m => m.cumplioSLA).length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Métricas de Equipo - {usuarioActual.equipo}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  Total de Monitoreos
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {totalMonitoreos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  Completados
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {monitoreosCompletados} ({totalMonitoreos > 0 ? ((monitoreosCompletados/totalMonitoreos)*100).toFixed(1) : 0}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">
                  Cumplimiento SLA
                </Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {cumplimientoSLA} ({totalMonitoreos > 0 ? ((cumplimientoSLA/totalMonitoreos)*100).toFixed(1) : 0}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Métricas por Representante
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Representante</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Completados</TableCell>
                <TableCell align="right">Cumplimiento SLA</TableCell>
                <TableCell align="right">Bajo</TableCell>
                <TableCell align="right">Medio Bajo</TableCell>
                <TableCell align="right">Medio Alto</TableCell>
                <TableCell align="right">Alto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(metricasPorRepresentante).map(([representante, datos]) => (
                <TableRow key={representante}>
                  <TableCell>{representante}</TableCell>
                  <TableCell align="right">{datos.total}</TableCell>
                  <TableCell align="right">
                    {datos.completados} ({datos.total > 0 ? ((datos.completados/datos.total)*100).toFixed(1) : 0}%)
                  </TableCell>
                  <TableCell align="right">
                    {datos.cumplioSLA} ({datos.total > 0 ? ((datos.cumplioSLA/datos.total)*100).toFixed(1) : 0}%)
                  </TableCell>
                  <TableCell align="right">{datos.nivelesAdhesion.bajo}</TableCell>
                  <TableCell align="right">{datos.nivelesAdhesion.medioBajo}</TableCell>
                  <TableCell align="right">{datos.nivelesAdhesion.medioAlto}</TableCell>
                  <TableCell align="right">{datos.nivelesAdhesion.alto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}; 