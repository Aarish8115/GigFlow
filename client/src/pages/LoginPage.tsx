import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-tertiary w-full min-h-screen relative text-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md md:w-2/5 md:h-4/5 md:px-16 rounded-md md:absolute md:-translate-1/2 md:top-1/2 md:left-1/2 bg-primary p-6 flex flex-col gap-1 justify-center">
        <h1 className="font-semibold text-3xl self-center">Login</h1>
        <p className="text-xs self-center">Use your email or username plus password.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <label className="flex flex-col gap-2">
            <span>Email or Username</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              className=" text-background  outline-none rounded-sm px-4 py-2 w-full bg-white"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className=" text-background  outline-none rounded-sm px-4 py-2 w-full bg-white"
            />
          </label>

          {error && <div>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-tertiary cursor-pointer self-center w-full md:w-fit text-primary h-fit font-normal text-base px-3 py-1.5 rounded-sm text-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm self-center text-center mt-1">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
