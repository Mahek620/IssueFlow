import { isOverdue } from "./utils";

const STATUS = [
  { key: "OPEN", label: "Open", color: "#f5a524" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#6652d9" },
  { key: "CLOSED", label: "Completed", color: "#22b07d" },
];

const PRIORITY = [
  { key: "LOW", label: "Low", color: "#3b9ae1" },
  { key: "MEDIUM", label: "Medium", color: "#f5a524" },
  { key: "HIGH", label: "High", color: "#e5484d" },
];

function Donut({ segments, total }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="donut">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0f1f6" strokeWidth="14" />
      {total > 0 &&
        segments.map((seg) => {
          const length = (seg.count / total) * circumference;
          const circle = (
            <circle
              key={seg.key}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
          offset += length;
          return circle;
        })}
      <text x="50" y="48" textAnchor="middle" className="donut-number">
        {total}
      </text>
      <text x="50" y="62" textAnchor="middle" className="donut-caption">
        tasks
      </text>
    </svg>
  );
}

export default function DashboardCharts({ tasks }) {
  const total = tasks.length;

  const statusData = STATUS.map((s) => ({
    ...s,
    count: tasks.filter((t) => t.status === s.key).length,
  }));

  const priorityData = PRIORITY.map((p) => ({
    ...p,
    count: tasks.filter((t) => (t.priority || "MEDIUM") === p.key).length,
  }));
  const maxPriority = Math.max(1, ...priorityData.map((p) => p.count));

  const overdueCount = tasks.filter(isOverdue).length;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);
  const dueSoon = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== "CLOSED" &&
      t.dueDate >= todayStr &&
      t.dueDate <= weekEndStr
  ).length;

  const workloadMap = {};
  tasks.forEach((t) => {
    const name = (t.assignee || "").trim() || "Unassigned";
    workloadMap[name] = (workloadMap[name] || 0) + 1;
  });
  const workload = Object.entries(workloadMap).sort((a, b) => b[1] - a[1]);
  const maxWorkload = Math.max(1, ...workload.map(([, c]) => c));

  const completion = total
    ? Math.round((statusData[2].count / total) * 100)
    : 0;

  return (
    <section className="charts">
      <div className="panel chart-panel">
        <h3>Status overview</h3>
        <div className="donut-wrap">
          <Donut segments={statusData} total={total} />
          <ul className="legend">
            {statusData.map((s) => (
              <li key={s.key}>
                <span className="legend-dot" style={{ background: s.color }} />
                {s.label}
                <strong>{s.count}</strong>
              </li>
            ))}
          </ul>
        </div>
        <p className="chart-note">{completion}% tasks completed</p>
      </div>

      <div className="panel chart-panel">
        <h3>Priority breakdown</h3>
        <div className="bar-list">
          {priorityData.map((p) => (
            <div className="bar-row" key={p.key}>
              <span className="bar-label">{p.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(p.count / maxPriority) * 100}%`,
                    background: p.color,
                  }}
                />
              </div>
              <span className="bar-count">{p.count}</span>
            </div>
          ))}
        </div>

        <div className="mini-stats">
          <div className="mini-stat danger">
            <strong>{overdueCount}</strong>
            <span>Overdue</span>
          </div>
          <div className="mini-stat">
            <strong>{dueSoon}</strong>
            <span>Due in 7 days</span>
          </div>
        </div>
      </div>

      <div className="panel chart-panel">
        <h3>Assignee workload</h3>
        {workload.length === 0 ? (
          <p className="chart-note">No tasks yet.</p>
        ) : (
          <div className="bar-list">
            {workload.slice(0, 6).map(([name, count]) => (
              <div className="bar-row" key={name}>
                <span className="bar-label" title={name}>
                  {name}
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(count / maxWorkload) * 100}%`,
                      background: "#6652d9",
                    }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}