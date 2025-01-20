import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import MainLayout from './layouts/MainLayout'

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Clientes = React.lazy(() => import('./pages/Clientes'))
const Productos = React.lazy(() => import('./pages/Productos'))
const Proveedores = React.lazy(() => import('./pages/Proveedores'))
const Locales = React.lazy(() => import('./pages/Locales'))
const ProductosTienda = React.lazy(() => import('./pages/ProductosTienda'))
const Ventas = React.lazy(() => import('./pages/Ventas'))

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Dashboard />
              </React.Suspense>
            } />
            <Route path="clientes" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Clientes />
              </React.Suspense>
            } />
            <Route path="locales" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Locales />
              </React.Suspense>
            } />
            <Route path="proveedores" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Proveedores />
              </React.Suspense>
            } />
            <Route path="productos" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Productos />
              </React.Suspense>
            } />
            <Route path="productos-tienda" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <ProductosTienda />
              </React.Suspense>
            } />
            <Route path="ventas" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Ventas />
              </React.Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
