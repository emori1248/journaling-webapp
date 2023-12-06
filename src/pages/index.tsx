import React from "react";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";


export default function Home() {


  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-sky-200 w-screen h-screen text-slate-900 space-y-16">
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
