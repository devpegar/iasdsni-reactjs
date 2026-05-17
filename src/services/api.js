import { requestJson } from "./httpClient";
import { toastBus } from "./toastBus";

async function handleResponse(path, options) {
  const { response, data } = await requestJson(path, options);

  if (!response.ok) {
    const message = data.message || "Error del servidor";
    toastBus.error(message);
  }

  if (data.success === false) {
    const message = data.message || "Error desconocido";
    toastBus.error(message);
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
