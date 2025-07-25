import React from "react";
import { Paper, Typography, Box, Avatar, useTheme, useMediaQuery } from "@mui/material";
import BankCard from "./BankCard";

// 🖼️ Importá los logos desde assets
import galiciaLogo from "../../public/galicia.png";
import bbvaLogo from "../../public/bbva.png";
import santanderLogo from "../../public/santander.png";
import macroLogo from "../../public/macro.png";
import icbcLogo from "../../public/icbc.png";

// 🔁 Función para devolver el logo según el nombre
const getLogoForBanco = (banco) => {
  switch (banco.toLowerCase()) {
    case "galicia":
      return galiciaLogo;
    case "bbva":
      return bbvaLogo;
    case "santander":
      return santanderLogo;
    case "macro":
      return macroLogo;
    case "icbc":
      return icbcLogo;
    default:
      return "";
  }
};

export default function BankGroup({ banco, tarjetas, onAddPago, onDeletePago, onDeleteTarjeta }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const logo = getLogoForBanco(banco);

  return (
    <Paper
      elevation={8}
      sx={{
        p: 3,
        mt: 3,
        background: theme.palette.mode === "dark"
          ? "linear-gradient(145deg, #1e293b, #334155)"
          : "linear-gradient(145deg, #ffcec4ff, #8cbacfff)",
        borderRadius: "24px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        maxWidth: "1000px",
        marginX: "auto",
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {logo && (
          <Avatar
            src={logo}
            alt={banco}
            sx={{ width: 32, height: 32 }}
          />
        )}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.mode === "dark" ? "#f8fafc" : "#0f172a",
          }}
        >
          {banco}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: isSmallScreen ? "flex-start" : "center",
          gap: 3,
          flexWrap: isSmallScreen ? "nowrap" : "wrap",
          overflowX: isSmallScreen ? "auto" : "visible",
          py: 2,
        }}
      >
        {tarjetas.map((tarjeta) => (
          <BankCard
            key={tarjeta.id}
            tarjeta={tarjeta}
            onAddPago={onAddPago}
            onDeletePago={onDeletePago}
            onDeleteCard={onDeleteTarjeta}
          />
        ))}
      </Box>
    </Paper>
  );
}
