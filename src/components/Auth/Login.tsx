import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import type { Usuario, RolUsuario } from '../../types/types';

interface LoginProps {
  onLogin: (usuario: Usuario) => void;
  usuarios: Usuario[];
}

export function Login({ onLogin, usuarios }: LoginProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleLogin = () => {
    const usuario = usuarios.find(u => u.id === selectedUser);
    if (usuario) {
      onLogin(usuario);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Customer Service Task Manager
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Seleccionar Usuario</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              label="Seleccionar Usuario"
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.nombre} - {usuario.rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            disabled={!selectedUser}
          >
            Ingresar
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 