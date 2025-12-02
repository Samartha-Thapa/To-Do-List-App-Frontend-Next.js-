export async function fetchTasks(token:string) {
    const res = await fetch("http://127.0.0.1:8000/api/tasks", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if(!res.ok) {
        throw new Error("Unauthorized or request failed");
    }

    return res.json();
}