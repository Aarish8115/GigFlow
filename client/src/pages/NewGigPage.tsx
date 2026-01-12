import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

function NewGigPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(500);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/gigs", { title, description, budget });
      navigate(`/gigs/${res.data.gig._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create gig");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-4/5  mx-auto text-background flex flex-col gap-6 my-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Post a Gig</h1>
        <p className="text-sm font-light">
          Describe your project so freelancers can bid.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-tertiary rounded-md py-8 px-8 text-primary flex text-sm flex-col gap-6"
      >
        <label className="flex gap-2 items-center">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-background outline-none bg-primary text-sm  focus:outline-tertiary rounded-sm px-4 py-2 w-3/5"
          />
        </label>

        <label className="flex gap-2 items-start">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            required
            className="text-background outline-none bg-primary text-sm  focus:outline-tertiary rounded-sm px-4 py-2 w-3/5"
          />
        </label>

        <label className="flex gap-2 items-center">
          <span>Budget ($)</span>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
            className="text-background outline-none bg-primary text-sm  focus:outline-tertiary rounded-sm px-4 py-2 w-3/5"
          />
        </label>

        {error && <div>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary self-center cursor-pointer text-background w-fit font-normal text-base px-3 py-1.5 rounded-sm mt-2"
        >
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
}

export default NewGigPage;
