import { TodosListResponseData } from "@/api/todos";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "pg";

export default async function handler(
  req: NextApiRequest,
  // The type for the response is defined in src/api/todos.ts with the query functions
  res: NextApiResponse<TodosListResponseData>
) {
  // this gets the clerk userid from the user's request headers
  const { userId } = getAuth(req);

  // If they have no id (not logged in) send a 401
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get connection string from env
  const conString = process.env.DB_CONNECTION_STRING;
  const client = new Client({ connectionString: conString });
  await client.connect();

  try {
    const query = {
      // give the query a unique name
      name: "fetch-user",
      text: "SELECT * FROM public.posts WHERE user_id = $1",
      values: [userId],
    };

    const rows = (await client.query(query)).rows;

    //console.log(response.rows)
    const updatedRows = rows.flatMap((row) => {
      return {
        id: row.post_id,
        name: row.post_title,
        updated_at: row.post_date,
        author_id: row.user_id,
        content: row.post,
      };
    });

    //console.log(updatedRows);

    return res.status(200).json({ todos: updatedRows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error connecting to database" });
  } finally {
    // Make sure the connection closes whether or not the query succeeds.
    await client.end();
  }
}
