import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Paper,
  Typography,
  Alert,
  useTheme,
  Collapse,
} from "@mui/material";

const bancos = [
  { nombre: "Galicia", logo: "/public/galicia.png" },
  { nombre: "BBVA", logo: "/public/bbva.png" },
  { nombre: "Santander", logo: "/santander.png" },
  { nombre: "Macro", logo: "/macro.png" },
  { nombre: "ICBC", logo: "/icbc.png" },
];

const tarjetas = [
  { nombre: "VISA", logo: "/public/visa.png" },
  { nombre: "Mastercard", logo: "/public/mastercard.png" },
  { nombre: "Amex", logo: "/public/amex.png" },
];

export default function AddCardForm({ onAddCard }) {
  const theme = useTheme();
  const [banco, setBanco] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [pagoMinimo, setPagoMinimo] = useState("");
  const [error, setError] = useState(false); // ✅ Ahora es booleano para controlar la alerta

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!banco || !tarjeta || !montoTotal || !pagoMinimo) {
      setError(true); // ✅ Mostrar alerta
      setTimeout(() => setError(false), 1500); // ✅ Ocultar alerta después de 3s
      return;
    }

    const nuevaTarjeta = {
      banco,
      tarjeta,
      monto_total: parseFloat(montoTotal),
      pago_minimo: parseFloat(pagoMinimo),
      pagos: [],
    };

    try {
      await onAddCard(nuevaTarjeta);
      setBanco("");
      setTarjeta("");
      setMontoTotal("");
      setPagoMinimo("");
    } catch (err) {
      console.error("Error al agregar tarjeta:", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: "12px",
        background: theme.palette.mode === "dark"
          ? "linear-gradient(145deg, #1e293b, #334155)"
          : "linear-gradient(90deg, #ffcec4ff, #8cbacfff)",
        color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        ➕ Agregar nueva tarjeta
      </Typography>

      {/* ✅ Alerta controlada por timeout */}
      <Collapse in={error}>
        <Alert
          severity="error"
          sx={{
            mb: 2,
            backgroundColor: theme.palette.mode === "dark" ? "#b91c1c" : "#f87171",
            color: "#fff",
          }}
        >
          Completa todos los campos antes de agregar la tarjeta.
        </Alert>
      </Collapse>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        {/* Banco */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel
            sx={{
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            }}
          >
            Banco
          </InputLabel>
          <Select
            value={banco}
            onChange={(e) => setBanco(e.target.value)}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            }}
          >
            {bancos.map((b) => (
              <MenuItem key={b.nombre} value={b.nombre}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={b.logo}
                    alt={b.nombre}
                    sx={{ width: 24, height: 24 }}
                  />
                  {b.nombre}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tarjeta */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel
            sx={{
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            }}
          >
            Tarjeta
          </InputLabel>
          <Select
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            sx={{
              backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            }}
          >
            {tarjetas.map((t) => (
              <MenuItem key={t.nombre} value={t.nombre}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={t.logo}
                    alt={t.nombre}
                    sx={{ width: 24, height: 24 }}
                  />
                  {t.nombre}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Monto Total */}
        <TextField
          label="Monto Total"
          type="number"
          value={montoTotal}
          onChange={(e) => setMontoTotal(e.target.value)}
          InputLabelProps={{
            sx: { color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a" },
          }}
          InputProps={{
            sx: {
              backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            },
          }}
        />

        {/* Pago Mínimo */}
        <TextField
          label="Pago Mínimo"
          type="number"
          value={pagoMinimo}
          onChange={(e) => setPagoMinimo(e.target.value)}
          InputLabelProps={{
            sx: { color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a" },
          }}
          InputProps={{
            sx: {
              backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
              color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
            },
          }}
        />

        {/* Botón */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#3b82f6" : undefined,
          }}
        >
          Agregar Tarjeta
        </Button>
      </Box>
    </Paper>
  );
}
