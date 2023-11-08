import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import { TodoResponseData } from "./addTodo";
require("dotenv").config();

export default async function handler(
  req: NextApiRequest,
  // The type for the response is defined in src/api/todos.ts with the query functions
  res: NextApiResponse<TodoResponseData>
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
      name: "fetch-post-by-id",
      text: "SELECT * FROM public.posts WHERE user_id = $1 AND post_id = $2",
      values: [userId, postId],
    };

    // There should never be more than one post with the same id,
    // and we don't care which we get if there is more than one.
    const row = (await client.query(query)).rows[0]; 

    const updatedRow = {
      id: row.post_id,
      name: row.post_title,
      updated_at: row.post_date,
      author_id: row.user_id,
      content: row.post,
    };
    return res.status(200).json({ todo: updatedRow });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error connecting to database" });
  } finally {
    await client.end();
  }
}
