import { env } from "../config/env";

function buildUrl(path) {
  if (!env.apiUrl) {
    return path;
  }

  return `${env.apiUrl}${path}`;
}

export async function request(path, options = {}) {
  return fetch(buildUrl(path), {
    credentials: "include",
    ...options,
  });
}

export async function requestJson(path, options = {}) {
  const response = await request(path, options);
  const data = await response.json();

  return { response, data };
}

export async function getJson(path, options = {}) {
  return requestJson(path, {
    method: "GET",
    ...options,
  });
}
