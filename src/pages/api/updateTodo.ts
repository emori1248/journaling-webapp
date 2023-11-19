import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";
import { deleteTodoData } from "@/api/todos";

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
  const content = req.body.content;
  const name = req.body.name;

  const conString = process.env.DB_CONNECTION_STRING;
  const client = new Client({ connectionString: conString });
  await client.connect();

  try {
    const query = {
      // give the query a unique name
      name: "update-post",
      text: "UPDATE public.posts SET post = $1, post_title = $2 WHERE post_id = $3 AND user_id = $4",
      values: [content, name, postId, userId],
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
