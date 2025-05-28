import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { ReglaTransicion, NivelTag, TipoCola, RolUsuario } from '../../types/types';

interface RulesManagerProps {
  reglas: ReglaTransicion[];
  onReglasChange?: (reglas: ReglaTransicion[]) => void;
  readOnly?: boolean;
}

export function RulesManager({ reglas, onReglasChange, readOnly = false }: RulesManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [reglaEditando, setReglaEditando] = useState<ReglaTransicion | null>(null);

  const handleToggleRegla = (reglaId: string) => {
    const nuevasReglas = reglas.map(regla =>
      regla.id === reglaId ? { ...regla, activo: !regla.activo } : regla
    );
    onReglasChange && onReglasChange(nuevasReglas);
  };

  const handleEditarRegla = (regla: ReglaTransicion) => {
    setReglaEditando(regla);
    setOpenDialog(true);
  };

  const handleEliminarRegla = (reglaId: string) => {
    const nuevasReglas = reglas.filter(regla => regla.id !== reglaId);
    onReglasChange && onReglasChange(nuevasReglas);
  };

  const handleGuardarRegla = (regla: ReglaTransicion) => {
    if (reglaEditando) {
      const nuevasReglas = reglas.map(r =>
        r.id === reglaEditando.id ? regla : r
      );
      onReglasChange && onReglasChange(nuevasReglas);
    } else {
      onReglasChange && onReglasChange([...reglas, { ...regla, id: crypto.randomUUID() }]);
    }
    setOpenDialog(false);
    setReglaEditando(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reglas de Transición
        </Typography>
        {!readOnly && onReglasChange && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nueva Regla
          </Button>
        )}
      </Box>

      <List>
        {reglas.map((regla) => (
          <ListItem
            key={regla.id}
            secondaryAction={
              !readOnly && onReglasChange ? (
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditarRegla(regla)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleEliminarRegla(regla.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Switch
                    edge="end"
                    checked={regla.activo}
                    onChange={() => handleToggleRegla(regla.id)}
                  />
                </>
              ) : null
            }
          >
            <ListItemText
              primary={regla.nombre}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" component="div">
                    Condiciones:
                    {regla.condiciones.nivelTag?.map(tag => (
                      <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </Typography>
                  <Typography variant="body2" component="div">
                    Cola Destino: {regla.accion.colaDestino}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      <ReglaDialog
        open={openDialog}
        regla={reglaEditando}
        onClose={() => {
          setOpenDialog(false);
          setReglaEditando(null);
        }}
        onGuardar={handleGuardarRegla}
      />
    </Paper>
  );
}

interface ReglaDialogProps {
  open: boolean;
  regla: ReglaTransicion | null;
  onClose: () => void;
  onGuardar: (regla: ReglaTransicion) => void;
}

const ReglaDialog = ({ open, regla, onClose, onGuardar }: ReglaDialogProps) => {
  const [nombre, setNombre] = useState(regla?.nombre || '');
  const [nivelTag, setNivelTag] = useState<NivelTag[]>(regla?.condiciones.nivelTag || []);
  const [colaDestino, setColaDestino] = useState<TipoCola>(regla?.accion.colaDestino || 'General');
  const [notificarA, setNotificarA] = useState<RolUsuario[]>(regla?.accion.notificarA || []);

  const handleGuardar = () => {
    const nuevaRegla: ReglaTransicion = {
      id: regla?.id || '',
      nombre,
      condiciones: {
        nivelTag,
      },
      accion: {
        colaDestino,
        notificarA,
      },
      activo: true,
    };
    onGuardar(nuevaRegla);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{regla ? 'Editar Regla' : 'Nueva Regla'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de la Regla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Nivel de Tag</InputLabel>
          <Select
            multiple
            value={nivelTag}
            onChange={(e) => setNivelTag(e.target.value as NivelTag[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {['Bajo', 'Medio Bajo', 'Medio Alto', 'Alto'].map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Cola Destino</InputLabel>
          <Select
            value={colaDestino}
            onChange={(e) => setColaDestino(e.target.value as TipoCola)}
          >
            {['General', 'Prioridad', 'Gerencia', 'Supervisión'].map((cola) => (
              <MenuItem key={cola} value={cola}>
                {cola}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Notificar a</InputLabel>
          <Select
            multiple
            value={notificarA}
            onChange={(e) => setNotificarA(e.target.value as RolUsuario[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {['Team Leader', 'Supervisor', 'Gerente'].map((rol) => (
              <MenuItem key={rol} value={rol}>
                {rol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 