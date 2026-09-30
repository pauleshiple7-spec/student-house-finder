"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "80px auto",
        padding: "20px",
      }}
    >
      <h1>Agent Login</h1>

      <p>Login to manage your StudentStay properties.</p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "20px" }}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p style={{ marginTop: "15px" }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}