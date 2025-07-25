import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getTarjetas = async () => {
  const res = await axios.get(`${API_URL}/tarjetas/`);
  return res.data;
};

export const createTarjeta = async (tarjeta) => {
  const res = await axios.post(`${API_URL}/tarjetas/`, tarjeta);
  return res.data;
};

export const updateTarjeta = async (id, updatedTarjeta) => {
  const res = await axios.put(`${API_URL}/tarjetas/${id}`, updatedTarjeta);
  return res.data;
};

export const addPago = async (id, pago) => {
  const res = await axios.post(`${API_URL}/tarjetas/${id}/pagos`, { pago });
  return res.data;
};

export const deleteTarjeta = async (id) => {
  const res = await axios.delete(`${API_URL}/tarjetas/${id}`);
  return res.data;
};

export const deletePago = async (tarjetaId, pagoIndex) => {
  const res = await axios.delete(`${API_URL}/tarjetas/${tarjetaId}/pagos/${pagoIndex}`);
  return res.data;
};

