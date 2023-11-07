import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export type TodoResponseData = {
  todo?: {
    id: string;
    name: string;
    updated_at: string;
    author_id: string;
    content: string;
  };
  error?: string;
};

// TODO not implemented
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponseData>
) {
  const { userId } = getAuth(req);

  // If they have no id (not logged in) send a 401
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const conString = process.env.DB_CONNECTION_STRING;
  const client = new Client({ connectionString: conString });
  await client.connect();

  try {
    const query = {
      // give the query a unique name
      name: "create-empty-todo",
      text: "INSERT INTO public.posts(post_title, user_id, post, post_id) VALUES($1, $2, $3, DEFAULT) RETURNING *",
      values: ["New Note", userId, ""],
    };

    // Should only ever be one row created by this query
    const row = (await client.query(query)).rows[0];

    const updatedRow = {
      id: row.post_id,
      name: row.post_title,
      updated_at: row.post_date,
      author_id: row.user_id,
      content: row.post,
    };
    console.log("updated row");
    console.log(updatedRow);
    return res.status(200).json({ todo: updatedRow });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error connecting to database" });
  } finally {
    await client.end();
  }
}
