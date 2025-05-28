import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { Monitoreo, Usuario, NivelTag } from '../../types/types';
import { TipoEquipo } from '../../types/types';

interface ManagerMetricsProps {
  monitoreos: Monitoreo[];
  usuarioActual: Usuario;
}

interface MetricasPorEquipo {
  total: number;
  casosOrgullo: number;
  distribucionNiveles: Record<NivelTag, number>;
  porcentajeAdhesion: number;
}

export const ManagerMetrics: React.FC<ManagerMetricsProps> = ({
  monitoreos,
  usuarioActual,
}) => {
  // Función para calcular el porcentaje de adhesión
  const calcularPorcentajeAdhesion = (niveles: Record<NivelTag, number>, total: number): number => {
    if (total === 0) return 0;
    const peso = {
      'Alto': 1,
      'Medio Alto': 0.75,
      'Medio Bajo': 0.5,
      'Bajo': 0.25,
    };
    
    const suma = Object.entries(niveles).reduce((acc, [nivel, cantidad]) => {
      return acc + (cantidad * peso[nivel as NivelTag]);
    }, 0);
    
    return (suma / total) * 100;
  };

  // Calcular métricas por equipo
  const metricasPorEquipo = monitoreos.reduce((acc: Record<string, MetricasPorEquipo>, monitoreo) => {
    const equipo = monitoreo.ownerActual.equipo;
    const equipoNombre = TipoEquipo[equipo];
    
    if (!acc[equipoNombre]) {
      acc[equipoNombre] = {
        total: 0,
        casosOrgullo: 0,
        distribucionNiveles: {
          'Alto': 0,
          'Medio Alto': 0,
          'Medio Bajo': 0,
          'Bajo': 0,
        },
        porcentajeAdhesion: 0,
      };
    }
    
    acc[equipoNombre].total++;
    if (monitoreo.casoDeOrgullo) {
      acc[equipoNombre].casosOrgullo++;
    }
    if (monitoreo.adhesionGeneral) {
      acc[equipoNombre].distribucionNiveles[monitoreo.adhesionGeneral]++;
    }
    
    acc[equipoNombre].porcentajeAdhesion = calcularPorcentajeAdhesion(
      acc[equipoNombre].distribucionNiveles,
      acc[equipoNombre].total
    );
    
    return acc;
  }, {});

  // Calcular totales generales
  const totales = {
    monitoreos: monitoreos.length,
    casosOrgullo: monitoreos.filter(m => m.casoDeOrgullo).length,
    distribucionNiveles: monitoreos.reduce((acc: Record<NivelTag, number>, monitoreo) => {
      if (monitoreo.adhesionGeneral) {
        acc[monitoreo.adhesionGeneral]++;
      }
      return acc;
    }, {
      'Alto': 0,
      'Medio Alto': 0,
      'Medio Bajo': 0,
      'Bajo': 0,
    }),
  };

  const porcentajeAdhesionGeneral = calcularPorcentajeAdhesion(
    totales.distribucionNiveles,
    totales.monitoreos
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Gerencial
      </Typography>
      
      {/* KPIs Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Monitoreos
              </Typography>
              <Typography variant="h3">
                {totales.monitoreos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Casos de Orgullo
              </Typography>
              <Typography variant="h3">
                {totales.casosOrgullo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {((totales.casosOrgullo / totales.monitoreos) * 100).toFixed(1)}% del total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Adhesión General
              </Typography>
              <Typography variant="h3">
                {porcentajeAdhesionGeneral.toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={porcentajeAdhesionGeneral}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Métricas por Equipo */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Métricas por Equipo
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Equipo</TableCell>
              <TableCell align="right">Total Monitoreos</TableCell>
              <TableCell align="right">Casos de Orgullo</TableCell>
              <TableCell align="right">% Adhesión</TableCell>
              <TableCell align="right">Alto</TableCell>
              <TableCell align="right">Medio Alto</TableCell>
              <TableCell align="right">Medio Bajo</TableCell>
              <TableCell align="right">Bajo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(metricasPorEquipo).map(([equipo, metricas]) => (
              <TableRow key={equipo}>
                <TableCell component="th" scope="row">
                  {equipo}
                </TableCell>
                <TableCell align="right">{metricas.total}</TableCell>
                <TableCell align="right">
                  {metricas.casosOrgullo} ({((metricas.casosOrgullo / metricas.total) * 100).toFixed(1)}%)
                </TableCell>
                <TableCell align="right">
                  {metricas.porcentajeAdhesion.toFixed(1)}%
                </TableCell>
                <TableCell align="right">{metricas.distribucionNiveles['Alto']}</TableCell>
                <TableCell align="right">{metricas.distribucionNiveles['Medio Alto']}</TableCell>
                <TableCell align="right">{metricas.distribucionNiveles['Medio Bajo']}</TableCell>
                <TableCell align="right">{metricas.distribucionNiveles['Bajo']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 