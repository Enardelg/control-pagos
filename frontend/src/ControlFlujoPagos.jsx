import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import axios from "axios";

const bancos = [
  { nombre: "Galicia", logo: "/logos/galicia.png" },
  { nombre: "BBVA", logo: "/logos/bbva.png" },
  { nombre: "Santander", logo: "/logos/santander.png" },
  { nombre: "Macro", logo: "/logos/macro.png" },
  { nombre: "ICBC", logo: "/logos/icbc.png" },
];

const tarjetas = [
  { nombre: "VISA", logo: "/logos/visa.png" },
  { nombre: "Mastercard", logo: "/logos/mastercard.png" },
  { nombre: "Amex", logo: "/logos/amex.png" },
];

const API_URL = "http://127.0.0.1:8000";

export default function ControlFlujoPagos() {
  const [banco, setBanco] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [montoTotal, setMontoTotal] = useState(0);
  const [pagoMinimo, setPagoMinimo] = useState(0);
  const [nuevoPago, setNuevoPago] = useState(0);
  const [pagos, setPagos] = useState([]);

  const fetchPagos = async () => {
    const res = await axios.get(`${API_URL}/pagos/`);
    setPagos(res.data);
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleAgregarPago = async () => {
    if (nuevoPago > 0 && banco && tarjeta) {
      await axios.post(`${API_URL}/pagos/`, {
        banco,
        tarjeta,
        monto_total: montoTotal,
        pago_minimo: pagoMinimo,
        monto_pagado: nuevoPago,
      });
      setNuevoPago(0);
      fetchPagos();
    }
  };

  const totalPagado = pagos.reduce((acc, p) => acc + p.monto_pagado, 0);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        💳 Control de Flujos de Pagos
      </Typography>
      {/* Banco */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Selecciona un Banco</InputLabel>
        <Select
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
        >
          {bancos.map((b) => (
            <MenuItem key={b.nombre} value={b.nombre}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={b.logo} alt={b.nombre} sx={{ width: 24, height: 24 }} />
                {b.nombre}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Tarjeta */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Selecciona una Tarjeta</InputLabel>
        <Select
          value={tarjeta}
          onChange={(e) => setTarjeta(e.target.value)}
        >
          {tarjetas.map((t) => (
            <MenuItem key={t.nombre} value={t.nombre}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={t.logo} alt={t.nombre} sx={{ width: 24, height: 24 }} />
                {t.nombre}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Montos */}
      <TextField
        fullWidth
        label="Monto Total del Resumen"
        type="number"
        sx={{ mb: 2 }}
        value={montoTotal}
        onChange={(e) => setMontoTotal(parseFloat(e.target.value))}
      />
      <TextField
        fullWidth
        label="Pago Mínimo"
        type="number"
        sx={{ mb: 2 }}
        value={pagoMinimo}
        onChange={(e) => setPagoMinimo(parseFloat(e.target.value))}
      />

      {/* Agregar Pagos */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Agregar Pago"
          type="number"
          value={nuevoPago}
          onChange={(e) => setNuevoPago(parseFloat(e.target.value))}
        />
        <Button variant="contained" onClick={handleAgregarPago}>
          Agregar
        </Button>
      </Box>

      {/* Lista de Pagos */}
      <List>
        {pagos.map((pago) => (
          <ListItem key={pago.id}>
            <ListItemAvatar>
              <Avatar>💰</Avatar>
            </ListItemAvatar>
            <ListItemText primary={`Banco: ${pago.banco} - ${pago.tarjeta}`} secondary={`Pago: $${pago.monto_pagado}`} />
          </ListItem>
        ))}
      </List>

      {/* Alertas */}
      {totalPagado >= montoTotal ? (
        <Alert severity="success">✅ Has cubierto el monto total.</Alert>
      ) : totalPagado >= pagoMinimo ? (
        <Alert severity="info">ℹ️ Has alcanzado el pago mínimo.</Alert>
      ) : (
        <Alert severity="warning">⚠️ Aún no alcanzaste el pago mínimo.</Alert>
      )}
    </Container>
  );
}
