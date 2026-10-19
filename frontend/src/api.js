const BASE = "http://localhost:8080/api/tasks";

export async function fetchTasks() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

export async function createTaskApi(task) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTaskApi(task) {
  const res = await fetch(`${BASE}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTaskApi(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}