const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message);
  }

  if (response.status === 204) return null;
  return response.json();
}

