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
import { proveedorApi } from '../services/api';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      setErrors({});
      const response = await proveedorApi.getAll();
      setProveedores(response.data.data || []);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Error al cargar los proveedores' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (proveedor = null) => {
    if (proveedor) {
      setSelectedProveedor(proveedor);
      setFormData({
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        direccion: proveedor.direccion,
        telefono: proveedor.telefono,
        email: proveedor.email,
      });
    } else {
      setSelectedProveedor(null);
      setFormData({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        email: '',
      });
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProveedor(null);
    setFormData({
      nombre: '',
      ruc: '',
      direccion: '',
      telefono: '',
      email: '',
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

  const validateRuc = (ruc) => {
    return /^\d{13}$/.test(ruc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRuc(formData.ruc)) {
      setErrors({ ruc: 'El RUC debe tener exactamente 13 dígitos' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      const proveedorData = {
        ...formData,
        estado: 'ACTIVO'
      };
      
      if (selectedProveedor) {
        await proveedorApi.update(selectedProveedor.id, proveedorData);
      } else {
        await proveedorApi.create(proveedorData);
      }
      handleClose();
      loadProveedores();
    } catch (err) {
      console.error('Error saving supplier:', err);
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
                  'Error al guardar el proveedor' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
      try {
        setLoading(true);
        setErrors({});
        await proveedorApi.delete(id);
        loadProveedores();
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Error al eliminar el proveedor' });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestión de Proveedores
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
          Nuevo Proveedor
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>RUC</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow key={proveedor.id}>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.ruc}</TableCell>
                <TableCell>{proveedor.direccion}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.email}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpen(proveedor)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(proveedor.id)}
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
          {selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
              name="ruc"
              label="RUC"
              type="text"
              fullWidth
              value={formData.ruc}
              onChange={handleChange}
              required
              error={!!errors.ruc}
              helperText={errors.ruc}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {selectedProveedor ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
