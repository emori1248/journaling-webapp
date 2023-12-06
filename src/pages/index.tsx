// import { Inter } from "next/font/google";
import { useQueryClient } from "@tanstack/react-query";
// import { getTodos, addTodo, getTodoById } from "@/api/todos";
import React from "react";
// import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const queryClient = useQueryClient();

  // const query = useQuery({ queryKey: ["todoById"], queryFn: getTodoById });

  // const mutation = useMutation({
  //   mutationFn: addTodo,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["todos"] });
  //   },
  // });

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
    // mutation.mutate();
  };

  console.log(watch("test"));
  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-sky-200 w-screen h-screen text-slate-900 space-y-16">
      <span className="font-semibold text-5xl">Journaling App</span>
      <Link href={"/notes"}>
        <button className="text-2xl font-semibold bg-sky-300 p-4 rounded-xl">
          <div className="flex">

            Get Started 
            <span className="relative top-0 text-4xl">
            <BsArrowRightShort/>

            </span>
          </div>
        </button>
      </Link>
    </main>
  );
}
