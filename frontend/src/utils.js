export function isOverdue(task) {
  if (!task.dueDate || task.status === "CLOSED") return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}