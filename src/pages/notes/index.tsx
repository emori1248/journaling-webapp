import { addTodo, deleteTodo, getTodos } from "@/api/todos";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import {
  BsFillTrashFill,
  BsPlusCircle,
  BsArrowRightShort,
} from "react-icons/bs";

dayjs.extend(relativeTime);

export default function NotesPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const query = useQuery({ queryKey: ["getTodos"], queryFn: getTodos });

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (data) => {
      router.push(`/notes/${JSON.parse(data).todo.id}`);
    },
  });

  const deleteMutation = useMutation(
    (id: string) => {
      return deleteTodo(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getTodos"] });
      },
    }
  );

  // TODO
  if (!query.data) {
    return;
  }

  var { todos } = query.data;

  // TODO
  if (!todos) return;

  function NoteListItem({
    id,
    name,
    updated_at,
  }: {
    id: string;
    name: string;
    updated_at: string;
  }) {
    return (
      <div className="border-b-2 border-slate-200 hover:bg-slate-300 last:border-b-0 px-2 py-1 rounded-md">
        <li key={id}>
          <div className="flex justify-between">
            <div className="w-full">
              <Link href={`/notes/${id}`}>
                <div className="flex space-x-6 align-bottom w-full">
                  <h3 className="font-semibold text-2xl">{name}</h3>
                  <span className="relative top-1 text-slate-400 italic justify-items-end text-lg">
                    Last edited: {dayjs().from(dayjs(parseInt(updated_at)))}
                  </span>
                </div>
              </Link>
            </div>

            <button
              onClick={() => {
                confirm(`Are you sure you want to delete "${name}?"`);
                deleteMutation.mutate(id);
              }}
              className="px-2 rounded-md hover:bg-red-500 hover:text-white text-xl"
            >
              <BsFillTrashFill />
            </button>
          </div>
        </li>
      </div>
    );
  }

  return (
    <main className="bg-slate-300 h-screen">
      <div className="pt-4 px-8 w-screen flex justify-end space-x-4">
        <button
          className="border-slate-600 px-4 py-2 text-xl rounded-lg bg-sky-400 hover:bg-sky-500 shadow-md whitespace-nowrap overflow-hidden"
          onClick={() => {
            addMutation.mutate();
          }}
        >
          <div className="flex flex-row space-x-2">
            <span>New Note</span>
            <span className="relative top-1">
              <BsPlusCircle />
            </span>
          </div>
        </button>
        {/* <button
          className="bg-slate-100 px-4 py-2 hover:bg-red-500 hover:text-white text-slate-900 text-xl rounded-md shadow-md"
          onClick={() => {
            confirm("Are you sure you want to log out?");
          }}
        >
          Log Out
        </button> */}
                <div className="bg-slate-100 p-2 rounded-3xl shadow-md">
          <UserButton afterSignOutUrl="/"/>
        </div>
      </div>
      <div className="w-screen h-auto bg-slate-300 text-slate-900 flex justify-center p-8 pt-4">
        <div className="w-full h-full bg-slate-100 rounded-lg shadow-md p-2">
          <ul className="w-full">
            {todos.length > 0 ? (
              todos.flatMap((note) => {
                return (
                  <NoteListItem
                    id={note.id}
                    name={note.name}
                    updated_at={note.updated_at}
                    key={note.id}
                  />
                );
              })
            ) : (
              <div className="px-3">
                <h3 className="font-semibold text-2xl flex flex-row">
                  <span>Create a note to get started!</span>
                  <span className="relative top-[2px] text-3xl">
                    <BsArrowRightShort />
                  </span>
                </h3>
              </div>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
