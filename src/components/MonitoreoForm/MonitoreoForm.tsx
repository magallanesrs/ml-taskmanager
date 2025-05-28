import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
  Grid,
  Divider,
  TextField,
} from '@mui/material';
import type { Monitoreo, NivelTag } from '../../types/types';

interface MonitoreoFormProps {
  monitoreo: Monitoreo;
  onChange: (field: string, value: any) => void;
}

const nivelOptions: NivelTag[] = ['Bajo', 'Medio Bajo', 'Medio Alto', 'Alto'];

export const MonitoreoForm: React.FC<MonitoreoFormProps> = ({
  monitoreo,
  onChange,
}) => {
  const renderEvaluacionField = (
    label: string,
    field: keyof Monitoreo,
    value: string | undefined,
    options: string[]
  ) => (
    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <RadioGroup
        row
        value={value || ''}
        onChange={(e) => onChange(field, e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detalles del Monitoreo
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Número de Caso"
              value={monitoreo.numeroCaso || ''}
              onChange={(e) => onChange('numeroCaso', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Título"
              value={monitoreo.titulo || ''}
              onChange={(e) => onChange('titulo', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Comentario"
              value={monitoreo.comentario || ''}
              onChange={(e) => onChange('comentario', e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" gutterBottom>
          Evaluación
        </Typography>
        
        {renderEvaluacionField('Bienvenida', 'bienvenida', monitoreo.bienvenida, nivelOptions)}
        {renderEvaluacionField('Exploración', 'exploracion', monitoreo.exploracion, nivelOptions)}
        {renderEvaluacionField('Guía y Asesoramiento', 'guiaAsesoramiento', monitoreo.guiaAsesoramiento, nivelOptions)}
        {renderEvaluacionField('Cierre', 'cierre', monitoreo.cierre, nivelOptions)}
        {renderEvaluacionField('Adhesión General', 'adhesionGeneral', monitoreo.adhesionGeneral, nivelOptions)}
        
        <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Caso de Orgullo
          </Typography>
          <RadioGroup
            row
            value={monitoreo.casoDeOrgullo ? 'Sí' : 'No'}
            onChange={(e) => onChange('casoDeOrgullo', e.target.value === 'Sí')}
          >
            <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Paper>
  );
}; 