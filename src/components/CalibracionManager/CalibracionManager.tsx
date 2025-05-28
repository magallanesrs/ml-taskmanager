import { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type {
  Calibracion,
  Usuario,
  TipoCola,
  EstadoCalibracion,
} from '../../types/types';

interface CalibracionManagerProps {
  calibraciones: Calibracion[];
  usuarioActual: Usuario;
  onCalibracionUpdate: (calibracion: Calibracion) => void;
  onCalibracionCreate?: (calibracion: Calibracion) => void;
  tipo: 'Calibración Supervisores' | 'Calibración Managers';
}

export const CalibracionManager = ({
  calibraciones,
  usuarioActual,
  onCalibracionUpdate,
  onCalibracionCreate,
  tipo,
}: CalibracionManagerProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [calibracionSeleccionada, setCalibracionSeleccionada] = useState<Calibracion | null>(null);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {tipo}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestión de Calibraciones - {usuarioActual.rol}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewDialog(true)}
        >
          Nueva Calibración
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número de Tarea</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Cola</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calibraciones
              .filter(c => c.tipo === tipo)
              .map((calibracion) => (
                <TableRow key={calibracion.id}>
                  <TableCell>{calibracion.numeroTarea}</TableCell>
                  <TableCell>{calibracion.titulo}</TableCell>
                  <TableCell>
                    <Chip
                      label={calibracion.estado}
                      color={
                        calibracion.estado === 'Completado'
                          ? 'success'
                          : calibracion.estado === 'En Revisión'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>{calibracion.responsable.nombre}</TableCell>
                  <TableCell>
                    {calibracion.fechaProgramada?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{calibracion.colaActual}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCalibracionSeleccionada(calibracion);
                        setOpenDialog(true);
                      }}
                    >
                      Actualizar
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CalibracionDialog
        open={openDialog}
        calibracion={calibracionSeleccionada}
        usuarioActual={usuarioActual}
        tipo={tipo}
        onClose={() => {
          setOpenDialog(false);
          setCalibracionSeleccionada(null);
        }}
        onGuardar={(calibracionActualizada) => {
          onCalibracionUpdate(calibracionActualizada);
          setOpenDialog(false);
          setCalibracionSeleccionada(null);
        }}
      />

      <NuevaCalibracionDialog
        open={openNewDialog}
        usuarioActual={usuarioActual}
        tipo={tipo}
        onClose={() => setOpenNewDialog(false)}
        onGuardar={(nuevaCalibracion) => {
          if (onCalibracionCreate) {
            onCalibracionCreate(nuevaCalibracion);
          }
          setOpenNewDialog(false);
        }}
      />
    </Paper>
  );
};

interface CalibracionDialogProps {
  open: boolean;
  calibracion: Calibracion | null;
  usuarioActual: Usuario;
  tipo: 'Calibración Supervisores' | 'Calibración Managers';
  onClose: () => void;
  onGuardar: (calibracion: Calibracion) => void;
}

const CalibracionDialog = ({
  open,
  calibracion,
  usuarioActual,
  tipo,
  onClose,
  onGuardar,
}: CalibracionDialogProps) => {
  const [estado, setEstado] = useState<EstadoCalibracion>(
    calibracion?.estado || 'Pendiente'
  );
  const [comentario, setComentario] = useState('');

  const handleGuardar = () => {
    if (!calibracion) return;

    const calibracionActualizada: Calibracion = {
      ...calibracion,
      estado,
      fechaActualizacion: new Date(),
      comentarios: [
        ...calibracion.comentarios,
        {
          usuario: usuarioActual,
          fecha: new Date(),
          texto: comentario,
        },
      ],
    };

    onGuardar(calibracionActualizada);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          {tipo}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoCalibracion)}
            >
              {['Pendiente', 'En Revisión', 'Completado'].map(
                (estadoOpt) => (
                  <MenuItem key={estadoOpt} value={estadoOpt}>
                    {estadoOpt}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Comentario"
            multiline
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </Box>
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

interface NuevaCalibracionDialogProps {
  open: boolean;
  usuarioActual: Usuario;
  tipo: 'Calibración Supervisores' | 'Calibración Managers';
  onClose: () => void;
  onGuardar: (calibracion: Calibracion) => void;
}

const NuevaCalibracionDialog = ({
  open,
  usuarioActual,
  tipo,
  onClose,
  onGuardar,
}: NuevaCalibracionDialogProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaProgramada, setFechaProgramada] = useState<Date | null>(null);
  const [colaActual, setColaActual] = useState<TipoCola>('General');
  const [prioridad, setPrioridad] = useState<'alta' | 'media' | 'baja'>('media');

  const generarNumeroTarea = () => {
    const año = new Date().getFullYear();
    const numeroAleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CAL-${año}-${numeroAleatorio}`;
  };

  const handleGuardar = () => {
    const nuevaCalibracion: Calibracion = {
      id: crypto.randomUUID(),
      numeroTarea: generarNumeroTarea(),
      tipo,
      titulo,
      descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      estado: 'Pendiente',
      colaActual,
      responsable: usuarioActual,
      ownerActual: usuarioActual,
      participantes: [],
      fechaProgramada: fechaProgramada || undefined,
      comentarios: [],
      historialTransiciones: [
        {
          id: crypto.randomUUID(),
          fecha: new Date(),
          colaOrigen: 'General',
          colaDestino: 'General',
          ownerAnterior: usuarioActual,
          ownerNuevo: usuarioActual,
          usuario: usuarioActual,
          motivo: 'Creación de calibración',
        }
      ],
      prioridad,
      monitoreos: [],
    };

    onGuardar(nuevaCalibracion);
    // Limpiar el formulario
    setTitulo('');
    setDescripcion('');
    setFechaProgramada(null);
    setColaActual('General');
    setPrioridad('media');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Nueva {tipo}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <TextField
            fullWidth
            label="Fecha Programada"
            type="datetime-local"
            value={fechaProgramada ? fechaProgramada.toISOString().split('T')[0] : ''}
            onChange={(e) => setFechaProgramada(e.target.value ? new Date(e.target.value) : null)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Cola</InputLabel>
            <Select
              value={colaActual}
              onChange={(e) => setColaActual(e.target.value as TipoCola)}
            >
              {['General', 'Prioridad', 'Gerencia', 'Supervisión'].map((cola) => (
                <MenuItem key={cola} value={cola}>
                  {cola}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as 'alta' | 'media' | 'baja')}
            >
              <MenuItem value="baja">Baja</MenuItem>
              <MenuItem value="media">Media</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={!titulo || !descripcion}
        >
          Crear Calibración
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 