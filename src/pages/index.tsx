// import { Inter } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, postTodo } from "@/api/todos";
import React from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  type Inputs = {
    test: string;
    testRequired: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutation.mutate({ ...data });
  };

  console.log(watch("test"))
  return (
    <main className="flex flex-col items-center justify-center bg-slate-300 w-screen h-screen">
      <div className="flex flex-col items-center justify-center bg-slate-100 text-slate-600 text-2xl p-4 rounded-md shadow-md font-semibold">
        <span className="mb-4">Test page</span>
        <span className="mb-4">Query Result: {query.data}</span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <span>Test Field:</span>
          <input
            defaultValue="test"
            {...register("test")}
            className="border-2 rounded-md"
          />
          {/* include validation with required or other standard HTML validation rules */}
          <span>Required Test Field:</span>
          <input
            {...register("testRequired", { required: true })}
            className="border-2 rounded-md"
          />
          {/* errors will return when field validation fails  */}
          {errors.testRequired && <span className="text-red-500">This field is required</span>}
          <button
            type="submit"
            className="border-slate-600 p-2 rounded-lg bg-sky-300 hover:bg-sky-400 shadow-md"
          >
            Submit Entry
          </button>
        </form>
      </div>
    </main>
  );
}
