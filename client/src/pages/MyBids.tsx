import { useEffect, useState } from "react";
import api from "../api/client";
import type { Bid, Gig } from "../types";
import { Link } from "react-router";

const MyBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  async function loadMyGigs() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bids/me");
      setBids(res.data.bids);
    } catch (_err) {
      setError("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadMyGigs();
  }, []);

  useEffect(() => {
    if (!bids.length) {
      setGigs([]);
      return;
    }

    const populatedGigs = bids
      .map((bid) => bid.gig)
      .filter((gig): gig is Gig => Boolean(gig));

    setGigs(populatedGigs);
  }, [bids]);
  useEffect(() => {
    if (bids.length) {
      console.log("data state", bids);
    }
  }, [bids]);

  return (
    <div>
      <div className="flex flex-col gap-4 w-3/5 mx-auto mt-8 pb-24">
        {bids.map((bid) => (
          <Link
            key={bid._id}
            to={`/gigs/${bid.gig._id}`}
            className="flex flex-col rounded-md px-6 py-4 gap-2 border-tertiary bg-secondary text-primary  "
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold">{bid.gig.title}</h3>
              <span className="rounded-full text-sm px-2 py-1 bg-background text-primary flex items-center justify-center">
                {bid.status}
              </span>
            </div>
            <p className="text-sm">{bid.gig.description}</p>
            <div className="flex gap-4 items-center">
              <span className="font-medium">
                Budget: <span className="text-xl">${bid.gig.budget}</span>
              </span>
              <span className="text-sm font-light  ">
                by {bid.gig.client?.username}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyBids;
