import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function NotePage() {
  const router = useRouter();

  type PostInputs = {
    name: string;
    content: string;
  };

  const onSubmit: SubmitHandler<PostInputs> = (data) => {
    console.log({...data, id: router.query.slug});
    // mutation.mutate({ ...data });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInputs>();

  const queryResult = {
    id: "1234abcd",
    name: "Test note 1",
    updated_at: "1697900803", // unix timestamp
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };

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
      <div className="w-screen h-[90%] bg-slate-300 text-slate-900 flex justify-center p-8 pt-4">
        <div className="w-full bg-slate-100 rounded-lg shadow-md p-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full space-y-2"
          >
            <input
              defaultValue={queryResult.name}
              {...register("name", { required: true })}
              className="border-none rounded-md text-3xl p-2 focus:outline-none"
            />
            <textarea
              defaultValue={queryResult.content}
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
        </div>
      </div>
    </main>
  );
}
