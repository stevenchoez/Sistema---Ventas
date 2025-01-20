import { useState, useEffect, useCallback } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Inventory as InventoryIcon } from '@mui/icons-material';
import { productoApi, proveedorApi } from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [stockToAdd, setStockToAdd] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    codigo: '',
    stock: '',
    proveedorId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProductos();
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const response = await proveedorApi.getAll();      
      if (response?.data?.success) {
        setProveedores(response.data.data || []);
      } else {
        setProveedores([]);
        setErrors(prev => ({ 
          ...prev, 
          proveedores: 'No se pudo cargar la lista de proveedores' 
        }));
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);
      setProveedores([]);
      setErrors(prev => ({ 
        ...prev, 
        proveedores: err.response?.data?.message || 'Error al cargar los proveedores' 
      }));
    }
  };

  const loadProductos = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setErrors({});
      
      const response = await productoApi.getAll();
      
      if (response?.data?.success) {
        setProductos(response.data.data || []);
      } else {
        setProductos([]);
        throw new Error('No se pudo cargar la lista de productos');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setProductos([]);
      setErrors({ general: err.response?.data?.message || err.message || 'Error al cargar los productos' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (producto = null) => {
    if (producto) {
      setSelectedProducto(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria,
        codigo: producto.codigo || '',
        stock: producto.stock || '',
        proveedorId: producto.proveedorId || ''
      });
    } else {
      setSelectedProducto(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
        codigo: '',
        stock: '',
        proveedorId: ''
      });
    }
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProducto(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      codigo: '',
      stock: '',
      proveedorId: ''
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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setErrors({});
      
      const dataToSend = {
        ...formData,
        precio: Number(formData.precio),
        stock: Number(formData.stock)
      };
      
      if (selectedProducto) {
        await productoApi.update(selectedProducto.id, dataToSend);
      } else {
        await productoApi.create(dataToSend);
      }
      
      handleClose();
      await loadProductos();
    } catch (err) {
      console.error('Error saving product:', err);
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
                  'Error al guardar el producto' 
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formData, selectedProducto, loading]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto?')) return;
    
    try {
      setLoading(true);
      setErrors({});
      await productoApi.delete(id);
      await loadProductos();
    } catch (err) {
      console.error('Error deleting product:', err);
      setErrors({ general: err.response?.data?.message || 'Error al eliminar el producto' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setErrors({});
      
      // Usar el nuevo endpoint específico para stock
      const response = await productoApi.updateStock(selectedProducto.id, Number(stockToAdd));
      
      if (response?.data?.success) {
        setOpenStock(false);
        setStockToAdd('');
        await loadProductos();
      } else {
        throw new Error('No se pudo actualizar el stock');
      }
    } catch (err) {
      console.error('Error adding stock:', err);
      setErrors({ 
        general: err.response?.data?.message || 
                'Error al actualizar el stock' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStock = (producto) => {
    setSelectedProducto(producto);
    setStockToAdd('');
    setOpenStock(true);
  };

  const handleCloseStock = () => {
    setOpenStock(false);
    setSelectedProducto(null);
    setStockToAdd('');
    setErrors({});
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestión de Productos
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
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock en Bodega</TableCell>
              <TableCell>Stock Asignado</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>
                  {proveedores.find(p => p.id === producto.proveedorId)?.nombre || '-'}
                </TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.descripcion}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.stockAsignado}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpen(producto)}
                    disabled={loading}
                    title="Editar producto"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(producto.id)}
                    disabled={loading}
                    title="Eliminar producto"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenStock(producto)}
                    disabled={loading}
                    title="Agregar stock"
                    color="success"
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {errors.general && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.general}
              </Typography>
            )}
            <FormControl 
              fullWidth 
              margin="normal"
              error={!!errors.proveedorId}
            >
              <InputLabel id="proveedor-label">Proveedor</InputLabel>
              <Select
                labelId="proveedor-label"
                name="proveedorId"
                value={formData.proveedorId}
                onChange={handleChange}
                label="Proveedor"
                required
              >
                <MenuItem value="">
                  <em>Seleccione un proveedor</em>
                </MenuItem>
                {proveedores.map((proveedor) => (
                  <MenuItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.proveedorId && (
                <Typography variant="caption" color="error">
                  {errors.proveedorId}
                </Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Código"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.codigo}
              helperText={errors.codigo}
            />
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
            <TextField
              fullWidth
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.precio}
              helperText={errors.precio}
            />
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              margin="normal"
              error={!!errors.stock}
              helperText={errors.stock}
              disabled={selectedProducto !== null}
            />
            <TextField
              fullWidth
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              margin="normal"
              error={!!errors.categoria}
              helperText={errors.categoria}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {selectedProducto ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openStock} onClose={handleCloseStock}>
        <DialogTitle>
          Agregar Stock a {selectedProducto?.nombre}
        </DialogTitle>
        <form onSubmit={handleAddStock}>
          <DialogContent>
            {errors.general && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.general}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mb: 2 }}>
              Stock actual: {selectedProducto?.stock || 0}
            </Typography>
            <TextField
              fullWidth
              label="Cantidad a agregar"
              name="stockToAdd"
              value={stockToAdd}
              onChange={(e) => setStockToAdd(e.target.value)}
              required
              margin="normal"
              type="number"
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStock} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading || !stockToAdd || Number(stockToAdd) < 1}
            >
              Agregar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
