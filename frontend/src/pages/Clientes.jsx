import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { clienteApi } from '../services/api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({
    nombre: '',
    identificacion: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await clienteApi.getAll();
      if (response?.data?.data) {
        setClientes(response.data.data);
        setErrors({});
      } else {
        setClientes([]);
        setErrors({ general: 'No hay clientes disponibles' });
      }
    } catch (err) {
      console.error('Error loading clients:', err);
      setErrors({ general: err.response?.data?.message || 'Error al cargar los clientes' });
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (cliente = null) => {
    if (cliente) {
      setCurrentCliente(cliente);
    } else {
      setCurrentCliente({
        nombre: '',
        identificacion: '',
        email: '',
        telefono: '',
        direccion: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentCliente.id) {
        await clienteApi.update(currentCliente.id, currentCliente);
      } else {
        await clienteApi.create(currentCliente);
      }
      handleCloseDialog();
      loadClientes();
      setErrors({});
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(error => {
          fieldErrors[error.field] = error.defaultMessage;
        });
        setErrors(fieldErrors);
      } else {
        // Manejar error general
        setErrors({ 
          general: err.response?.data?.message || 
                  err.response?.data?.error || 
                  'Error al guardar el cliente' 
        });
      }
      console.error('Error saving client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        setLoading(true);
        await clienteApi.delete(id);
        loadClientes();
        setErrors({});
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Error al eliminar el cliente' });
        console.error('Error deleting client:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestión de Clientes
      </Typography>

      {errors.general && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.general}
        </Typography>
      )}

      <Box sx={{ mb: 4, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Nuevo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Identificación</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.identificacion}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenDialog(cliente)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(cliente.id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {currentCliente.id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogContent>
            {errors.general && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.general}
              </Typography>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre"
              type="text"
              fullWidth
              value={currentCliente.nombre}
              onChange={handleInputChange}
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              margin="dense"
              name="identificacion"
              label="Identificación"
              type="text"
              fullWidth
              value={currentCliente.identificacion}
              onChange={handleInputChange}
              required
              error={!!errors.identificacion}
              helperText={errors.identificacion}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={currentCliente.email}
              onChange={handleInputChange}
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="dense"
              name="telefono"
              label="Teléfono"
              type="tel"
              fullWidth
              value={currentCliente.telefono}
              onChange={handleInputChange}
              required
              error={!!errors.telefono}
              helperText={errors.telefono}
            />
            <TextField
              margin="dense"
              name="direccion"
              label="Dirección"
              type="text"
              fullWidth
              value={currentCliente.direccion}
              onChange={handleInputChange}
              required
              error={!!errors.direccion}
              helperText={errors.direccion}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {currentCliente.id ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
