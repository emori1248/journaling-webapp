import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

// This is the response type for the request, it's a typescript union depending on whether it returns data or an error.
type Data =
  | {
      data: string;
    }
  | {
      error: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // this gets the clerk userid from the user's request headers
  const { userId } = getAuth(req);

  // If they have no id (not logged in) send a 401
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Otherwise return their id to the browser for testing (you wouldn't probably want to give this to a user normally--
  // but there isn't necessarily anything "malicious" they could do with it).
  res.status(200).json({ data: `Your clerk userId is ${userId}` });
}
