import { request } from "./httpClient";
import { toastBus } from "./toastBus";

async function handleResponse(path, options) {
  let response;

  try {
    response = await request(path, options);
  } catch {
    const message = "No se pudo conectar con el servidor";
    toastBus.error(message);
    throw new Error(message);
  }

  let data = {};
  const rawBody = await response.text();
  let invalidJson = false;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      invalidJson = true;
    }
  }

  if (!response.ok) {
    const message = data.message || `Error del servidor (${response.status})`;
    toastBus.error(message);
    throw new Error(message);
  }

  if (invalidJson) {
    const message = "Respuesta inválida del servidor";
    toastBus.error(message);
    throw new Error(message);
  }

  if (data.success === false) {
    const message = data.message || "Error desconocido";
    toastBus.error(message);
    throw new Error(message);
  }

  return data;
}

export async function apiGet(path) {
  return handleResponse(path, {
    method: "GET",
  });
}

export async function apiPost(path, data) {
  return handleResponse(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function apiPostForm(path, data) {
  return handleResponse(path, {
    method: "POST",
    body: data,
  });
}
