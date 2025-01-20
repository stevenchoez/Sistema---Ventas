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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { productoTiendaApi, productoApi, tiendaApi } from '../services/api';

export default function ProductosTienda() {
  const [productosTienda, setProductosTienda] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProductoTienda, setSelectedProductoTienda] = useState(null);
  const [formData, setFormData] = useState({
    tiendaId: '',
    productoId: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTienda, setSelectedTienda] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTienda) {
      loadProductosTienda(selectedTienda);
    }
  }, [selectedTienda]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [tiendaResponse, productoResponse] = await Promise.all([
        tiendaApi.getAll(),
        productoApi.getAll()
      ]);

      if (tiendaResponse?.data?.success) {
        setTiendas(tiendaResponse.data.data);
        setError(null);
      } else {
        setTiendas([]);
        setError('No hay tiendas disponibles');
      }

      if (productoResponse?.data?.success) {
        setProductos(productoResponse.data.data);
        setError(null);
      } else {
        setProductos([]);
        setError('No hay productos disponibles');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
      setTiendas([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductosTienda = async (tiendaId) => {
    try {
      setLoading(true);
      const response = await productoTiendaApi.getByTienda(tiendaId);
      
      if (response?.data?.success) {
        setProductosTienda(response.data.data);
        setError(null);
      } else {
        setProductosTienda([]);
        setError('No hay productos asignados a esta tienda');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.response?.data?.message || 'Error al cargar los productos de la tienda');
      setProductosTienda([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (productoTienda = null) => {
    try {
      const productoResponse = await productoApi.getAll();
      
      if (productoResponse?.data?.success) {
        setProductos(productoResponse.data.data);
      }

      const productosDisponibles = productos.filter(producto => 
        !productosTienda.some(pt => pt.productoId === producto.id) &&
        producto.stock > 0
      );

      if (productoTienda) {
        setSelectedProductoTienda(productoTienda);
        setFormData({
          tiendaId: selectedTienda,
          productoId: productoTienda.productoId,
          stock: productoTienda.stock,
        });
      } else {
        setSelectedProductoTienda(null);
        setFormData({
          tiendaId: selectedTienda,
          productoId: '',
          stock: '',
        });
      }
      setOpen(true);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar los productos disponibles');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductoTienda(null);
    setFormData({
      tiendaId: selectedTienda,
      productoId: '',
      stock: '',
    });
    setError(null);
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
      if (selectedProductoTienda) {
        await productoTiendaApi.actualizarStock(
          formData.tiendaId,
          formData.productoId,
          parseInt(formData.stock)
        );
      } else {
        await productoTiendaApi.asignarProducto({
          ...formData,
          stock: parseInt(formData.stock)
        });
      }
      
      // Solo actualizar la lista de productos de la tienda
      await loadProductosTienda(selectedTienda);
      
      handleClose();
      setError(null);
      
      // Actualizar la lista de productos global después
      loadInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el producto en la tienda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tiendaId, productoId) => {
    if (window.confirm('¿Está seguro de eliminar este producto de la tienda?')) {
      try {
        setLoading(true);
        await productoTiendaApi.eliminarProducto(tiendaId, productoId);
        
        // Actualizar ambas tablas
        await Promise.all([
          loadProductosTienda(selectedTienda),
          loadInitialData() // Actualizar la lista de productos global
        ]);
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar el producto de la tienda');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Productos por Tienda
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mb: 4, width: '100%' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Seleccionar Tienda</InputLabel>
          <Select
            value={selectedTienda}
            label="Seleccionar Tienda"
            onChange={(e) => setSelectedTienda(e.target.value)}
            disabled={loading}
          >
            {tiendas.map((tienda) => (
              <MenuItem key={tienda.id} value={tienda.id}>
                {tienda.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedTienda && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              disabled={loading}
            >
              Agregar Producto
            </Button>
          </Box>
        )}
      </Box>

      {selectedTienda && (
        <TableContainer component={Paper} sx={{ width: '100%', mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock Asignado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosTienda.map((pt) => (
                <TableRow key={`${pt.tiendaId}-${pt.productoId}`}>
                  <TableCell>{pt.codigoProducto}</TableCell>
                  <TableCell>{pt.nombreProducto}</TableCell>
                  <TableCell>${productos.find(p => p.id === pt.productoId)?.precio?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{pt.stock}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenDialog(pt)}
                      disabled={loading}
                      color="primary"
                      title="Editar stock"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(pt.tiendaId, pt.productoId)}
                      disabled={loading}
                      color="error"
                      title="Eliminar asignación"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {productosTienda.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay productos asignados a esta tienda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProductoTienda ? 'Editar Stock' : 'Agregar Producto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {!selectedProductoTienda && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Producto</InputLabel>
                <Select
                  name="productoId"
                  value={formData.productoId}
                  label="Producto"
                  onChange={handleChange}
                  required
                >
                  {productos
                    .filter(producto => 
                      // Filtrar productos que ya están asignados a esta tienda
                      !productosTienda.some(pt => pt.productoId === producto.id) &&
                      // Filtrar productos con stock disponible
                      producto.stock > 0
                    )
                    .map((producto) => (
                      <MenuItem key={producto.id} value={producto.id}>
                        {`${producto.codigo} - ${producto.nombre} (Stock disponible: ${producto.stock})`}
                      </MenuItem>
                    ))}
                  {productos.length > 0 && productos.filter(producto => 
                    !productosTienda.some(pt => pt.productoId === producto.id) &&
                    producto.stock > 0
                  ).length === 0 && (
                    <MenuItem disabled value="">
                      No hay productos disponibles para asignar
                    </MenuItem>
                  )}
                </Select>
                <FormHelperText>
                  {productos.length === 0 ? 'Cargando productos...' : ''}
                </FormHelperText>
              </FormControl>
            )}
            <TextField
              margin="dense"
              name="stock"
              label="Stock a Asignar"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={handleChange}
              required
              inputProps={{ 
                min: 1,
                max: selectedProductoTienda 
                  ? productos.find(p => p.id === selectedProductoTienda.productoId)?.stock + selectedProductoTienda.stock 
                  : productos.find(p => p.id === formData.productoId)?.stock || 0
              }}
              helperText={
                formData.productoId 
                  ? `Stock disponible: ${productos.find(p => p.id === formData.productoId)?.stock || 0}`
                  : 'Seleccione un producto primero'
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {selectedProductoTienda ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
