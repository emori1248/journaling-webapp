export async function getTodos() {
    const result = await fetch("/api/hello");
    return await result.text()
}

export async function postTodo() {
    const result = await fetch("/api/addTodo", {
        method: 'POST',
        body: JSON.stringify({todo: "new todo name"})
    });
    return await result.text()
}