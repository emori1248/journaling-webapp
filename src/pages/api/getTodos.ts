import { TodosResponseData, getTodos } from "@/api/todos";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {Client} from "pg"
require('dotenv').config()

export default async function handler(
  req: NextApiRequest,
  // The type for the response is defined in src/api/todos.ts with the query functions
  res: NextApiResponse<TodosResponseData>
) {
  // this gets the clerk userid from the user's request headers
  const { userId } = getAuth(req);

  // If they have no id (not logged in) send a 401
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const conString = process.env.DB_CONNECTION_STRING
  const client = new Client({connectionString:conString});
  await client.connect()

  try {
    const query = {
      // give the query a unique name
      name: 'fetch-user',
      text: 'SELECT * FROM public.posts WHERE user_id = $1',
      values: [userId],
    }
    const rows = (await client.query(query)).rows
    //console.log(response.rows)
    const updatedRows = rows.flatMap((row)=>{
      return {
        id: row.post_id,
        name: "Test note 3",
        updated_at: "1697900809", // unix timestamp
        author_id: row.user_id,
        content: row.post
            } 
    })
    console.log(updatedRows) 
    return res.status(200).json({ todos: updatedRows });
 } catch (err) {
    console.error(err);
    return res.status(500).json({error : "Error connecting to database"})
 } finally {
    await client.end()
 }



  // TODO https://node-postgres.com/features/queries Check out this documentation page for using their query builder to avoid injection avenues.
  
  // This is a big block of test data in place of a db query result
  /* 
  TODO I just added this back here so that you can console log the query data you're getting and so that the webapp is getting data
  TODO in the meantime that you can replace.

  TODO also make sure to handle errors and return a 500 internal server error as specified here https://node-postgres.com/#error-handling
  TODO if the query runs into any issues. 
  
  TODO Lastly, I changed this function to be async up at the top since it'll want to be using async/await to block intelligently on the db calls
  */
  const notes1 = [
    {
      id: "1234abcd",
      name: "Test note 1",
      updated_at: "1697900803", // unix timestamp
      author_id: "TESTING_ID",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      id: "5678efgh",
      name: "Test note 2",
      updated_at: "1697900806", // unix timestamp
      author_id: "TESTING_ID",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      id: "5678efghi",
      name: "Test note 3",
      updated_at: "1697900809", // unix timestamp
      author_id: "TESTING_ID",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];

  // And we return the data with a 200 status
  res.status(200).json({ todos: notes1 });
}
