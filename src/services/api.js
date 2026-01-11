const API_URL = import.meta.env.VITE_API_URL;

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include", // <--- ENVÍA COOKIE
  });

  return res.json();
}

export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include", // <--- ENVÍA COOKIE
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
