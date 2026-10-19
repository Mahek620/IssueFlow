import { useState } from "react";
import { loginApi, registerApi, saveSession } from "./api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginApi({ email, password })
          : await registerApi({ name, email, password });
      saveSession(data);
      onLogin({ name: data.name, email: data.email });
    } catch (err) {
      setError(err.message || "Backend se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-brand">
          <span>◆</span> IssueFlow
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Welcome back. Login to your workspace."
            : "Create your account to get started."}
        </p>

        <form onSubmit={submit}>
          {mode === "register" && (
            <>
              <label htmlFor="auth-name">Name</label>
              <input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </>
          )}

          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Naya account chahiye?" : "Pehle se account hai?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}