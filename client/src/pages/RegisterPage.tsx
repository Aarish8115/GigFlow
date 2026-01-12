import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, username, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-tertiary w-full min-h-screen relative text-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md md:w-2/5 md:min-h-4/5 md:px-16 rounded-md md:absolute md:-translate-1/2 md:top-1/2 md:left-1/2 bg-primary p-6 flex flex-col gap-1 justify-center">
        <h1 className="font-semibold text-3xl self-center">Create account</h1>
        <p className="text-xs self-center">
          Join GigFlow to post or bid on gigs.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
          <label className="flex flex-col gap-2">
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className=" text-background  outline-none rounded-sm px-4 py-2 w-full bg-white"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className=" text-background  outline-none rounded-sm px-4 py-2 w-full bg-white"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              autoComplete="new-password"
              className=" text-background  outline-none rounded-sm px-4 py-2 w-full bg-white"
            />
          </label>

          {error && <div>{error}</div>}

          <button
            type="submit"
            className="bg-tertiary cursor-pointer self-center w-full md:w-fit text-primary h-fit font-normal text-base px-3 py-1.5 rounded-sm text-center"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm self-center text-center mt-1">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
