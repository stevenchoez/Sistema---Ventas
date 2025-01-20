import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
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
  Grid,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../services/api';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevaVenta, setNuevaVenta] = useState({
    clienteId: '',
    tiendaId: '',
    detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }]
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [ventasRes, clientesRes, tiendasRes] = await Promise.all([
        api.get('/ventas'),
        api.get('/clientes'),
        api.get('/tiendas')
      ]);

      if (!ventasRes.data?.success || !clientesRes.data?.success || !tiendasRes.data?.success) {
        throw new Error('Error al cargar los datos iniciales');
      }

      setVentas(ventasRes.data?.data || []);
      setClientes(clientesRes.data?.data || []);
      setTiendas(tiendasRes.data?.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos: ' + (error.response?.data?.message || error.message));
    }
  };

  const cargarProductosTienda = async (tiendaId) => {
    try {
      const response = await api.get(`/productos/tienda/${tiendaId}`);
      if (!response.data?.success) {
        throw new Error('Error al cargar productos de la tienda');
      }
      setProductos(response.data?.data || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTiendaChange = async (e) => {
    const tiendaId = e.target.value;
    setNuevaVenta(prev => ({
      ...prev,
      tiendaId,
      detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }]
    }));
    if (tiendaId) {
      await cargarProductosTienda(tiendaId);
    } else {
      setProductos([]);
    }
  };

  const handleDetalleChange = (index, field, value) => {
    setNuevaVenta(prev => {
      const detalles = [...prev.detalles];
      detalles[index] = { ...detalles[index], [field]: value };
      
      if (field === 'productoId') {
        const producto = productos.find(p => p.id === value);
        if (producto) {
          detalles[index].precioUnitario = producto.precio;
        }
      }
      
      return { ...prev, detalles };
    });
  };

  const handleAgregarDetalle = () => {
    setNuevaVenta(prev => ({
      ...prev,
      detalles: [...prev.detalles, { productoId: '', cantidad: 1, precioUnitario: 0 }]
    }));
  };

  const handleEliminarDetalle = (index) => {
    if (nuevaVenta.detalles.length === 1) return;
    setNuevaVenta(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/ventas', nuevaVenta);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al registrar la venta');
      }

      setOpenDialog(false);
      cargarDatosIniciales();
      setNuevaVenta({
        clienteId: '',
        tiendaId: '',
        detalles: [{ productoId: '', cantidad: 1, precioUnitario: 0 }]
      });
    } catch (error) {
      console.error('Error al registrar venta:', error);
      alert(error.response?.data?.message || error.message || 'Error al registrar la venta');
    }
  };

  const calcularTotal = (detalles) => {
    return detalles.reduce((total, detalle) => 
      total + (detalle.cantidad * detalle.precioUnitario), 0
    ).toFixed(2);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Typography variant="h4">Ventas</Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nueva Venta
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Detalles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(ventas) && ventas.map((venta) => (
              <TableRow key={venta.id}>
                <TableCell>{venta.id}</TableCell>
                <TableCell>{formatearFecha(venta.fechaVenta)}</TableCell>
                <TableCell>{venta.cliente?.nombre || 'N/A'}</TableCell>
                <TableCell>{venta.tienda?.nombre || 'N/A'}</TableCell>
                <TableCell>${venta.precioTotal?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>
                  {venta.detallesJson && JSON.parse(venta.detallesJson).map((detalle, index) => {
                    const producto = productos.find(p => p.id === detalle.productoId);
                    return (
                      <div key={index}>
                        {producto?.nombre || 'Producto no encontrado'} 
                        x {detalle.cantidad} @ ${detalle.precioUnitario?.toFixed(2)}
                      </div>
                    );
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Nueva Venta</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Tienda"
                  value={nuevaVenta.tiendaId}
                  onChange={handleTiendaChange}
                  required
                >
                  <MenuItem value="">Seleccione una tienda</MenuItem>
                  {Array.isArray(tiendas) && tiendas.map((tienda) => (
                    <MenuItem key={tienda.id} value={tienda.id}>
                      {tienda.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Cliente"
                  value={nuevaVenta.clienteId}
                  onChange={(e) => setNuevaVenta(prev => ({ ...prev, clienteId: e.target.value }))}
                  required
                >
                  <MenuItem value="">Seleccione un cliente</MenuItem>
                  {Array.isArray(clientes) && clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {nuevaVenta.tiendaId && nuevaVenta.detalles.map((detalle, index) => (
                <Grid item xs={12} container spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      select
                      fullWidth
                      label="Producto"
                      value={detalle.productoId}
                      onChange={(e) => handleDetalleChange(index, 'productoId', e.target.value)}
                      required
                      disabled={!nuevaVenta.tiendaId}
                    >
                      <MenuItem value="">Seleccione un producto</MenuItem>
                      {Array.isArray(productos) && productos.map((producto) => (
                        <MenuItem 
                          key={producto.id} 
                          value={producto.id}
                          disabled={producto.stock < 1}
                        >
                          {producto.nombre} - ${producto.precio?.toFixed(2)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Cantidad"
                      value={detalle.cantidad}
                      onChange={(e) => {
                        const cantidad = parseInt(e.target.value) || 1;
                        const producto = productos.find(p => p.id === detalle.productoId);
                        if (producto && cantidad > producto.stock) {
                          alert(`Solo hay ${producto.stock} unidades disponibles`);
                          return;
                        }
                        handleDetalleChange(index, 'cantidad', cantidad);
                      }}
                      InputProps={{ 
                        inputProps: { 
                          min: 1,
                          max: productos.find(p => p.id === detalle.productoId)?.stock || 1
                        } 
                      }}
                      required
                      disabled={!detalle.productoId}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type="number"
                      fullWidth
                      label="Precio Unitario"
                      value={detalle.precioUnitario}
                      InputProps={{
                        readOnly: true,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminarDetalle(index)}
                      disabled={nuevaVenta.detalles.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAgregarDetalle}
                >
                  Agregar Producto
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  Total: ${calcularTotal(nuevaVenta.detalles)}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Ventas;
