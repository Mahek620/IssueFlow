import { useState } from "react";

export default function EditTaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "OPEN",
    priority: task.priority || "MEDIUM",
    labels: task.labels || "",
    assignee: task.assignee || "",
    dueDate: task.dueDate || "",
  });
  const [saving, setSaving] = useState(false);

  function change(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title khaali nahi ho sakta.");
      return;
    }
    setSaving(true);
    await onSave({
      ...task,
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      labels: form.labels.trim(),
      assignee: form.assignee.trim(),
      dueDate: form.dueDate || null,
    });
    setSaving(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={submit}>
          <label htmlFor="edit-title">Task Title *</label>
          <input
            id="edit-title"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            maxLength={100}
            required
          />

          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
            rows={3}
            maxLength={1000}
          />

          <div className="modal-row">
            <div>
              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                value={form.status}
                onChange={(e) => change("status", e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={form.priority}
                onChange={(e) => change("priority", e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <label htmlFor="edit-labels">Labels (comma separated)</label>
          <input
            id="edit-labels"
            value={form.labels}
            onChange={(e) => change("labels", e.target.value)}
            maxLength={100}
          />

          <div className="modal-row">
            <div>
              <label htmlFor="edit-assignee">Assignee</label>
              <input
                id="edit-assignee"
                value={form.assignee}
                onChange={(e) => change("assignee", e.target.value)}
                maxLength={50}
              />
            </div>
            <div>
              <label htmlFor="edit-due">Due date</label>
              <input
                id="edit-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => change("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="text-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}