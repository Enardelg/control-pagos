import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatNumber } from "./utils";

export default function BankCard({ tarjeta, onAddPago, onDeletePago, onDeleteCard }) {
  const theme = useTheme();
  const [nuevoPago, setNuevoPago] = useState("");
  const [error, setError] = useState("");
  const [pagos, setPagos] = useState(tarjeta.pagos || []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const totalPagado = pagos.reduce((acc, pago) => acc + pago, 0);
  const saldoPendiente = tarjeta.monto_total - totalPagado;
  const saldoFavor = totalPagado > tarjeta.monto_total ? totalPagado - tarjeta.monto_total : 0;

  const handleAddPago = async () => {
    setError("");
    const pagoNum = parseFloat(nuevoPago.replace(".", "").replace(",", "."));
    if (isNaN(pagoNum) || pagoNum <= 0) {
      setError("Ingrese un monto válido mayor a 0.");
      return;
    }
    try {
      const tarjetaActualizada = await onAddPago(tarjeta.id, pagoNum);
      if (tarjetaActualizada && tarjetaActualizada.pagos) {
        setPagos([...tarjetaActualizada.pagos]); // Forzar nueva referencia
        setNuevoPago("");
        setSuccessOpen(true); // Mostrar snackbar
      } else {
        console.error("Respuesta inválida del backend:", tarjetaActualizada);
        setError("Error inesperado al guardar el pago.");
      }
    } catch (err) {
      console.error("Error al guardar en backend:", err);
      setError("No se pudo guardar el pago en el servidor.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPago();
    }
  };

  const handleConfirmDeletePago = (index) => {
    setPagoAEliminar(index);
    setConfirmOpen(true);
  };

  const handleDeletePago = async () => {
    try {
      const tarjetaActualizada = await onDeletePago(tarjeta.id, pagoAEliminar);
      if (tarjetaActualizada && Array.isArray(tarjetaActualizada.pagos)) {
        setPagos([...tarjetaActualizada.pagos]);
        setConfirmOpen(false);
        setPagoAEliminar(null);
      } else {
        console.error("Error al eliminar el pago:", tarjetaActualizada);
        setError("No se pudo eliminar el pago.");
        setConfirmOpen(false);
      }
    } catch (err) {
      console.error("Error al eliminar en backend:", err);
      setError("Error al eliminar el pago.");
      setConfirmOpen(false);
    }
  };

  let estado = "🟡 Pago Parcial";
  let colorEstado = "warning";
  if (totalPagado >= tarjeta.monto_total) {
    estado = "🟢 Pago Total";
    colorEstado = "success";
  } else if (totalPagado >= tarjeta.pago_minimo) {
    estado = "🔵 Pago Mínimo Cubierto";
    colorEstado = "info";
  }

  return (
    <>
      <Card
        sx={{
          minWidth: 300,
          flex: "0 0 auto",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1e293b, #334155)"
            : "linear-gradient(145deg, #ffffff, #f8fafc)",
          borderRadius: 4,
          boxShadow: theme.palette.mode === "dark"
            ? "0 8px 24px rgba(0, 0, 0, 0.8)"
            : "0 8px 24px rgba(0, 0, 0, 0.1)",
          p: 2,
          color: theme.palette.mode === "dark" ? "#f1f5f9" : "#0f172a",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(90deg, #6366f1, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {tarjeta.tarjeta}
            </Typography>
            <IconButton onClick={() => onDeleteCard(tarjeta.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ display: "flex", alignItems: "center" }}>
            💳 Banco: {tarjeta.banco}
          </Typography>
          <Typography variant="body2">💰 Monto Total: ${formatNumber(tarjeta.monto_total)}</Typography>
          <Typography variant="body2">📄 Pago Mínimo: ${formatNumber(tarjeta.pago_minimo)}</Typography>
          <Typography variant="body2">✅ Total Pagado: ${formatNumber(totalPagado)}</Typography>
          {saldoPendiente > 0 && (
            <Typography variant="body2" color="primary">
              🔥 Saldo Pendiente: ${formatNumber(saldoPendiente)}
            </Typography>
          )}
          {saldoFavor > 0 && (
            <Typography variant="body2" color="success.main">
              💸 Saldo a Favor: ${formatNumber(saldoFavor)}
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Agregar Pago"
              size="small"
              type="text"
              value={nuevoPago}
              onChange={(e) => setNuevoPago(e.target.value)}
              onKeyDown={handleKeyPress}
              fullWidth
              InputLabelProps={{
                sx: {
                  color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
                },
              }}
              InputProps={{
                sx: {
                  backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff",
                  color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
                  "&::placeholder": {
                    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#94a3b8",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPago}
            >
              Agregar
            </Button>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#b91c1c" : "#f87171",
                color: "#fff",
              }}
            >
              {error}
            </Alert>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            📝 Historial de Pagos:
          </Typography>
          {pagos.map((pago, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                my: 0.5,
                p: 1,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#475569" : "#fafafa",
              }}
            >
              <Typography variant="body2">
                Pago {index + 1}: ${formatNumber(pago)}
              </Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleConfirmDeletePago(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Chip label={estado} color={colorEstado} sx={{ mt: 2 }} />
        </CardContent>
      </Card>

      {/* Diálogo de Confirmación */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro de que desea eliminar este pago?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeletePago}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="✅ Pago agregado con éxito"
      />
    </>
  );
}
