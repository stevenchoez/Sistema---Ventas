import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { tiendaApi } from '../services/api';

export default function Locales() {
  const [tiendas, setTiendas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTienda, setSelectedTienda] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    administrador: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTiendas();
  }, []);

  const loadTiendas = async () => {
    try {
      setLoading(true);
      setErrors({});
      const response = await tiendaApi.getAll();
      setTiendas(response.data.data || []);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Error al cargar las tiendas' });
      console.error(err);
      setTiendas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (tienda = null) => {
    if (tienda) {
      setSelectedTienda(tienda);
      setFormData({
        nombre: tienda.nombre,
        direccion: tienda.direccion,
        telefono: tienda.telefono,
        email: tienda.email,
        administrador: tienda.administrador,
      });
    } else {
      setSelectedTienda(null);
      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        administrador: '',
      });
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTienda(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      administrador: '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors({});
      if (selectedTienda) {
        await tiendaApi.update(selectedTienda.id, formData);
      } else {
        await tiendaApi.create(formData);
      }
      handleClose();
      loadTiendas();
    } catch (err) {
      console.error('Error saving store:', err);
      if (err.response?.status === 400 && err.response?.data?.errors) {
        // Manejar errores de validación
        const fieldErrors = {};
        err.response.data.errors.forEach(error => {
          fieldErrors[error.field] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ 
          general: err.response?.data?.message || 
                  'Error al guardar la tienda' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tienda?')) {
      try {
        setLoading(true);
        setErrors({});
        await tiendaApi.delete(id);
        loadTiendas();
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Error al eliminar la tienda' });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestión de Tiendas
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
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Nueva Tienda
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Administrador</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiendas.map((tienda) => (
              <TableRow key={tienda.id}>
                <TableCell>{tienda.nombre}</TableCell>
                <TableCell>{tienda.direccion}</TableCell>
                <TableCell>{tienda.telefono}</TableCell>
                <TableCell>{tienda.email}</TableCell>
                <TableCell>{tienda.administrador}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpen(tienda)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(tienda.id)}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTienda ? 'Editar Tienda' : 'Nueva Tienda'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
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
              value={formData.nombre}
              onChange={handleChange}
              required
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              margin="dense"
              name="direccion"
              label="Dirección"
              type="text"
              fullWidth
              value={formData.direccion}
              onChange={handleChange}
              required
              error={!!errors.direccion}
              helperText={errors.direccion}
            />
            <TextField
              margin="dense"
              name="telefono"
              label="Teléfono"
              type="tel"
              fullWidth
              value={formData.telefono}
              onChange={handleChange}
              required
              error={!!errors.telefono}
              helperText={errors.telefono}
              inputProps={{
                pattern: "[0-9]{10}",
                title: "El teléfono debe tener 10 dígitos"
              }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="dense"
              name="administrador"
              label="Administrador"
              type="text"
              fullWidth
              value={formData.administrador}
              onChange={handleChange}
              required
              error={!!errors.administrador}
              helperText={errors.administrador}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {selectedTienda ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
