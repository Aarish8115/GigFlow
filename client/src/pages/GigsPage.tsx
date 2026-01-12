import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import type { Gig } from "../types";
import { useAuth } from "../contexts/AuthContext";

function GigsPage() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadGigs(query?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/gigs", {
        params: { search: query || undefined },
      });
      setGigs(res.data.gigs);
    } catch (_err) {
      setError("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGigs();
  }, []);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    loadGigs(search);
  }

  return (
    <div className="flex flex-col py-8 md:w-4/5 mx-auto w-full text-background">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-xl">Open Gigs</h1>
          <p className="text-sm font-light  ">
            Browse active gigs and apply with your best bid.
          </p>
        </div>
        {user && (
          <Link
            to="/gigs/new"
            className="bg-tertiary text-primary h-fit font-normal text-base px-3 py-1.5 rounded-sm "
          >
            Post a Gig
          </Link>
        )}
      </div>

      <form
        onSubmit={handleSearch}
        className=" px-16 flex justify-center items-center gap-4 py-4 "
      >
        <input
          placeholder="Search gigs by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" text-background border-b-2 focus:border-b-0 rounded-br-none rounded-bl-none border-b-tertiary  focus:outline-tertiary rounded-sm px-4 py-2 w-3/5"
        />
        <button
          type="submit"
          className="bg-tertiary  text-primary h-fit font-normal text-base px-3 py-1.5 rounded-sm "
        >
          Search
        </button>
      </form>

      {loading && <div className="text-sm font-light  ">Loading gigs...</div>}
      {error && <div className="text-sm font-light  text-red-300">{error}</div>}

      {!loading && !error && gigs.length === 0 && (
        <div className="text-sm font-light  ">No gigs found.</div>
      )}

      <div className="bg-gray-500flex flex-col gap-4">
        {gigs.map((gig) => (
          <Link
            key={gig._id}
            to={`/gigs/${gig._id}`}
            className="flex flex-col rounded-sm px-4 py-2 gap-2 border-tertiary bg-secondary text-primary  "
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{gig.title}</h3>
              <span className="rounded-full text-sm px-2 py-1 bg-background text-primary flex items-center justify-center">{gig.status}</span>
            </div>
            <p className="text-sm">{gig.description}</p>
            <div className="flex gap-4 items-center">
              <span className="font-medium">Budget: ${gig.budget}</span>
              <span className="text-sm font-light  ">
                by {gig.client?.username}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GigsPage;
