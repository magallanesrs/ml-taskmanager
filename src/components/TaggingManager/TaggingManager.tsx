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
  Switch,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
} from '../../types/types';
import { NIVELES_TAG } from '../../types/types';

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

  const puedeTaggear = (nivelTag: NivelTag): boolean => {
    switch (usuarioActual.rol) {
      case 'Team Leader':
        return ['Bajo', 'Medio Bajo'].includes(nivelTag);
      case 'Supervisor':
        return ['Bajo', 'Medio Bajo', 'Medio Alto'].includes(nivelTag);
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
              <TableCell>Cola</TableCell>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2">
                      {monitoreo.ownerActual.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {monitoreo.ownerActual.rol} - {monitoreo.ownerActual.equipo}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{monitoreo.colaActual}</TableCell>
                <TableCell>
                  {monitoreo.casoDeOrgullo && (
                    <EmojiEventsIcon color="primary" />
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

      <TaggingDialog
        open={openDialog}
        monitoreo={monitoreoSeleccionado}
        usuarioActual={usuarioActual}
        usuariosDisponibles={usuariosDisponibles}
        onClose={() => {
          setOpenDialog(false);
          setMonitoreoSeleccionado(null);
        }}
        onGuardar={(monitoreoActualizado) => {
          onMonitoreoUpdate(monitoreoActualizado);
          setOpenDialog(false);
          setMonitoreoSeleccionado(null);
        }}
        puedeTaggear={puedeTaggear}
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

interface TaggingDialogProps {
  open: boolean;
  monitoreo: Monitoreo | null;
  usuarioActual: Usuario;
  usuariosDisponibles: Usuario[];
  onClose: () => void;
  onGuardar: (monitoreo: Monitoreo) => void;
  puedeTaggear: (nivelTag: NivelTag) => boolean;
}

const TaggingDialog = ({
  open,
  monitoreo,
  usuarioActual,
  usuariosDisponibles,
  onClose,
  onGuardar,
  puedeTaggear,
}: TaggingDialogProps) => {
  const [bienvenida, setBienvenida] = useState<NivelTag | undefined>(monitoreo?.bienvenida);
  const [exploracion, setExploracion] = useState<NivelTag | undefined>(monitoreo?.exploracion);
  const [guiaAsesoramiento, setGuiaAsesoramiento] = useState<NivelTag | undefined>(monitoreo?.guiaAsesoramiento);
  const [cierre, setCierre] = useState<NivelTag | undefined>(monitoreo?.cierre);
  const [adhesionGeneral, setAdhesionGeneral] = useState<NivelTag | undefined>(monitoreo?.adhesionGeneral);
  const [casoDeOrgullo, setCasoDeOrgullo] = useState(monitoreo?.casoDeOrgullo || false);

  const handleGuardar = () => {
    if (!monitoreo) return;

    const monitoreoActualizado: Monitoreo = {
      ...monitoreo,
      tipo: 'Monitoreo',
      bienvenida,
      exploracion,
      guiaAsesoramiento,
      cierre,
      adhesionGeneral,
      casoDeOrgullo,
      fechaActualizacion: new Date(),
      historialAcciones: [
        ...monitoreo.historialAcciones,
        {
          id: crypto.randomUUID(),
          tipo: 'Taggeo',
          fecha: new Date(),
          usuario: usuarioActual,
          detalles: {
            casoDeOrgulloAnterior: monitoreo.casoDeOrgullo,
            casoDeOrgulloNuevo: casoDeOrgullo,
          },
        },
      ],
    };

    onGuardar(monitoreoActualizado);
  };

  const renderEvaluacionField = (
    label: string,
    value: NivelTag | undefined,
    onChange: (value: NivelTag) => void
  ) => (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as NivelTag)}
        label={label}
      >
        {NIVELES_TAG.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Divider sx={{ mt: 2 }} />
    </FormControl>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h5" sx={{ color: 'primary.main' }}>
            Caso #{monitoreo?.numeroCaso}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Representante: {monitoreo?.ownerActual.nombre}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {renderEvaluacionField(
            'Bienvenida',
            bienvenida,
            setBienvenida
          )}
          
          {renderEvaluacionField(
            'Exploración',
            exploracion,
            setExploracion
          )}
          
          {renderEvaluacionField(
            'Guía y Asesoramiento',
            guiaAsesoramiento,
            setGuiaAsesoramiento
          )}
          
          {renderEvaluacionField(
            'Cierre',
            cierre,
            setCierre
          )}
          
          {renderEvaluacionField(
            'Adhesión General',
            adhesionGeneral,
            setAdhesionGeneral
          )}
          
          <FormControl fullWidth>
            <InputLabel>Caso Orgullo</InputLabel>
            <Select
              value={casoDeOrgullo ? 'Sí' : 'No'}
              onChange={(e) => setCasoDeOrgullo(e.target.value === 'Sí')}
              label="Caso Orgullo"
            >
              {['Sí', 'No'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">
          Guardar
        </Button>
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
  const [descripcion, setDescripcion] = useState('');
  const [nivelTag, setNivelTag] = useState<NivelTag>('Medio Bajo');
  const [colaActual, setColaActual] = useState<TipoCola>('General');
  const [prioridad, setPrioridad] = useState<'alta' | 'media' | 'baja'>('media');
  const [casoDeOrgullo, setCasoDeOrgullo] = useState(false);
  const [marcarParaCalibracion, setMarcarParaCalibracion] = useState<'Calibración Supervisores' | 'Calibración Managers' | undefined>();

  const puedeMarcarParaCalibracion = usuarioActual.rol === 'Supervisor' || usuarioActual.rol === 'Team Leader';

  const generarNumeroTarea = () => {
    const año = new Date().getFullYear();
    const numeroAleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TAREA-${año}-${numeroAleatorio}`;
  };

  const obtenerTituloSegunTipo = (tipo: TipoElemento) => {
    switch (tipo) {
      case 'Monitoreo':
        return 'Monitoreo de Caso';
      case 'Calibración Supervisores':
        return 'Calibración Supervisores';
      case 'Calibración Managers':
        return 'Calibración Managers';
      default:
        return 'Monitoreo de Caso';
    }
  };

  const handleCasoDeOrgulloChange = (checked: boolean) => {
    setCasoDeOrgullo(checked);
    if (checked) {
      setColaActual('Gerencia');
      setMarcarParaCalibracion('Calibración Managers');
    }
  };

  const handleGuardar = () => {
    const nuevoMonitoreo: Monitoreo = {
      id: crypto.randomUUID(),
      numeroTarea: generarNumeroTarea(),
      tipo: 'Monitoreo',
      numeroCaso,
      titulo: obtenerTituloSegunTipo('Monitoreo'),
      descripcion,
      fechaCreacion: new Date(),
      estado: 'Pendiente',
      nivelTag,
      colaActual: casoDeOrgullo ? 'Gerencia' : colaActual,
      ownerActual: usuarioActual,
      historialTransiciones: [
        {
          id: crypto.randomUUID(),
          fecha: new Date(),
          colaOrigen: 'General',
          colaDestino: casoDeOrgullo ? 'Gerencia' : colaActual,
          ownerAnterior: usuarioActual,
          ownerNuevo: usuarioActual,
          usuario: usuarioActual,
          motivo: 'Creación de monitoreo',
        }
      ],
      prioridad,
      casoDeOrgullo,
      marcarParaCalibracion: marcarParaCalibracion ? {
        tipo: marcarParaCalibracion,
        fechaMarcado: new Date(),
        marcadoPor: usuarioActual,
      } : undefined,
      historialAcciones: [
        {
          id: crypto.randomUUID(),
          tipo: marcarParaCalibracion ? 'Marcado para Calibración' : 'Creacion',
          fecha: new Date(),
          usuario: usuarioActual,
          detalles: {
            comentario: [
              'Monitoreo creado',
              marcarParaCalibracion && `[CALIBRACIÓN] Marcado para ${marcarParaCalibracion}`,
              casoDeOrgullo && '[CASO DE ORGULLO] Asignado automáticamente a cola de Gerencia y Calibración Managers'
            ].filter(Boolean).join('\n'),
            casoDeOrgulloNuevo: casoDeOrgullo,
            colaNueva: casoDeOrgullo ? 'Gerencia' : colaActual,
            ownerNuevo: usuarioActual,
            tipoCalibracion: marcarParaCalibracion,
          },
        },
      ],
    };

    onGuardar(nuevoMonitoreo);
    // Limpiar el formulario
    setNumeroCaso('');
    setDescripcion('');
    setNivelTag('Medio Bajo');
    setColaActual('General');
    setPrioridad('media');
    setCasoDeOrgullo(false);
    setMarcarParaCalibracion(undefined);
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
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="nivel-adhesion-label">Nivel de Adhesión</InputLabel>
            <Select
              labelId="nivel-adhesion-label"
              label="Nivel de Adhesión"
              value={nivelTag}
              onChange={(e) => setNivelTag(e.target.value as NivelTag)}
            >
              <MenuItem value="Bajo">Bajo</MenuItem>
              <MenuItem value="Medio Bajo">Medio Bajo</MenuItem>
              <MenuItem value="Medio Alto">Medio Alto</MenuItem>
              <MenuItem value="Alto">Alto</MenuItem>
            </Select>
          </FormControl>

          {puedeMarcarParaCalibracion && !casoDeOrgullo && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Marcar para Calibración</InputLabel>
              <Select
                value={marcarParaCalibracion || ''}
                onChange={(e) => setMarcarParaCalibracion(e.target.value as 'Calibración Supervisores' | 'Calibración Managers' | undefined)}
              >
                <MenuItem value="">
                  <em>No marcar para calibración</em>
                </MenuItem>
                <MenuItem value="Calibración Supervisores">Calibración Supervisores</MenuItem>
                <MenuItem value="Calibración Managers">Calibración Managers</MenuItem>
              </Select>
              <FormHelperText>
                Solo disponible para Team Leaders y Supervisores
              </FormHelperText>
            </FormControl>
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Cola</InputLabel>
            <Select
              value={casoDeOrgullo ? 'Gerencia' : colaActual}
              onChange={(e) => setColaActual(e.target.value as TipoCola)}
              disabled={casoDeOrgullo}
            >
              {['General', 'Prioridad', 'Gerencia', 'Supervisión'].map((cola) => (
                <MenuItem key={cola} value={cola}>
                  {cola}
                </MenuItem>
              ))}
            </Select>
            {casoDeOrgullo && (
              <FormHelperText>
                Los casos de orgullo se asignan automáticamente a la cola de Gerencia y Calibración Managers
              </FormHelperText>
            )}
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

          <FormControlLabel
            control={
              <Switch
                checked={casoDeOrgullo}
                onChange={(e) => handleCasoDeOrgulloChange(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEventsIcon color={casoDeOrgullo ? 'primary' : 'disabled'} />
                <Typography>Caso de Orgullo</Typography>
              </Box>
            }
            sx={{ mt: 2, mb: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          disabled={!numeroCaso || !descripcion}
        >
          Crear Monitoreo
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 