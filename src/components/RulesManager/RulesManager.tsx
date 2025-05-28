import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ReglaTransicion, TipoCola, NivelTag } from '../../types/types';

interface RulesManagerProps {
  reglas: ReglaTransicion[];
  onReglasChange?: (reglas: ReglaTransicion[]) => void;
  readOnly?: boolean;
}

const nivelesAdhesion: NivelTag[] = ['Bajo', 'Medio Bajo', 'Medio Alto', 'Alto'];
const tiposCola: TipoCola[] = ['General', 'Prioridad', 'Supervisión', 'Gerencia'];

export function RulesManager({ reglas, onReglasChange, readOnly = false }: RulesManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaTransicion | null>(null);

  const handleOpenDialog = (regla?: ReglaTransicion) => {
    if (regla) {
      setReglaEditando(regla);
    } else {
      setReglaEditando({
        id: crypto.randomUUID(),
        nombre: '',
        condiciones: {
          nivelTag: [],
          colaOrigen: 'General',
        },
        accion: {
          colaDestino: 'General',
          notificarA: [],
        },
        activo: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReglaEditando(null);
  };

  const handleSaveRegla = () => {
    if (reglaEditando && onReglasChange) {
      if (reglas.find(r => r.id === reglaEditando.id)) {
        onReglasChange(reglas.map(r => r.id === reglaEditando.id ? reglaEditando : r));
      } else {
        onReglasChange([...reglas, reglaEditando]);
      }
    }
    handleCloseDialog();
  };

  const handleDeleteRegla = (id: string) => {
    if (onReglasChange) {
      onReglasChange(reglas.filter(r => r.id !== id));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reglas de Transición
        </Typography>
        {!readOnly && onReglasChange && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Nueva Regla
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Nivel de Adhesión</TableCell>
              <TableCell>Cola Origen</TableCell>
              <TableCell>Cola Destino</TableCell>
              <TableCell>Estado</TableCell>
              {!readOnly && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {reglas.map((regla) => (
              <TableRow key={regla.id}>
                <TableCell>{regla.nombre}</TableCell>
                <TableCell>
                  {regla.condiciones.nivelTag && regla.condiciones.nivelTag.length > 0 && (
                    <div>{regla.condiciones.nivelTag.join(', ')}</div>
                  )}
                </TableCell>
                <TableCell>{regla.condiciones.colaOrigen}</TableCell>
                <TableCell>{regla.accion.colaDestino}</TableCell>
                <TableCell>{regla.activo ? 'Activa' : 'Inactiva'}</TableCell>
                {!readOnly && (
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(regla)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRegla(regla.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {reglaEditando?.id ? 'Editar Regla' : 'Nueva Regla'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre de la Regla"
              value={reglaEditando?.nombre || ''}
              onChange={(e) => setReglaEditando(prev => prev ? { ...prev, nombre: e.target.value } : null)}
            />

            <FormControl fullWidth>
              <InputLabel>Nivel de Adhesión</InputLabel>
              <Select
                multiple
                value={reglaEditando?.condiciones.nivelTag || []}
                onChange={(e) => {
                  const value = e.target.value as NivelTag[];
                  setReglaEditando(prev => prev ? {
                    ...prev,
                    condiciones: { ...prev.condiciones, nivelTag: value }
                  } : null);
                }}
                label="Nivel de Adhesión"
              >
                {nivelesAdhesion.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    {nivel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Cola de Origen</InputLabel>
              <Select
                value={reglaEditando?.condiciones.colaOrigen || 'General'}
                onChange={(e) => {
                  const colaOrigen = e.target.value as TipoCola;
                  setReglaEditando(prev => prev ? {
                    ...prev,
                    condiciones: { ...prev.condiciones, colaOrigen }
                  } : null);
                }}
                label="Cola de Origen"
              >
                {tiposCola.map((cola) => (
                  <MenuItem key={cola} value={cola}>
                    {cola}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Cola de Destino</InputLabel>
              <Select
                value={reglaEditando?.accion.colaDestino || 'General'}
                onChange={(e) => {
                  const colaDestino = e.target.value as TipoCola;
                  setReglaEditando(prev => prev ? {
                    ...prev,
                    accion: { ...prev.accion, colaDestino }
                  } : null);
                }}
                label="Cola de Destino"
              >
                {tiposCola.map((cola) => (
                  <MenuItem key={cola} value={cola}>
                    {cola}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={reglaEditando?.activo || false}
                  onChange={(e) => setReglaEditando(prev => prev ? { ...prev, activo: e.target.checked } : null)}
                />
              }
              label="Regla Activa"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSaveRegla} 
            variant="contained" 
            color="primary"
            disabled={!reglaEditando?.nombre || !reglaEditando?.condiciones.nivelTag?.length}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 