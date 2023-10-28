export type TodosResponseData = {
  todos?: {
    id: string;
    name: string;
    updated_at: string;
    author_id: string;
    content: string;
  }[];
  error?: string;
};

export async function getTodos() {
  const result = await fetch("/api/getTodos");
  return JSON.parse(await result.text()) as TodosResponseData;
}

export async function postTodo({
  test,
  testRequired,
}: {
  test: string;
  testRequired: string;
}) {
  const result = await fetch("/api/addTodo", {
    method: "POST",
    body: JSON.stringify({ test, testRequired }),
  });
  return await result.text();
}
