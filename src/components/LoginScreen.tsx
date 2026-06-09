import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Lock, User as UserIcon } from "lucide-react";
import { useAuth, HOME_FOR_ROLE } from "../lib/auth";
import logo from "../assets/universal-ceramics-logo.png.asset.json";




export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(id, pass);
    if (!res.ok) {
      setError(res.error ?? "Login failed");
      return;
    }
    if (res.role) navigate({ to: HOME_FOR_ROLE[res.role] });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-10 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <img
            src={logo.url}
            alt="Universal Ceramics"
            className="mb-4 h-28 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-white">Welcome </span>
            <span className="gold-text">Back</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your showroom system
          </p>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">User ID</span>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <input
              value={id}
              onChange={(e) => { setId(e.target.value); setError(""); }}
              placeholder="owner or worker"
              autoFocus
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Password</span>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(""); }}
              placeholder="••••••••"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
        </label>

        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg gold-gradient py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in
        </button>
      </motion.form>
    </div>
  );
}
