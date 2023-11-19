import { getTodoById, getTodos, updateTodo } from "@/api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function NotePage() {
  const listQuery = useQuery({ queryKey: ["getTodos"], queryFn: getTodos });
  const router = useRouter();

  if (!router.isReady) return;

  if (!listQuery.data) return;

  const slug = router.query.slug;
  console.log(slug);

  function NoteForm() {
    const queryClient = useQueryClient();

    const query = useQuery(["todoById", slug], () =>
      getTodoById(slug as string)
    ); // TODO change this force cast later

    const updateMutation = useMutation(
      ({
        id,
        content,
        name,
      }: {
        id: string;
        content: string;
        name: string;
      }) => {
        return updateTodo(id, content, name);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getTodos"] });
          queryClient.invalidateQueries({ queryKey: ["todoById"] });
        },
      }
    );

    type PostInputs = {
      name: string;
      content: string;
    };

    const onSubmit: SubmitHandler<PostInputs> = (data) => {
      console.log({ ...data, id: router.query.slug });
      updateMutation.mutate({
        content: data.content,
        id: router.query.slug as string,
        name: data.name,
      });
    };

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<PostInputs>();

    if (!query.data) {
      return;
    }

    const { todo } = query.data;

    // TODO
    if (!todo) return;

    //console.log(todo);

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col h-full space-y-2"
      >
        <input
          defaultValue={todo.name}
          {...register("name", { required: true })}
          className="border-none rounded-md text-3xl p-2 focus:outline-none"
        />
        <textarea
          defaultValue={todo.content}
          {...register("content", { required: true })}
          className="border-none rounded-md h-full resize-none p-2 focus:outline-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="border-slate-600 px-4 py-2 text-xl rounded-lg bg-sky-300 hover:bg-sky-400 shadow-md"
          >
            Submit Entry
          </button>
        </div>
      </form>
    );
  }

  function NoteListItem({
    id,
    name,
    isActive,
  }: {
    id: string;
    name: string;
    isActive: boolean;
  }) {
    return (
      <div
        className={`border-b-2 ${
          isActive ? "bg-slate-200" : ""
        } border-slate-200 last:border-0 px-2 py-1 rounded-md hover:bg-slate-200`}
      >
        <Link href={`/notes/${id}`}>
          <li key={id} className="flex justify-between">
            <span className="text-lg">{name}</span>
          </li>
        </Link>
      </div>
    );
  }

  const { todos } = listQuery.data;

  if (!todos) return;

  console.log(todos);

  return (
    <main className="bg-slate-300 h-screen">
      <div className="pt-4 px-8 w-screen flex justify-end">
        <button
          className="bg-slate-100 px-4 py-2 hover:bg-red-500 hover:text-white hover:shadow-md text-slate-900 text-xl rounded-md shadow-md"
          onClick={() => {
            confirm("Are you sure you want to log out?");
          }}
        >
          Log Out
        </button>
      </div>
      <div className="w-screen h-[90%] bg-slate-300 text-slate-900 flex justify-center p-8 pt-4 space-x-4">
        <div className="w-64 bg-slate-100 rounded-lg shadow-md p-2">
          <ul>
            {todos.flatMap((note) => {
              return (
                <NoteListItem
                  id={note.id}
                  name={note.name}
                  isActive={parseInt(note.id) === parseInt(slug as string)}
                  key={note.id}
                />
              );
            })}
          </ul>
        </div>
        <div className="w-full bg-slate-100 rounded-lg shadow-md p-2">
          <NoteForm />
        </div>
      </div>
    </main>
  );
}
