import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  createTheme,
  ThemeProvider,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AddCardForm from "./components/AddCardForm";
import BankGroup from "./components/BankGroup";
import {
  getTarjetas,
  createTarjeta,
  addPago,
  deletePago,
  deleteTarjeta,
} from "./api";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f2f4f8",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a",
    },
  },
});

export default function App() {
  const [tarjetas, setTarjetas] = useState([]);
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    fetchTarjetas();
  }, []);

  const fetchTarjetas = async () => {
    const data = await getTarjetas();
    setTarjetas(data);
  };

  const handleAddTarjeta = async (tarjeta) => {
    await createTarjeta(tarjeta);
    fetchTarjetas();
  };

  const handleAddPago = async (id, pago) => {
    return await addPago(id, pago);
  };

  const handleDeletePago = async (id, pagoIndex) => {
    return await deletePago(id, pagoIndex);
  };

  const handleDeleteTarjeta = async (id) => {
    await deleteTarjeta(id);
    fetchTarjetas();
  };

  const tarjetasPorBanco = tarjetas.reduce((grupos, t) => {
    if (!grupos[t.banco]) grupos[t.banco] = [];
    grupos[t.banco].push(t);
    return grupos;
  }, {});

  return (
    <ThemeProvider theme={modoOscuro ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "99vw",
          background: modoOscuro
            ? "linear-gradient(180deg, #0f172a, #1e293b, #334155)"
            : "linear-gradient(to bottom right, #F47961, #F5EDED, #92C7D8, #5E7C99, #2D3E4E)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 4,
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Botón para cambiar modo */}
        <Tooltip title={modoOscuro ? "Modo Claro" : "Modo Oscuro"}>
          <IconButton
            onClick={() => setModoOscuro(!modoOscuro)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: modoOscuro
                ? "linear-gradient(90deg, #6366f1, #9333ea)"
                : "linear-gradient(90deg, #0ea5e9, #38bdf8)",
              color: "#fff",
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.7)",
              "&:hover": {
                boxShadow: "0 0 20px rgba(99, 102, 241, 1)",
              },
            }}
          >
            {modoOscuro ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            backgroundImage: modoOscuro
              ? "none"
              : "linear-gradient(90deg, #0000001e, #ffffff1e)",
            backgroundColor: modoOscuro ? "#1e293b" : "transparent",
            borderRadius: 4,
            boxShadow: modoOscuro
              ? "0 8px 24px rgba(0, 0, 0, 0.8)"
              : "0 8px 24px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              💳
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #174168, #85b5fd, #fcaf9fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Control de Flujos de Pagos
            </Typography>
          </Box>
          <AddCardForm onAddCard={handleAddTarjeta} />
          {Object.entries(tarjetasPorBanco).map(([banco, tarjetas]) => (
            <BankGroup
              key={banco}
              banco={banco}
              tarjetas={tarjetas}
              onAddPago={handleAddPago}
              onDeletePago={handleDeletePago}
              onDeleteTarjeta={handleDeleteTarjeta}
            />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
