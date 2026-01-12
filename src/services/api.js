import { toastBus } from "./toastBus";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(res) {
  const data = await res.json();

  // Error HTTP (400, 401, 409, 500, etc)
  if (!res.ok) {
    const message = data.message || "Error del servidor";
    toastBus.error(message);
  }

  // Error lógico del backend
  if (data.success === false) {
    const message = data.message || "Error desconocido";
    toastBus.error(message);
  }

  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(res);
}

export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
