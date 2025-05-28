import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Tabs, Tab, Typography, AppBar, Toolbar, useTheme, Paper, Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { RulesManager } from './components/RulesManager/RulesManager';
import { TaggingManager } from './components/TaggingManager/TaggingManager';
import { CalibracionManager } from './components/CalibracionManager/CalibracionManager';
import { MetricsManager } from './components/MetricsManager/MetricsManager';
import { TeamLeaderMetrics } from './components/MetricsManager/TeamLeaderMetrics';
import { SupervisorMetrics } from './components/MetricsManager/SupervisorMetrics';
import { Login } from './components/Auth/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import type { Monitoreo, Calibracion, ReglaTransicion, Usuario, TipoElemento } from './types/types';
import { TipoPosicion, TipoEquipo, TipoCentro } from './types/types';
import { monitoreosMock, usuariosMock } from './data/mockMonitoreos';

// Mock data inicial
const usuarioMock: Usuario = {
  id: '1',
  nombre: 'Juan Pérez',
  rol: 'Administrador',
  posicion: TipoPosicion.TeamLeader,
  equipo: TipoEquipo.MercadoEnvios,
  centro: TipoCentro.HSP,
};

const monitoreosIniciales: Monitoreo[] = monitoreosMock;

// Actualizar usuariosIniciales para incluir nuestro gerente
const usuariosIniciales: Usuario[] = [
  {
    id: '0',
    nombre: 'Admin Sistema',
    rol: 'Administrador',
    posicion: TipoPosicion.TeamLeader,
    equipo: TipoEquipo.MercadoEnvios,
    centro: TipoCentro.HSP,
  },
  usuariosMock.gerente,
  usuariosMock.teamLeader,
  ...usuariosMock.representantes,
];

const reglasIniciales: ReglaTransicion[] = [
  {
    id: '1',
    nombre: 'Casos Medio Alto a Gerencia',
    condiciones: {
      nivelTag: ['Medio Alto'],
    },
    accion: {
      colaDestino: 'Gerencia',
      notificarA: ['Gerente'],
    },
    activo: true,
  },
  // Agregar más reglas mock aquí
];

// Crear tema personalizado
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Nuevo componente para las subtabs de Tus Tareas
interface TaskTabPanelProps {
  monitoreos: Monitoreo[];
  usuarioActual: Usuario;
  usuariosDisponibles: Usuario[];
  onMonitoreoUpdate: (monitoreo: Monitoreo) => void;
  onMonitoreoCreate: (monitoreo: Monitoreo) => void;
}

interface SubTab {
  label: string;
  filter: (m: Monitoreo) => boolean;
}

interface MainTab {
  label: string;
  subtabs: SubTab[];
}

interface RegularTab {
  label: string;
  filter: (m: Monitoreo) => boolean;
}

type Tab = MainTab | RegularTab;

function isMainTab(tab: Tab): tab is MainTab {
  return 'subtabs' in tab;
}

