import { useState } from "react";
import App from "./App";
import Login from "./Login";
import { getToken, getUser, clearSession } from "./api";

export default function AuthGate() {
  const [user, setUser] = useState(getToken() ? getUser() : null);

  function logout() {
    clearSession();
    setUser(null);
  }

  if (!user) return <Login onLogin={setUser} />;
  return <App key={user.email} user={user} onLogout={logout} />;
}