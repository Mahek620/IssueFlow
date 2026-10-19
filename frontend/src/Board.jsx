import { useState } from "react";
import "./Board.css";
import { isOverdue } from "./utils";

const COLUMNS = [
  { key: "OPEN", label: "Todo", color: "#8b7cf6" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#f5a524" },
  { key: "CLOSED", label: "Done", color: "#22b07d" },
];

export default function Board({ tasks, onAdd, onMove, onDelete, onEdit }) {
  const [dragId, setDragId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [addingIn, setAddingIn] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("");

  function moveTask(id, status) {
    onMove(id, status);
  }

  async function addTask(e, status) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const ok = await onAdd({
      title: newTitle.trim(),
      description: "",
      status,
      priority: "MEDIUM",
      labels: "",
      assignee: "",
      dueDate: null,
    });
    if (ok) {
      setNewTitle("");
      setAddingIn(null);
    }
  }

  function deleteTask(id) {
    onDelete(id);
  }

  const visible = tasks.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="board">
      <div className="board-toolbar">
        <input
          className="board-filter"
          placeholder="Filter tasks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="board-columns">
        {COLUMNS.map((col) => {
          const items = visible.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className={`board-column ${
                overColumn === col.key ? "drag-over" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(col.key);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={() => {
                if (dragId) {
                  const task = tasks.find((t) => t.id === dragId);
                  if (task && task.status !== col.key) moveTask(dragId, col.key);
                }
                setDragId(null);
                setOverColumn(null);
              }}
            >
              <div className="column-header">
                <span className="dot" style={{ background: col.color }} />
                <strong>{col.label}</strong>
                <span className="column-count">{items.length}</span>
              </div>

              <div className="column-cards">
                {items.map((task) => (
                  <article
                    key={task.id}
                    className="board-card"
                    style={{ borderLeftColor: col.color }}
                    draggable
                    onDragStart={() => setDragId(task.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverColumn(null);
                    }}
                  >
                    <div className="card-tags">
                      <span
                        className={`priority priority-${(
                          task.priority || "MEDIUM"
                        ).toLowerCase()}`}
                      >
                        {task.priority || "MEDIUM"}
                      </span>
                      {task.labels &&
                        task.labels
                          .split(",")
                          .filter((l) => l.trim())
                          .map((l) => (
                            <span className="label-chip" key={l}>
                              {l.trim()}
                            </span>
                          ))}
                    </div>
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                    <div className="card-footer">
                      <span className="card-id">ISS-{task.id}</span>
                      <div className="card-meta">
                        {task.dueDate && (
                          <span
                            className={`due-chip ${
                              isOverdue(task) ? "overdue" : ""
                            }`}
                          >
                            📅 {task.dueDate}
                          </span>
                        )}
                        {task.assignee && (
                          <span className="mini-avatar" title={task.assignee}>
                            {task.assignee.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <button
                          className="card-edit"
                          title="Edit"
                          onClick={() => onEdit(task)}
                        >
                          ✎
                        </button>
                        <button
                          className="card-delete"
                          title="Delete"
                          onClick={() => deleteTask(task.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {items.length === 0 && (
                  <div className="column-empty">Drop tasks here</div>
                )}
              </div>

              {addingIn === col.key ? (
                <form className="add-form" onSubmit={(e) => addTask(e, col.key)}>
                  <input
                    autoFocus
                    placeholder="Task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <div className="add-form-actions">
                    <button type="submit" className="primary-button">
                      Add
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setAddingIn(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="add-task-button"
                  onClick={() => {
                    setAddingIn(col.key);
                    setNewTitle("");
                  }}
                >
                  + Add task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}