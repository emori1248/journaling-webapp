import {
  addTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "@/api/todos";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BsArrowLeftShort, BsFillTrashFill, BsPlus } from "react-icons/bs";

export default function NotePage() {
  const listQuery = useQuery({ queryKey: ["getTodos"], queryFn: getTodos });
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation(
    (id: string) => {
      return deleteTodo(id);
    },
    {
      onSuccess: () => {
        // Redirect user to notes list when a currently open note is deleted
        router.push("/notes");
      },
    }
  );

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: (data) => {
      // Reset query cache whenever a new note is created
      queryClient.invalidateQueries({ queryKey: ["getTodos"] });
      queryClient.invalidateQueries({ queryKey: ["todoById"] });

      // Redirect user to the new note page
      router.push(`/notes/${JSON.parse(data).todo.id}`);
    },
  });

  if (!router.isReady) return;

  if (!listQuery.data) return;

  const slug = router.query.slug;

  /*
    Component containing form and submission logic
  */
  function NoteForm() {
    const queryClient = useQueryClient();

    const query = useQuery(["todoById", slug], () =>
      getTodoById(slug as string)
    );

    const TIMEOUT_BEFORE_MUTATION_SUCCESS_RESET_MS = 1000;

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
        onSuccess: async () => {
          // Reset query cache whenever a note update occurs
          queryClient.invalidateQueries({ queryKey: ["getTodos"] });
          queryClient.invalidateQueries({ queryKey: ["todoById"] });
          // Delay to reset mutation state
          setTimeout(() => {
            updateMutation.reset();
          }, TIMEOUT_BEFORE_MUTATION_SUCCESS_RESET_MS);
        },
      }
    );

    // Type for user-facing form inputs to enforce typesafety
    type PostInputs = {
      name: string;
      content: string;
    };

    // On the form submit combine the user inputs with the note slug for the mutation endpoint
    const onSubmit: SubmitHandler<PostInputs> = (data) => {
      updateMutation.mutate({
        content: data.content,
        id: router.query.slug as string,
        name: data.name,
      });
    };

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<PostInputs>();

    if (!query.data) {
      return;
    }

    const { todo } = query.data;

    // If no todo is recieved return an empty page until content is supplied (which will not likely not be visible to user due to prefetching)
    if (!todo) return;

    const str: string = watch("content");
    const postLength = str ? str.length : query.data.todo?.content.length ?? 0;
    const MAX_POST_LENGTH = 1000;
    const postIsOverCharacterLimit = postLength > MAX_POST_LENGTH;

    // The color of the submit button is determined by the state of the page here
    const buttonStyle = `border-slate-600 px-4 py-2 text-xl rounded-lg ${
      updateMutation.isLoading || postIsOverCharacterLimit
        ? "bg-slate-300 hover:bg-slate-300"
        : "bg-sky-300 hover:bg-sky-400"
    }
      ${
        updateMutation.isSuccess
          ? "bg-green-300 hover:bg-green-400"
          : "bg-sky-300 hover:bg-sky-400"
      }
    shadow-md`;

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="note-form"
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
          <div className="px-4 py-2 text-xl space-x-2">
            {(errors.name || errors.content) && (
              <span className="text-red-600">
                Title and content are required
              </span>
            )}
            <span
              className={postLength > MAX_POST_LENGTH ? "text-red-600" : ""}
            >
              {postLength}/{MAX_POST_LENGTH}
            </span>
          </div>
          <button
            type="submit"
            disabled={updateMutation.isLoading || postIsOverCharacterLimit}
            className={buttonStyle}
          >
            Submit Entry
          </button>
        </div>
      </form>
    );
  }

  /*
    Component for navigation list items in the sidebar.
  */
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
        } border-slate-200 last:border-0 first:rounded-t-md last-of-type:rounded-b-md px-1 hover:bg-slate-200`}
      >
        <Link href={`/notes/${id}`}>
          <li key={id} className="flex justify-between">
            <span className="text-lg px-2 py-1">{name}</span>
            {isActive ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`Are you sure you want to delete "${name}"?`))
                    deleteMutation.mutate(id);
                }}
              >
                <div className="text-slate-600 hover:text-red-600 px-2 py-1 rounded-sm">
                  <BsFillTrashFill />
                </div>
              </button>
            ) : (
              <></>
            )}
          </li>
        </Link>
      </div>
    );
  }

  const { todos } = listQuery.data;

  // If no todo is recieved return an empty page until content is supplied (which will not likely not be visible to user due to prefetching)
  if (!todos) return;

  return (
    <main className="bg-gradient-to-br from-slate-300 to-sky-200 h-screen">
      <div className="pt-4 px-8 w-screen flex justify-between">
        <Link href={"/notes"}>
          <button className="border-slate-600 px-4 py-2 text-xl rounded-lg bg-sky-300 hover:bg-sky-400 shadow-md text-black flex">
            <span className="relative top-1">
              <BsArrowLeftShort />
            </span>
            Back
          </button>
        </Link>
        <div className="bg-slate-100 p-2 rounded-3xl shadow-md">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="w-screen h-[90%]  text-slate-900 flex justify-center p-8 pt-4 space-x-4">
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
            <li key={0} className="flex justify-end">
              <div className="py-2 px-1">
                <button
                  onClick={() => {
                    addMutation.mutate();
                  }}
                >
                  <div className="text-slate-600 px-1 rounded-sm text-2xl">
                    <BsPlus />
                  </div>
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div className="w-full bg-slate-100 rounded-lg shadow-md p-2">
          <NoteForm />
        </div>
      </div>
    </main>
  );
}
