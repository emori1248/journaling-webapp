import { addTodo, getTodos } from "@/api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { BsFillTrashFill } from "react-icons/bs";

dayjs.extend(relativeTime);

export default function NotesPage() {
  const router = useRouter();

  const query = useQuery({ queryKey: ["getTodos"], queryFn: getTodos });

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (data) => {
      router.push(`/notes/${JSON.parse(data).todo.id}`)
    },
  });

  // TODO
  if (!query.data) {
    return;
  }

  const { todos } = query.data;

  // TODO
  if (!todos) return;


  return (
    <main className="bg-slate-300 h-screen">
      <div className="pt-4 px-8 w-screen flex justify-end space-x-4">
        <button
          className="border-slate-600 px-4 py-2 text-xl rounded-lg bg-sky-400 hover:bg-sky-500 shadow-md"
          onClick={() => {
            mutation.mutate()
          }}
        >
          New Note
        </button>
        <button
          className="bg-slate-100 px-4 py-2 hover:bg-red-500 hover:text-white text-slate-900 text-xl rounded-md shadow-md"
          onClick={() => {
            confirm("Are you sure you want to log out?");
          }}
        >
          Log Out
        </button>
      </div>
      <div className="w-screen h-auto bg-slate-300 text-slate-900 flex justify-center p-8 pt-4">
        <div className="w-full h-full bg-slate-100 rounded-lg shadow-md p-2">
          <ul className="w-full">
            {todos.flatMap((note) => {
              return (
                <div className="border-b-2 border-slate-200 hover:bg-slate-300 last:border-b-0 px-2 py-1 rounded-md transition">
                  <li key={note.id}>
                    <div className="flex justify-between">
                      <div className="w-full">
                        <Link href={`/notes/${note.id}`}>
                          <div className="flex space-x-6 align-bottom w-full">
                            <h3 className="font-semibold text-2xl">
                              {note.name}
                            </h3>
                            <span className="flex text-slate-400 italic justify-items-end text-lg">
                              Last edited:{" "}
                              {dayjs().from(dayjs(parseInt(note.updated_at)))}
                            </span>
                          </div>
                        </Link>
                      </div>

                      <button
                        onClick={() =>
                          confirm(
                            `Are you sure you want to delete "${note.name}?"`
                          )
                        }
                        className="px-2 rounded-md hover:bg-red-500 hover:text-white text-xl"
                      >
                        <BsFillTrashFill />
                      </button>
                    </div>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
