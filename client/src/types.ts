export type GigStatus = "open" | "assigned" | "closed";
export type BidStatus = "pending" | "hired" | "rejected";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface Bid {
  _id: string;
  message: string;
  amount: number;
  status: BidStatus;
  freelancer: User;
  gig: string;
  createdAt?: string;
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: GigStatus;
  client: User;
  hiredBid?: Bid | null;
  createdAt?: string;
}
