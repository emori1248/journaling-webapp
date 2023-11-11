import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import { deleteTodoData } from "@/api/todos";
require("dotenv").config();

export default async function handler(
  req: NextApiRequest,
  // The type for the response is defined in src/api/todos.ts with the query functions
  res: NextApiResponse<deleteTodoData>
) {
  // this gets the clerk userid from the user's request headers
  const { userId } = getAuth(req);

  // If they have no id (not logged in) send a 401
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get the post id from the body
  // If the post id is garbage, it will simply fail on the prepared statement below.
  const postId = req.body.id;

  const conString = process.env.DB_CONNECTION_STRING;
  const client = new Client({ connectionString: conString });
  await client.connect();

  try {
    const query = {
      // give the query a unique name
      name: "delete-post-by-id",
      text: "DELETE FROM public.posts WHERE user_id = $1 AND post_id = $2",
      values: [userId, postId],
    };

    await client.query(query);

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error connecting to database" });
  } finally {
    await client.end();
  }
}
