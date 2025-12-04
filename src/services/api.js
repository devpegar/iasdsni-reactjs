const API_URL = "http://localhost/iasdsni-api";

export async function apiGet(path) {
  const token = localStorage.getItem("token");

  const headers = {};

  // Solo agrega el token si existe
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { headers });
  return res.json();
}

export async function apiPost(path, data) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  // Solo agrega Authorization si hay un token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return res.json();
}
