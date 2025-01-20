import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import {
  AttachMoney,
  Store,
  ShoppingCart,
  Inventory,
  TrendingUp,
  Group,
  Warning,
} from "@mui/icons-material";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState({
    ventasHoy: 0,
    ventasSemana: 0,
    totalClientes: 0,
    totalTiendas: 0,
    productosStockBajo: 0,
    ventasTotales: 0,
    ventasPorTienda: [],
    ventasPorMes: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [resumen, tiendas, mensual] = await Promise.all([
        axios.get(`${API_BASE_URL}/estadisticas/resumen`),
        axios.get(`${API_BASE_URL}/estadisticas/ventas/tienda`),
        axios.get(`${API_BASE_URL}/estadisticas/ventas/mensual`),
      ]);

      setStats({
        ...resumen.data.data,
        ventasPorTienda: tiendas.data.data,
        ventasPorMes: mensual.data.data,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Icon sx={{ fontSize: 40, color }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {typeof value === "number" && title.includes("$")
                ? `$${value.toFixed(2)}`
                : value}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjetas de estadísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas Hoy"
            value={stats.ventasHoy}
            icon={AttachMoney}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas Semanales"
            value={stats.ventasSemana}
            icon={TrendingUp}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clientes"
            value={stats.totalClientes}
            icon={Group}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Productos con Stock Bajo (<10)"
            value={stats.productosStockBajo}
            icon={Warning}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Tienda
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveBar
                data={stats.ventasPorTienda}
                keys={["total"]}
                indexBy="tienda"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                colors={{ scheme: "nivo" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de Comparación Ventas vs Cantidad por Tienda */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Comparación de Ventas y Cantidad por Tienda
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveBar
                data={stats.ventasPorTienda}
                keys={["total", "cantidad"]}
                indexBy="tienda"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: "linear" }}
                colors={{ scheme: "nivo" }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                  },
                ]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
