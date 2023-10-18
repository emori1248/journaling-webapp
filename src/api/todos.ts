export async function getTodos() {
    const result = await fetch("/api/hello");
    return await result.text()
}

export async function postTodo({test, testRequired} : {test: string, testRequired: string}) {
    const result = await fetch("/api/addTodo", {
        method: 'POST',
        body: JSON.stringify({test, testRequired})
    });
    return await result.text()
}