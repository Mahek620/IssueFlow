const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const TASKS = `${API}/tasks`;

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function saveSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({ name: data.name, email: data.email })
  );
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

async function authRequest(path, body) {
  const res = await fetch(`${API}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const registerApi = (body) => authRequest("register", body);
export const loginApi = (body) => authRequest("login", body);

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (res.status === 401) {
    clearSession();
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error("Request failed");
  return res.status === 204 ? null : res.json();
}

export const fetchTasks = () => request(TASKS);

export const createTaskApi = (task) =>
  request(TASKS, { method: "POST", body: JSON.stringify(task) });

export const updateTaskApi = (task) =>
  request(`${TASKS}/${task.id}`, { method: "PUT", body: JSON.stringify(task) });

export const deleteTaskApi = (id) =>
  request(`${TASKS}/${id}`, { method: "DELETE" });