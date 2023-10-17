import { Inter } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, postTodo } from "@/api/todos";
import React from "react";
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const queryClient = useQueryClient();

    const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

    function handleSubmit(e: { preventDefault: () => void; target: any; }) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
    
        // You can pass formData as a fetch body directly:
        fetch('/some-api', { method: form.method, body: formData });
    
        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
      }

    const mutation = useMutation({
        mutationFn: postTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <main className="flex flex-col items-center justify-center bg-slate-300 w-screen h-screen">
            <div className="flex flex-col items-center justify-center bg-slate-100 text-slate-600 text-2xl p-4 rounded-md shadow-md font-semibold">
                <span className="mb-4">Test page</span>
                <span className="mb-4">Query Result: {query.data}</span> 
                <form method="post" onSubmit={handleSubmit}>
                    <label>
                        Text input: <input name="myInput" defaultValue="Text" />
                    </label>
                <button type="submit"
                className="border-slate-600 p-2 rounded-lg bg-sky-300 hover:bg-sky-400 shadow-md"
                >
                    Submit Entry
                </button>
                </form>
            </div>
        </main>
    );
}

