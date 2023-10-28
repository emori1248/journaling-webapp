// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    error: string;
};

// TODO not implemented
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    // Make sure to change this to 200 from 500 when it's done.
    res.status(500).json({ error: "Route not implemented" });
    console.log(req.body)
}
