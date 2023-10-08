import { Inter } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos, postTodo } from "@/api/todos";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const queryClient = useQueryClient();

    const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

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
                <button
                className="border-slate-600 p-2 rounded-lg bg-sky-300 hover:bg-sky-400 shadow-md"
                    onClick={() => {
                        alert("Mutation sent, check server console")
                        mutation.mutate();
                    }}
                >
                    Test Mutation
                </button>
            </div>
        </main>
    );
}
