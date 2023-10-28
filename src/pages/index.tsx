// import { Inter } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, postTodo } from "@/api/todos";
import React from "react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

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
        <SignInButton/>
        <SignOutButton/>
        <Link href="/notes">Notes Page</Link>
      </div>
    </main>
  );
}