function TaskTabs({ monitoreos, usuarioActual, usuariosDisponibles, onMonitoreoUpdate, onMonitoreoCreate }: TaskTabPanelProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubTab, setSelectedSubTab] = useState(0);
  const [selectedMainTab, setSelectedMainTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedMainTab(newValue);
    setSelectedSubTab(0);
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedSubTab(newValue);
  };

  // Función para filtrar monitoreos según el rol y tipo
  const filtrarMonitoreosPorRol = (monitoreos: Monitoreo[]): Monitoreo[] => {
    switch (usuarioActual.rol) {
      case 'Administrador':
        return monitoreos; // El administrador ve todos los monitoreos
      case 'Team Leader':
        return monitoreos.filter(m => 
          m.colaActual === 'General' || 
          m.colaActual === 'Prioridad'
        );
      case 'Supervisor':
        return monitoreos.filter(m => 
          m.colaActual === 'Supervisión' ||
          m.marcarParaCalibracion?.tipo === 'Calibración Supervisores'
        );
      case 'Gerente':
        return monitoreos.filter(m => 
          m.colaActual === 'Gerencia' ||
          m.marcarParaCalibracion?.tipo === 'Calibración Managers' ||
          m.casoDeOrgullo
        );
      default:
        return [];
    }
  };

  // Configuración de pestañas según el rol
  const getTabs = (): Tab[] => {
    switch (usuarioActual.rol) {
      case 'Administrador':
        return [
          {
            label: 'Team Leaders',
            subtabs: [
              { label: 'Cola General', filter: (m: Monitoreo) => m.colaActual === 'General' },
              { label: 'Cola Prioridad', filter: (m: Monitoreo) => m.colaActual === 'Prioridad' }
            ]
          },
          {
            label: 'Supervisores',
            subtabs: [
              { label: 'Cola Supervisión', filter: (m: Monitoreo) => m.colaActual === 'Supervisión' },
              { label: 'Calibraciones', filter: (m: Monitoreo) => m.marcarParaCalibracion?.tipo === 'Calibración Supervisores' }
            ]
          },
          {
            label: 'Gerentes',
            subtabs: [
              { label: 'Cola Gerencia', filter: (m: Monitoreo) => m.colaActual === 'Gerencia' },
              { label: 'Casos de Orgullo', filter: (m: Monitoreo) => m.casoDeOrgullo },
              { label: 'Calibraciones', filter: (m: Monitoreo) => m.marcarParaCalibracion?.tipo === 'Calibración Managers' }
            ]
          }
        ];
      case 'Team Leader':
        return [
          { label: 'Cola General', filter: (m: Monitoreo) => m.colaActual === 'General' },
          { label: 'Cola Prioridad', filter: (m: Monitoreo) => m.colaActual === 'Prioridad' },
          { label: 'Pendientes de Calibración', filter: (m: Monitoreo) => m.marcarParaCalibracion !== undefined }
        ];
      case 'Supervisor':
        return [
          { label: 'Cola Supervisión', filter: (m: Monitoreo) => m.colaActual === 'Supervisión' },
          { label: 'Calibraciones Pendientes', filter: (m: Monitoreo) => m.marcarParaCalibracion?.tipo === 'Calibración Supervisores' },
          { label: 'Casos Marcados', filter: (m: Monitoreo) => m.marcarParaCalibracion !== undefined || m.casoDeOrgullo }
        ];
      case 'Gerente':
        return [
          { label: 'Cola Gerencia', filter: (m: Monitoreo) => m.colaActual === 'Gerencia' },
          { label: 'Casos de Orgullo', filter: (m: Monitoreo) => m.casoDeOrgullo },
          { label: 'Calibraciones Pendientes', filter: (m: Monitoreo) => m.marcarParaCalibracion?.tipo === 'Calibración Managers' }
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();
  const monitoreosFiltrados = filtrarMonitoreosPorRol(monitoreos);

  // Vista especial para administrador con pestañas anidadas
  if (usuarioActual.rol === 'Administrador') {
    const adminTabs = tabs as MainTab[];
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Panel de Administrador
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={selectedMainTab} onChange={handleMainTabChange} aria-label="main admin tabs">
            {adminTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {adminTabs.map((mainTab, mainIndex) => (
          <TabPanel key={mainIndex} value={selectedMainTab} index={mainIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={selectedSubTab} onChange={handleSubTabChange} aria-label="sub admin tabs">
                {mainTab.subtabs.map((subTab, subIndex) => (
                  <Tab key={subIndex} label={subTab.label} />
                ))}
              </Tabs>
            </Box>

            {mainTab.subtabs.map((subTab, subIndex) => (
              <TabPanel key={subIndex} value={selectedSubTab} index={subIndex}>
                <TaggingManager
                  monitoreos={monitoreosFiltrados.filter(subTab.filter)}
                  usuarioActual={usuarioActual}
                  usuariosDisponibles={usuariosDisponibles}
                  onMonitoreoUpdate={onMonitoreoUpdate}
                  onMonitoreoCreate={onMonitoreoCreate}
                />
              </TabPanel>
            ))}
          </TabPanel>
        ))}
      </Box>
    );
  }

  // Vista normal para otros roles
  const regularTabs = tabs as RegularTab[];
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Panel de {usuarioActual.rol}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="task queues tabs">
          {regularTabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {regularTabs.map((tab, index) => (
        <TabPanel key={index} value={selectedTab} index={index}>
          <TaggingManager
            monitoreos={monitoreosFiltrados.filter(tab.filter)}
            usuarioActual={usuarioActual}
            usuariosDisponibles={usuariosDisponibles}
            onMonitoreoUpdate={onMonitoreoUpdate}
            onMonitoreoCreate={onMonitoreoCreate}
          />
        </TabPanel>
      ))}
    </Box>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [monitoreos, setMonitoreos] = useState<Monitoreo[]>(monitoreosIniciales);
  const [calibraciones, setCalibraciones] = useState<Calibracion[]>([]);
  const [reglas, setReglas] = useState<ReglaTransicion[]>(reglasIniciales);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMonitoreoUpdate = (monitoreoActualizado: Monitoreo) => {
    setMonitoreos(monitoreos.map(m => 
      m.id === monitoreoActualizado.id ? monitoreoActualizado : m
    ));
  };

  const handleMonitoreoCreate = (nuevoMonitoreo: Monitoreo) => {
    setMonitoreos([...monitoreos, nuevoMonitoreo]);
  };

  const handleCalibracionUpdate = (calibracionActualizada: Calibracion) => {
    setCalibraciones(calibraciones.map(c => 
      c.id === calibracionActualizada.id ? calibracionActualizada : c
    ));
  };

  const handleCalibracionCreate = (nuevaCalibracion: Calibracion) => {
    setCalibraciones([...calibraciones, nuevaCalibracion]);
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    setTabValue(0);
  };

  // Función para determinar qué pestañas mostrar según el rol
  const getTabs = () => {
    if (!usuarioActual) return [];

    switch (usuarioActual.rol) {
      case 'Administrador':
        return [
          { label: 'Monitoreos', disabled: false },
          { label: 'Reglas', disabled: false },
          { label: 'Métricas', disabled: false },
        ];
      case 'Team Leader':
        return [
          { label: 'Monitoreos', disabled: false },
          { label: 'Métricas', disabled: false },
        ];
      case 'Supervisor':
        return [
          { label: 'Monitoreos', disabled: false },
          { label: 'Métricas', disabled: false },
        ];
      case 'Gerente':
        return [
          { label: 'Monitoreos', disabled: false },
          { label: 'Métricas', disabled: false },
        ];
      default:
        return [];
    }
  };

  // Filtrar métricas según el rol
  const getMetricasFiltradasPorRol = () => {
    if (!usuarioActual) return [];

    switch (usuarioActual.rol) {
      case 'Administrador':
        return monitoreos;
      case 'Team Leader':
        return monitoreos.filter(m => 
          (m.colaActual === 'General' || m.colaActual === 'Prioridad') &&
          m.ownerActual.id === usuarioActual.id
        );
      case 'Supervisor':
        return monitoreos.filter(m => m.colaActual === 'Supervisión');
      case 'Gerente':
        return monitoreos.filter(m => 
          m.colaActual === 'Gerencia' || 
          m.colaActual === 'Supervisión' || 
          m.casoDeOrgullo
        );
      default:
        return [];
    }
  };

  if (!usuarioActual) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={setUsuarioActual} usuarios={usuariosIniciales} />
      </ThemeProvider>
    );
  }

  const tabs = getTabs();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'white',
          mb: 2 
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" component="h1" sx={{ color: 'primary.main' }}>
                Customer Service Task Manager
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Sistema de Gestión de Monitoreos y Calibraciones
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle1">
                {usuarioActual.nombre} ({usuarioActual.rol})
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              {getTabs().map((tab, index) => (
                <Tab 
                  key={index} 
                  label={tab.label} 
                  disabled={tab.disabled}
                />
              ))}
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TaggingManager
                monitoreos={monitoreos}
                usuarioActual={usuarioActual}
                usuariosDisponibles={usuariosIniciales}
                onMonitoreoUpdate={handleMonitoreoUpdate}
                onMonitoreoCreate={handleMonitoreoCreate}
              />
              <CalibracionManager
                calibraciones={calibraciones}
                usuarioActual={usuarioActual}
                onCalibracionUpdate={handleCalibracionUpdate}
                onCalibracionCreate={handleCalibracionCreate}
                tipo="Calibración Supervisores"
              />
              <CalibracionManager
                calibraciones={calibraciones}
                usuarioActual={usuarioActual}
                onCalibracionUpdate={handleCalibracionUpdate}
                onCalibracionCreate={handleCalibracionCreate}
                tipo="Calibración Managers"
              />
            </Box>
          </TabPanel>

          {usuarioActual.rol === 'Administrador' ? (
            <TabPanel value={tabValue} index={1}>
              <RulesManager
                reglas={reglas}
                onReglasChange={setReglas}
                readOnly={false}
              />
            </TabPanel>
          ) : null}

          <TabPanel value={tabValue} index={usuarioActual.rol === 'Administrador' ? 2 : 1}>
            {usuarioActual.rol === 'Team Leader' ? (
              <TeamLeaderMetrics 
                monitoreos={monitoreos.filter(m => 
                  (m.colaActual === 'General' || m.colaActual === 'Prioridad') &&
                  m.ownerActual.id === usuarioActual.id
                )} 
                usuarioActual={usuarioActual} 
              />
            ) : usuarioActual.rol === 'Supervisor' ? (
              <SupervisorMetrics 
                monitoreos={monitoreos.filter(m => m.colaActual === 'Supervisión')} 
                usuarioActual={usuarioActual} 
              />
            ) : (
              <MetricsManager
                monitoreos={getMetricasFiltradasPorRol()}
                usuarios={usuariosIniciales}
                usuarioActual={usuarioActual}
              />
            )}
          </TabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
