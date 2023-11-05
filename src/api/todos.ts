export type TodosListResponseData = {
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
  return JSON.parse(await result.text()) as TodosListResponseData;
}

export async function addTodo() {
  const result = await fetch("/api/addTodo", {
    method: "POST",
  });
  return await result.text();
}

export async function updateTodo({
  test,
  testRequired,
}: {
  test: string;
  testRequired: string;
}) {
  const result = await fetch("/api/updateTodo", {
    method: "PUT",
    body: JSON.stringify({ test, testRequired }),
  });
  return await result.text();
}
