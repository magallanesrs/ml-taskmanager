import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import type { Monitoreo } from '../types/types';

interface MonitoringProgressProps {
  monitoreos: Monitoreo[];
}

export const MonitoringProgress = ({ monitoreos }: MonitoringProgressProps) => {
  const completedTasks = monitoreos.filter(m => m.completado).length;
  const totalTasks = monitoreos.length;
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progreso de Atención
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {`${completedTasks} de ${totalTasks} casos atendidos`}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mt: 1, mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(progress)}% de casos resueltos`}
        </Typography>
      </Box>
    </Paper>
  );
}; 