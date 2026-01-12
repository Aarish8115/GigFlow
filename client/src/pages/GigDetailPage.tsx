import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import type { Bid, Gig } from "../types";
import { useAuth } from "../contexts/AuthContext";

function GigDetailPage() {
  const { gigId } = useParams<{ gigId: string }>();
  const { user } = useAuth();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidMessage, setBidMessage] = useState("");
  const [bidAmount, setBidAmount] = useState(100);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  const ownerId = gig?.client?.id || (gig?.client as any)?._id;
  const isOwner = user && ownerId && ownerId === user.id;

  const isAssigned = gig?.status === "assigned" || gig?.status === "closed";

  async function loadGig() {
    if (!gigId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/gigs/${gigId}`);
      setGig(res.data.gig);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gig not found");
    } finally {
      setLoading(false);
    }
  }

  async function loadBids() {
    if (!gigId || !isOwner) return;
    try {
      const res = await api.get(`/bids/${gigId}`);
      setBids(res.data.bids);
    } catch (_err) {
      setBids([]);
    }
  }

  useEffect(() => {
    loadGig();
  }, [gigId]);

  useEffect(() => {
    if (isOwner) {
      loadBids();
    }
  }, [isOwner, gigId]);

  async function submitBid(e: FormEvent) {
    e.preventDefault();
    if (!gigId) return;
    setBidError(null);
    setBidSuccess(null);
    try {
      await api.post("/bids", {
        gigId,
        message: bidMessage,
        amount: bidAmount,
      });
      setBidSuccess("Bid submitted");
      setBidMessage("");
      setBidAmount(100);
    } catch (err: any) {
      setBidError(err?.response?.data?.message || "Failed to submit bid");
    }
  }

  async function hire(bidId: string) {
    try {
      const res = await api.patch(`/bids/${bidId}/hire`);
      setGig(res.data.gig);
      await loadBids();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to hire");
    }
  }

  const sortedBids = useMemo(() => {
    return [...bids].sort((a, b) => a.amount - b.amount);
  }, [bids]);

  if (loading) return <div>Loading...</div>;
  if (error || !gig) return <div>{error || "Gig not found"}</div>;

  return (
    <div className="w-full px-4 sm:w-4/5 mx-auto text-background flex flex-col gap-6 my-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{gig.title}</h1>
          <p className="text-sm font-light">Posted by {gig.client?.username}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-lg font-medium">Budget: ${gig.budget}</span>
          <span className="rounded-full w-fit  text-sm px-2 py-1 bg-background text-primary flex items-center justify-center">
            {gig.status}
          </span>
        </div>
      </div>

      <p className="">{gig.description}</p>

      {gig.hiredBid && (
        <div>
          Hired bid: ${gig.hiredBid.amount} by{" "}
          {gig.hiredBid.freelancer?.username}
        </div>
      )}

      {!isOwner && user && gig.status === "open" && (
        <div className="bg-tertiary rounded-md py-2 px-4 text-primary">
          <h3 className="text-lg pb-4">Submit a bid</h3>
          <form onSubmit={submitBid} className="flex text-sm flex-col gap-4">
            <label className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <span>Message</span>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                rows={1}
                required
                className="text-background bg-primary text-sm focus:outline-tertiary rounded-sm px-4 py-2 w-full sm:w-3/5"
              />
            </label>
            <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span>Amount ($)</span>
              <input
                type="number"
                min={0}
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                required
                className="text-background bg-primary text-sm focus:outline-tertiary rounded-sm px-4 py-2 w-full sm:w-fit"
              />
            </label>
            {bidError && <div>{bidError}</div>}
            {bidSuccess && <div>{bidSuccess}</div>}
            <button
              type="submit"
              className="bg-primary text-background w-full sm:w-fit font-normal text-base px-3 py-1.5 rounded-sm "
            >
              Submit Bid
            </button>
          </form>
        </div>
      )}

      {!user && <div>Login to place a bid.</div>}

      {isOwner && (
        <div>
          <h3 className="text-xl">Bids</h3>
          {sortedBids.length === 0 && (
            <p className="font-light text-sm">No bids yet.</p>
          )}
          <div className="flex flex-col gap-4 mb-24 mt-4">
            {sortedBids.map((bid) => (
              <div
                key={bid._id}
                className="flex flex-col rounded-md px-6 py-4 gap-2 border-tertiary bg-secondary text-primary  "
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xl font-semibold">
                    {bid.freelancer?.username}
                  </span>
                  <span className=" h-fit rounded-full text-sm px-2 py-1 bg-background text-primary flex items-center justify-center">
                    {bid.status}
                  </span>
                </div>
                <p>{bid.message}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xl font-medium">${bid.amount}</span>
                  {gig.status === "open" && bid.status === "pending" && (
                    <button
                      className="bg-primary text-background w-full sm:w-fit font-normal text-base px-3 py-1.5 rounded-sm "
                      onClick={() => hire(bid._id)}
                    >
                      Hire
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAssigned && !gig.hiredBid && <div>This gig has been assigned.</div>}
    </div>
  );
}

export default GigDetailPage;
