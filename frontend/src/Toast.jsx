export function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{t.type === "error" ? "!" : "✓"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function ConfirmDialog({ message, onAnswer }) {
  return (
    <div className="modal-backdrop" onClick={() => onAnswer(false)}>
      <div className="modal confirm-box" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure?</h2>
        <p className="confirm-text">{message}</p>
        <div className="modal-actions">
          <button className="text-button" onClick={() => onAnswer(false)}>
            Cancel
          </button>
          <button className="danger-button" onClick={() => onAnswer(true)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}