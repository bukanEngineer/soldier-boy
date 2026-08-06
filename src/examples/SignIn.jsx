import React, { useState } from "react";
import { Logomark } from "../components/Logomark/Logomark.jsx";
import { Input } from "../components/Input/Input.jsx";
import { Button } from "../components/Button/Button.jsx";
import { Checkbox } from "../components/Checkbox/Checkbox.jsx";
import { LinkButton } from "../components/LinkButton/LinkButton.jsx";
import { Alert } from "../components/Alert/Alert.jsx";
import "./SignIn.css";

export function SignIn() {
  const [showError, setShowError] = useState(false);
  return (
    <div className="ex-signin" data-screen-label="05 Sign in">
      <aside className="ex-signin__brand">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <Logomark size={42} />
          <span style={{ font: "800 22px/1 var(--font-display)", color: "#fff", letterSpacing: "-0.01em" }}>StraitsX</span>
        </div>
        <h1 style={{ font: "700 36px/1.1 var(--font-display)", margin: 0, color: "#fff", letterSpacing: "-0.02em" }}>
          Payments Infrastructure<br />for Digital Assets
        </h1>
        <p style={{ font: "var(--body-large)", color: "#79FFCA", marginTop: 16, maxWidth: "32ch" }}>
          Mint, send and earn on regulated stablecoins. Backed 1:1 by reserves held with Standard Chartered Bank.
        </p>
      </aside>

      <main className="ex-signin__panel">
        <div className="ex-signin__form">
          <h2 style={{ font: "var(--title-large)", color: "var(--text-primary)", margin: 0 }}>Welcome back</h2>
          <p style={{ font: "var(--body-medium)", color: "var(--text-secondary)", margin: "8px 0 24px" }}>
            Sign in to your StraitsX account.
          </p>

          {showError && (
            <Alert tone="critical" title="Sign-in failed" onDismiss={() => setShowError(false)}>
              The email or password you entered is incorrect.
            </Alert>
          )}

          <form
            style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: showError ? 16 : 0 }}
            onSubmit={(e) => { e.preventDefault(); setShowError(true); }}
          >
            <Input label="Email" type="email" placeholder="hello@straitsx.com" autoComplete="email" />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Checkbox label="Remember me" />
              <LinkButton size="sm" as="a" href="#forgot">Forgot password?</LinkButton>
            </div>
            <Button size="lg" type="submit">Sign in</Button>
          </form>

          <p style={{ font: "var(--body-medium)", color: "var(--text-secondary)", textAlign: "center", marginTop: 24 }}>
            Don&apos;t have an account? <LinkButton as="a" href="#signup" size="md">Open an account</LinkButton>
          </p>
        </div>
      </main>
    </div>
  );
}
