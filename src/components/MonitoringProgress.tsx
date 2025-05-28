import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import type { Monitoreo } from '../types/types';

interface MonitoringProgressProps {
  monitoreos: Monitoreo[];
}

export const MonitoringProgress = ({ monitoreos }: MonitoringProgressProps) => {
  const completedTasks = monitoreos.filter(m => m.estado === 'Completado').length;
  const totalTasks = monitoreos.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Progreso de Monitoreos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {completedTasks} de {totalTasks}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}; 