import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import type { Monitoreo } from '../types/types';

interface PrideCasesProps {
  monitoreos: Monitoreo[];
}

export const PrideCases = ({ monitoreos }: PrideCasesProps) => {
  const casosUrgentes = monitoreos
    .filter(m => m.prioridad === 'alta' && !m.completado)
    .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Casos Urgentes
        </Typography>
        <Chip 
          label={`${casosUrgentes.length} pendientes`}
          color="error"
          size="small"
        />
      </Box>
      <List>
        {casosUrgentes.map((caso) => (
          <ListItem key={caso.id} divider>
            <ListItemText
              primary={caso.titulo}
              secondary={
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {caso.descripcion}
                </Typography>
              }
            />
          </ListItem>
        ))}
        {casosUrgentes.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No hay casos urgentes"
              secondary="Todos los casos prioritarios han sido atendidos"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}; 