import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Switch,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Star as StarIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type {
  Monitoreo,
  NivelTag,
  RolUsuario,
  Usuario,
  EstadoMonitoreo,
  TipoCola,
  TipoElemento,
  TipoPosicion,
  TipoEquipo,
  TipoCentro,
} from '../../types/types';
import { NIVELES_TAG } from '../../types/types';
import { MonitoreoForm } from '../MonitoreoForm/MonitoreoForm';

interface TaggingManagerProps {
  monitoreos: Monitoreo[];
  usuarioActual: Usuario;
  usuariosDisponibles: Usuario[];
  onMonitoreoUpdate: (monitoreo: Monitoreo) => void;
  onMonitoreoCreate?: (monitoreo: Monitoreo) => void;
}

export const TaggingManager = ({
  monitoreos,
  usuarioActual,
  usuariosDisponibles,
  onMonitoreoUpdate,
  onMonitoreoCreate,
}: TaggingManagerProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [monitoreoSeleccionado, setMonitoreoSeleccionado] = useState<Monitoreo | null>(null);

  const puedeTaggear = (nivelTag: NivelTag | NivelTag[]): boolean => {
    const nivel = Array.isArray(nivelTag) ? nivelTag[0] : nivelTag;
    switch (usuarioActual.rol) {
      case 'Team Leader':
        return ['Bajo', 'Medio Bajo'].includes(nivel);
      case 'Supervisor':
        return ['Bajo', 'Medio Bajo', 'Medio Alto'].includes(nivel);
      case 'Gerente':
        return true;
      default:
        return false;
    }
  };

  const handleOpenTagDialog = (monitoreo: Monitoreo) => {
    setMonitoreoSeleccionado(monitoreo);
    setOpenDialog(true);
  };

  const filtrarMonitoreosPorRol = (monitoreos: Monitoreo[]): Monitoreo[] => {
    return monitoreos.filter(monitoreo => {
      if (!monitoreo.nivelTag) return true;
      return puedeTaggear(monitoreo.nivelTag);
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Monitoreo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestión de Monitoreos - {usuarioActual.rol}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewDialog(true)}
        >
          Nuevo Monitoreo
        </Button>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Número de Caso</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Owner Actual</TableCell>
              <TableCell>Caso de Orgullo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrarMonitoreosPorRol(monitoreos).map((monitoreo) => (
              <TableRow key={monitoreo.id}>
                <TableCell>{monitoreo.id}</TableCell>
                <TableCell>{monitoreo.numeroCaso}</TableCell>
                <TableCell>{monitoreo.titulo}</TableCell>
                <TableCell>
                  <Chip
                    label={monitoreo.estado}
                    color={
                      monitoreo.estado === 'Completado'
                        ? 'success'
                        : monitoreo.estado === 'En Proceso'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  {monitoreo.ownerActual.nombre}
                  <Typography variant="caption" display="block" color="text.secondary">
                    {monitoreo.ownerActual.rol} - {monitoreo.ownerActual.equipo}
                  </Typography>
                </TableCell>
                <TableCell>
                  {monitoreo.casoDeOrgullo && (
                    <Tooltip title="Caso de Orgullo">
                      <EmojiEventsIcon color="primary" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenTagDialog(monitoreo)}
                  >
                    Actualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TagDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setMonitoreoSeleccionado(null);
        }}
        monitoreo={monitoreoSeleccionado}
        usuarioActual={usuarioActual}
        onGuardar={(monitoreoActualizado) => {
          onMonitoreoUpdate(monitoreoActualizado);
          setOpenDialog(false);
          setMonitoreoSeleccionado(null);
        }}
      />

      <NuevoMonitoreoDialog
        open={openNewDialog}
        usuarioActual={usuarioActual}
        onClose={() => setOpenNewDialog(false)}
        onGuardar={(nuevoMonitoreo) => {
          if (onMonitoreoCreate) {
            onMonitoreoCreate(nuevoMonitoreo);
          }
          setOpenNewDialog(false);
        }}
      />
    </Paper>
  );
};

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  monitoreo: Monitoreo | null;
  usuarioActual: Usuario;
  onGuardar: (monitoreo: Monitoreo) => void;
}

const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onClose,
  monitoreo,
  usuarioActual,
  onGuardar,
}) => {
  if (!monitoreo) return null;

  const handleChange = (field: string, value: any) => {
    const monitoreoActualizado: Monitoreo = {
      ...monitoreo,
      [field]: value,
      fechaActualizacion: new Date().toISOString(),
      historialAcciones: [
        ...monitoreo.historialAcciones,
        {
          tipo: 'Actualización',
          fecha: new Date().toISOString(),
          usuario: usuarioActual,
          campo: field,
          valorAnterior: monitoreo[field as keyof Monitoreo],
          valorNuevo: value,
        },
      ],
    };
    onGuardar(monitoreoActualizado);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Evaluación de Monitoreo
      </DialogTitle>
      <DialogContent>
        <MonitoreoForm
          monitoreo={monitoreo}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

interface NuevoMonitoreoDialogProps {
  open: boolean;
  usuarioActual: Usuario;
  onClose: () => void;
  onGuardar: (monitoreo: Monitoreo) => void;
}

const NuevoMonitoreoDialog = ({
  open,
  usuarioActual,
  onClose,
  onGuardar,
}: NuevoMonitoreoDialogProps) => {
  const [numeroCaso, setNumeroCaso] = useState('');
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');

  const handleGuardar = () => {
    const nuevoMonitoreo: Monitoreo = {
      id: crypto.randomUUID(),
      tipo: 'Monitoreo',
      numeroCaso,
      titulo,
      comentario,
      estado: 'Pendiente',
      completado: false,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      ownerActual: usuarioActual,
      historialAcciones: [],
    };

    onGuardar(nuevoMonitoreo);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6">
            Monitoreo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Nuevo Monitoreo
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Número de Caso"
            value={numeroCaso}
            onChange={(e) => setNumeroCaso(e.target.value)}
            margin="normal"
            required
            placeholder="Ej: CASO-2024-001"
          />

          <TextField
            fullWidth
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <TextField
            fullWidth
            label="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={!numeroCaso || !titulo || !comentario}
        >
          Crear Monitoreo
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 