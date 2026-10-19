import { useState, useEffect } from "react";
import "./App.css";
import Board from "./Board";
import EditTaskModal from "./EditTaskModal";
import { isOverdue } from "./utils";
import { fetchTasks, createTaskApi, updateTaskApi, deleteTaskApi } from "./api";
import DashboardCharts from "./DashboardCharts";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [priority, setPriority] = useState("MEDIUM");
  const [labels, setLabels] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(() =>
        alert("Backend se connect nahi ho paya. Spring Boot chal raha hai?")
      );
  }, []);

  async function createTask(data) {
    try {
      const saved = await createTaskApi(data);
      setTasks((previous) => [...previous, saved]);
      return true;
    } catch {
      alert("Task save nahi ho paya.");
      return false;
    }
  }

  async function addTask(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const ok = await createTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      labels: labels.trim(),
      assignee: assignee.trim(),
      dueDate: dueDate || null,
    });

    if (ok) {
      setTitle("");
      setDescription("");
      setStatus("OPEN");
      setPriority("MEDIUM");
      setLabels("");
      setAssignee("");
      setDueDate("");
      setActivePage("All Tasks");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTaskApi(id);
      setTasks((previous) => previous.filter((task) => task.id !== id));
    } catch {
      alert("Delete nahi ho paya.");
    }
  }

  async function updateStatus(id, newStatus) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const saved = await updateTaskApi({ ...task, status: newStatus });
      setTasks((previous) => previous.map((t) => (t.id === id ? saved : t)));
    } catch {
      alert("Status update nahi ho paya.");
    }
  }

  async function saveEdit(updated) {
    try {
      const saved = await updateTaskApi(updated);
      setTasks((previous) =>
        previous.map((t) => (t.id === saved.id ? saved : t))
      );
      setEditingTask(null);
    } catch {
      alert("Task update nahi ho paya.");
    }
  }

  const openCount = tasks.filter((t) => t.status === "OPEN").length;
  const progressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const closedCount = tasks.filter((t) => t.status === "CLOSED").length;

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  function showTaskList() {
    return (
      <>
        <input
          className="search-input"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">☷</div>
            <h3>{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h3>
            <p>
              {tasks.length === 0
                ? "Create a task to get started."
                : "Try another search term."}
            </p>
            {tasks.length === 0 && (
              <button
                className="primary-button"
                onClick={() => setActivePage("Create Task")}
              >
                + Create your first task
              </button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article className="task-item" key={task.id}>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description provided"}</p>
                  <div className="chip-row">
                    <span className={`status ${task.status.toLowerCase()}`}>
                      {task.status.replace("_", " ")}
                    </span>
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
                    {task.assignee && (
                      <span className="assignee-chip">
                        <span className="mini-avatar">
                          {task.assignee.charAt(0).toUpperCase()}
                        </span>
                        {task.assignee}
                      </span>
                    )}
                    {task.dueDate && (
                      <span
                        className={`due-chip ${
                          isOverdue(task) ? "overdue" : ""
                        }`}
                      >
                        📅 {task.dueDate}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="status-label" htmlFor={`status-${task.id}`}>
                      Update status
                    </label>
                    <select
                      id={`status-${task.id}`}
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="CLOSED">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className="edit-button"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </>
    );
  }

  function taskForm() {
    return (
      <form onSubmit={addTask}>
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fix login bug"
          maxLength={100}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your task..."
          rows={4}
          maxLength={1000}
        />

        <label htmlFor="new-status">Status</label>
        <select
          id="new-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Completed</option>
        </select>

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <label htmlFor="labels">Labels (comma separated)</label>
        <input
          id="labels"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          placeholder="e.g. Bug, Frontend"
          maxLength={100}
        />

        <label htmlFor="assignee">Assignee</label>
        <input
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="e.g. Mahek"
          maxLength={50}
        />

        <label htmlFor="dueDate">Due date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="primary-button" type="submit">
          + Create Task
        </button>
      </form>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">
          <span>◆</span> IssueFlow
        </h2>

        <p className="nav-heading">WORKSPACE</p>

        {["Dashboard", "Board", "All Tasks", "Create Task", "Settings"].map(
          (page) => (
            <button
              key={page}
              className={`nav-item ${activePage === page ? "active" : ""}`}
              onClick={() => setActivePage(page)}
            >
              {page === "Board" && "▥"}
              {page === "Dashboard" && "▦"}
              {page === "All Tasks" && "☷"}
              {page === "Create Task" && "+"}
              {page === "Settings" && "⚙"}
              &nbsp; {page}
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <div className="avatar">M</div>
          <div>
            <strong>My Workspace</strong>
            <p>Project Manager</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span>Workspace / {activePage}</span>
          <span className="today">Issue Tracking System</span>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <p className="eyebrow">YOUR WORKSPACE</p>
                <h1>Task Dashboard</h1>
                <p className="subtitle">
                  Organize your work. Track progress. Get things done.
                </p>
              </div>
              <div className="welcome-icon">✦</div>
            </section>

            <section className="stats">
              {[
                ["Total Tasks", tasks.length, "All your tasks"],
                ["Open", openCount, "● Awaiting action"],
                ["In Progress", progressCount, "● Work in progress"],
                ["Completed", closedCount, "● Finished tasks"],
              ].map(([label, count, note]) => (
                <div className="stat-card" key={label}>
                  <p>{label}</p>
                  <h2>{count}</h2>
                  <span>{note}</span>
                </div>
              ))}
            </section>

            <section className="content-grid">
            </section>

            <DashboardCharts tasks={tasks} />

            <section className="content-grid">
              <div className="panel task-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Tasks</h2>
                    <p>View and manage your work</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setActivePage("All Tasks")}
                  >
                    View all →
                  </button>
                </div>
                {showTaskList()}
              </div>

              <div className="panel form-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Create Task</h2>
                    <p>Add a new task to your workspace</p>
                  </div>
                </div>
                {taskForm()}
              </div>
            </section>
          </>
        )}

        {activePage === "Board" && (
          <section className="page-section">
            <div className="page-title-row">
              <div>
                <h1>Board</h1>
                <p className="subtitle">
                  Drag tasks between columns to change status.
                </p>
              </div>
            </div>
            <Board
              tasks={tasks}
              onAdd={createTask}
              onMove={updateStatus}
              onDelete={deleteTask}
              onEdit={setEditingTask}
            />
          </section>
        )}

        {activePage === "All Tasks" && (
          <section className="page-section">
            <div className="page-title-row">
              <div>
                <h1>All Tasks</h1>
                <p className="subtitle">Search, edit, update, and delete tasks.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setActivePage("Create Task")}
              >
                + New Task
              </button>
            </div>
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Your Tasks</h2>
                  <p>{tasks.length} task(s) in your workspace</p>
                </div>
              </div>
              {showTaskList()}
            </div>
          </section>
        )}

        {activePage === "Create Task" && (
          <section className="page-section">
            <div className="page-title-row">
              <div>
                <h1>Create a Task</h1>
                <p className="subtitle">Add a new issue to your workspace.</p>
              </div>
            </div>
            <div className="panel standalone-form">{taskForm()}</div>
          </section>
        )}

        {activePage === "Settings" && (
          <section className="page-section">
            <h1>Settings</h1>
            <p className="subtitle">Your workspace information.</p>

            <div className="panel settings-panel">
              <h2>Workspace Profile</h2>
              <div className="setting-row">
                <span>Workspace name</span>
                <strong>IssueFlow</strong>
              </div>
              <div className="setting-row">
                <span>Role</span>
                <strong>Project Manager</strong>
              </div>
              <div className="setting-row">
                <span>Total tasks</span>
                <strong>{tasks.length}</strong>
              </div>
              <div className="setting-row">
                <span>Application version</span>
                <strong>1.0.0</strong>
              </div>
              <p className="settings-note">
                These are currently display-only settings.
              </p>
            </div>
          </section>
        )}

        <footer>IssueFlow © 2026 · Built to keep work organized.</footer>
      </main>

      {editingTask && (
        <EditTaskModal
          key={editingTask.id}
          task={editingTask}
          onSave={saveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

export default App;