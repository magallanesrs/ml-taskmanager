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
} from '@mui/material';
import type { Monitoreo, NivelTag } from '../../types/types';

interface MonitoreoFormProps {
  monitoreo: Monitoreo;
  onChange: (field: string, value: string) => void;
}

const nivelOptions: NivelTag[] = ['Bajo', 'Medio Bajo', 'Medio Alto', 'Alto'];
const casoOrgulloOptions = ['Sí', 'No'];

export const MonitoreoForm: React.FC<MonitoreoFormProps> = ({
  monitoreo,
  onChange,
}) => {
  const renderEvaluacionField = (
    label: string,
    field: string,
    value: string,
    options: string[]
  ) => (
    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
        {label}
      </Typography>
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
            sx={{
              flex: 1,
              margin: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.9rem',
              },
            }}
          />
        ))}
      </RadioGroup>
      <Divider sx={{ mt: 2 }} />
    </FormControl>
  );

  return (
    <Paper sx={{ p: 3 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
          Caso #{monitoreo.numeroCaso}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Representante: {monitoreo.ownerActual.nombre}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Campos de evaluación en el orden especificado */}
          {renderEvaluacionField(
            'Bienvenida',
            'bienvenida',
            monitoreo.bienvenida || '',
            nivelOptions
          )}
          
          {renderEvaluacionField(
            'Exploración',
            'exploracion',
            monitoreo.exploracion || '',
            nivelOptions
          )}
          
          {renderEvaluacionField(
            'Guía y Asesoramiento',
            'guiaAsesoramiento',
            monitoreo.guiaAsesoramiento || '',
            nivelOptions
          )}
          
          {renderEvaluacionField(
            'Cierre',
            'cierre',
            monitoreo.cierre || '',
            nivelOptions
          )}
          
          {renderEvaluacionField(
            'Adhesión General',
            'adhesionGeneral',
            monitoreo.adhesionGeneral || '',
            nivelOptions
          )}
          
          {/* Campo Caso Orgullo */}
          {renderEvaluacionField(
            'Caso Orgullo',
            'casoDeOrgullo',
            monitoreo.casoDeOrgullo ? 'Sí' : 'No',
            casoOrgulloOptions
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}; 