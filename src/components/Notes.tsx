import { INotes } from '@/models/notes.model';
import { ITodo } from '@/models/todo.model';
import React, { useEffect, useState } from 'react'

const Notes = () => {
    const [notes, setNotes] = useState<INotes[]>([]);
    const [title, setTitle] = useState<string>("");
    const [selectedNote, setSelectedNote] = useState<INotes | null>(null);
    const [message, setMessage] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const setLocalstorage = (items: INotes[]) => {
        localStorage.setItem("notes", JSON.stringify(items));
    };
    const loadLocalStorage = (): INotes[] => {
        const storedNotes = localStorage.getItem("notes");
        return storedNotes ? JSON.parse(storedNotes) : [];
    };

    const handleAdd = async () => {
        setLoading(true);
        const res = await fetch("/api/notes/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, message }),
        });
        setTitle("");
        setMessage("");

        if (res.ok) {
            fetchNotes();
            setShowDialog(false); // Close dialog on success
        }
        setLoading(false);
    };

    const fetchNotes = async () => {
        const res = await fetch("/api/notes/fetch");
        if (res.ok) {
            const data = await res.json();
            const notesArray = Array.isArray(data.notes)
                ? data.notes
                : data && typeof data.notes === "object"
                    ? [data.notes]
                    : [];

            const localNotes = loadLocalStorage();
            const mergedNotes = merge(localNotes, notesArray);
            setNotes(mergedNotes);
            setLocalstorage(mergedNotes);
        }
    };

    const merge = (localTodos: INotes[], todosArray: INotes[]) => {
        const noteMap = new Map<string, INotes>();

        // Add both lists to the map to remove duplicates
        [...localTodos, ...todosArray].forEach((todo) =>
            noteMap.set(todo._id as string, todo)
        );

        return Array.from(noteMap.values());
    };

    const deleteNote = async (id: string) => {
        setDeleteLoader(true);
        const res = await fetch("/api/notes/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notesId: id }),
        });
        if (res.ok) {
            const localNotes = loadLocalStorage();
            const updatedNotes = localNotes.filter((notes) => notes._id !== id);
            setLocalstorage(updatedNotes);

            fetchNotes();
        }
        setDeleteLoader(false);
    };

    const DateDifference = ({ createdAt }: { createdAt: Date }) => {
        const getTimeDifference = (createdAt: Date) => {
            const createdDate = new Date(createdAt);
            const currentDate = new Date();

            const diffInMs = currentDate.getTime() - createdDate.getTime();
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

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

    const truncateMessage = (message: string | undefined, wordLimit: number) => {
        if (!message) return "No content available...";
        const words = message.split(" ");
        return words.length > wordLimit
            ? `${words.slice(0, wordLimit).join(" ")}...`
            : message;
    };
    useEffect(() => {
        fetchNotes();
    }, []);
    return (
        <div className="relative flex flex-col items-center justify-center pt-10 pb-10 px-6 sm:px-12 md:px-28 ">
            <button
                onClick={() => setShowDialog(true)}
                className="bg-blue-800 text-white p-2 rounded-lg text-xl hover:bg-blue-500 cursor-pointer flex items-start"
            >
                <span className="text-xl">+</span> New Notes
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
                        <h2 className="text-3xl font-bold mb-6">Add New Notes</h2>
                        <div className="flex flex-col gap-4 items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title..."
                                className="text-xl w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                            />
                            <input
                                type='textarea'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Start your Note here"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full sm:w-4/5 mt-7">
                {notes.map((note) => (
                    <div
                        key={note._id as string}
                        className="relative border rounded-lg p-4 bg-white shadow-md hover:shadow-lg cursor-pointer"
                        onClick={() => {
                            setSelectedNote(note);
                            setShowMessage(true);
                        }}
                    >
                        <div className='flex items-start justify-between'>
                        <h3 className="text-xl font-bold mb-2">{note.title || "Untitled"}</h3>
                        <DateDifference createdAt={note?.createdAt} />
                        </div>
                        <p className="text-gray-600 mb-11">
                            {truncateMessage(note.message, 50)}
                        </p>

                        <div className='absolute bottom-2 '>
                            <button
                                title='delete note'
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNote(note._id as string);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="#fff"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                                </svg>
                            </button>
                            
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog Box for Full Note */}
            {showMessage && selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg relative max-w-lg w-full">
                        <button
                            onClick={() => setShowMessage(false)}
                            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <button
                            onClick={() => setShowMessage(false)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-4"
                        >
                            Back
                        </button>
                        <h2 className="text-3xl font-bold mb-6">{selectedNote.title}</h2>
                        <p className="text-lg text-gray-700">{selectedNote.message || "No content available..."}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes