"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
  emailRedirectTo: `${window.location.origin}/auth/confirm`,
  data: {
    full_name: fullName,
    phone,
  },
},
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Account created successfully. Please check your email to confirm your account."
      );
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <h1>Create Agent Account</h1>

        <p>Register to post and manage your houses on StudentStay.</p>

        <form
          onSubmit={handleSignup}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}