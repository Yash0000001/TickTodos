import { ITodo } from '@/models/todo.model';
import React, { useEffect, useState } from 'react'

const Todo = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [title, setTitle] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

    const setLocalstorage = (items: ITodo[]) => {
        localStorage.setItem("todos", JSON.stringify(items));
    };
    const loadLocalStorage = (): ITodo[] => {
        const storedTodos = localStorage.getItem("todos");
        return storedTodos ? JSON.parse(storedTodos) : [];
    };

    const handleAdd = async () => {
        setLoading(true);
        const res = await fetch("/api/todo/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        setTitle("");

        if (res.ok) {
            fetchTodos();
            setShowDialog(false); // Close dialog on success
        }
        setLoading(false);
    };

    const fetchTodos = async () => {
        const res = await fetch("/api/todo/fetch");
        if (res.ok) {
            const data = await res.json();
            const todosArray = Array.isArray(data.todo)
                ? data.todo
                : data && typeof data.todo === "object"
                    ? [data.todo]
                    : [];

            const localTodos = loadLocalStorage();
            const mergedTodos = merge(localTodos, todosArray);
            setTodos(sortTodos(mergedTodos));
            setLocalstorage(mergedTodos);
        }
    };

    const sortTodos = (items: ITodo[]) => {
        // Sorting: Pending todos come first (false), completed todos come second (true)
        return items.sort((a, b) => Number(a.completed) - Number(b.completed));
    };

    const merge = (localTodos: ITodo[], todosArray: ITodo[]) => {
        const todoMap = new Map<string, ITodo>();

        // Add both lists to the map to remove duplicates
        [...localTodos, ...todosArray].forEach((todo) =>
            todoMap.set(todo._id as string, todo)
        );

        return Array.from(todoMap.values());
    };

    const handleToggle = async (id: string, status: boolean) => {
        setTodos((prevTodos) => {
            const updatedTodos: ITodo[] = prevTodos.map((todo) =>
                todo._id === id ? { ...todo, completed: !status } as ITodo : todo
            );
            return sortTodos(updatedTodos);
        });

        try {
            const res = await fetch("/api/todo/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todoId: id, status: !status }),
            });


            if (!res.ok) {
                setTodos((prevTodos) => {
                    const updatedTodos: ITodo[] = prevTodos.map((todo) =>
                        todo._id === id ? { ...todo, completed: !status } as ITodo : todo
                    );
                    return sortTodos(updatedTodos);
                });
            }
        } catch {

            setTodos((prevTodos) => {
                const updatedTodos: ITodo[] = prevTodos.map((todo) =>
                    todo._id === id ? { ...todo, completed: !status } as ITodo : todo
                );
                return sortTodos(updatedTodos);
            });
        }
    };

    const deleteTodo = async (id: string) => {
        setDeleteLoader(true);
        const res = await fetch("/api/todo/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todoId: id }),
        });
        if (res.ok) {
            const localTodos = loadLocalStorage();
            const updatedTodos = localTodos.filter((todo) => todo._id !== id);
            setLocalstorage(updatedTodos);

            fetchTodos();
        }
        setDeleteLoader(false);
    };

    const DateDifference = ({ createdAt }: { createdAt: Date }) => {
        const getTimeDifference = (createdAt: Date) => {
            const createdDate = new Date(createdAt); // Convert to Date object
            const currentDate = new Date();

            const diffInMs = currentDate.getTime() - createdDate.getTime(); // Difference in ms
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days

            if (diffInDays < 1) {
                const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                if (diffInHours < 1) {
                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
                }
                return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
            }

            return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
        };
        return (
            <span className="text-sm text-gray-400">
                {getTimeDifference(createdAt)}
            </span>
        );
    };
    useEffect(() => {
        fetchTodos();
    }, []);
    return (
        <div className="relative flex flex-col items-center justify-center pt-10 pb-10 px-6 sm:px-12 md:px-28">
            <button
                onClick={() => setShowDialog(true)}
                className="bg-blue-800 text-white p-2 rounded-lg text-xl hover:bg-blue-500 cursor-pointer flex items-start"
            >
                <span className="text-xl">+</span> New Task
            </button>

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg relative max-w-lg w-full">
                        <button
                            onClick={() => setShowDialog(false)}
                            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-6">Add New Task</h2>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="New Todo...."
                                className="text-xl w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-blue-800 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 cursor-pointer"
                            >
                                {loading ? <span className="loader"></span> : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 w-full sm:w-4/5 md:w-3/5 lg:w-3/5">
                <ul>
                    {todos.map((todo: ITodo) => (
                        <li
                            key={todo?._id as string}
                            className="text-xl mb-2 border-2 border-gray-300 px-4 py-2 gap-3 rounded-lg"
                        >
                            <div className="flex gap-4 justify-between items-center">
                                <label className="flex gap-4 items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={todo?.completed}
                                        onChange={() =>
                                            handleToggle(todo._id as string, todo.completed)
                                        }
                                        className="hidden peer"
                                    />
                                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500"></div>
                                    <div
                                        className={`mb-2 text-lg md:text-2xl lg:text-2xl ${todo?.completed ? "text-gray-500 line-through" : ""
                                            }`}
                                    >
                                        {todo?.title}
                                    </div>
                                </label>
                                <DateDifference createdAt={todo?.createdAt} />
                            </div>
                            <div
                                className={`flex items-center justify-between ${todo?.completed ? "text-green-400" : "text-orange-400"
                                    }`}
                            >
                                <span
                                    className={`w-fit rounded-2xl text-lg px-2 py-1 flex items-center gap-2 bg-white ${todo?.completed ? "bg-green-100" : "bg-orange-100"
                                        }`}
                                >
                                    {todo?.completed ? (
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                    )}
                                    {todo?.completed ? "Completed" : "Pending"}
                                </span>
                                <span
                                    className="w-fit h-fit px-1 py-1 rounded-lg bg-red-200 cursor-pointer"
                                    onClick={() => deleteTodo(todo._id as string)}
                                >
                                    {deleteLoader ? (
                                        <span className="deleteLoader"></span>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="#a30000"
                                            viewBox="0 0 256 256"
                                        >
                                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Todo