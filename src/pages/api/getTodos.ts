import { TodosResponseData } from "@/api/todos";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
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

  // This is an example for making use of their id in the server, you would probably want to use the SQL adapter here
  // with some sort of query like "selectimport { TodosResponseData } from "@/api/todos";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import * as pg from 'pg'
const { Pool } = pg
require('dotenv').config()

export default function handler(
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

  // This is an example for making use of their id in the server, you would probably want to use the SQL adapter here
  // with some sort of query like "select * from posts where authorid is userid" or whatever the syntax might be exactly
  // and then return it as a big json object (which would need to be updated in the datatype accordingly)

  var conString = process.env.DB_CONNECTION_STRING
  var client = new pg.Client(conString);

  // This is a big block of test data in place of a db query result
  const notes = [
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('SELECT * FROM public.posts', function(err, result) {
        if(err) {
          return console.error('error running query', err);
        }
        console.log(result.rows);
        // >> output: 2018-08-23T14:02:57.117Z
      });
    }),
  ] as TodosResponseData;

  // And we return the data with a 200 status
  res.status(200).json({ todos: notes });
}
 * from posts where authorid is userid" or whatever the syntax might be exactly
  // and then return it as a big json object (which would need to be updated in the datatype accordingly)

  // This is a big block of test data in place of a db query result
  const notes = [
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
  res.status(200).json({ todos: notes });
}
