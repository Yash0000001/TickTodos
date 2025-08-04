import { INotes } from '@/models/notes.model';
import React, { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa6';
import { FaRegHeart } from 'react-icons/fa6';
import { VscPinned } from "react-icons/vsc";
import { TbPinnedFilled } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useMemo } from "react";
import { FaPlusCircle } from "react-icons/fa";


const Notes = () => {
    const [notes, setNotes] = useState<INotes[]>([]);
    const [title, setTitle] = useState<string>("");
    const [selectedNote, setSelectedNote] = useState<INotes | null>(null);
    const [message, setMessage] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<string | null>(null);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [state, setState] = useState<string>("All");

    const setLocalstorage = (items: INotes[]) => {
        localStorage.setItem("notes", JSON.stringify(items));
    };
    const loadLocalStorage = (): INotes[] => {
        const storedNotes = localStorage.getItem("notes");
        return storedNotes ? JSON.parse(storedNotes) : [];
    };

    const handleAdd = async () => {
        setLoading(true);

        if (isEditMode && selectedNote?._id) {
            const res = await fetch("/api/notes/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    notesId: selectedNote._id,
                    title,
                    message,
                }),
            });

            if (res.ok) {
                setTitle("");
                setMessage("");
                setShowDialog(false);
                setIsEditMode(false);
                setSelectedNote(null);
                fetchNotes();
            }
        } else {
            const res = await fetch("/api/notes/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, message }),
            });

            if (res.ok) {
                setTitle("");
                setMessage("");
                setShowDialog(false);
                fetchNotes();
            }
        }

        setLoading(false);
    };

    const toggleLikeUnlike = async (id: string) => {
        const currentNote = notes.find((note) => note._id === id);
        if (!currentNote) return;

        const updatedNotes: INotes[] = notes.map((note) => {
            if (note._id === id) {
                return {
                    ...(note.toObject ? note.toObject() : note), // convert if it's a Mongoose document
                    favourite: !note.favourite,
                };
            }
            return note.toObject ? note.toObject() : note; // ensure all notes are plain
        });
        setNotes(updatedNotes);
        setLocalstorage(updatedNotes);

        try {
            const res = await fetch("/api/notes/liking", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notesId: id }),
            });

            if (!res.ok) {
                // throw new Error("Failed to update favourite");
                const currentNote = notes.find((note) => note._id === id);
                if (!currentNote) return;

                const updatedNotes: INotes[] = notes.map((note) => {
                    if (note._id === id) {
                        return {
                            ...(note.toObject ? note.toObject() : note), // convert if it's a Mongoose document
                            favourite: !note.favourite,
                        };
                    }
                    return note.toObject ? note.toObject() : note; // ensure all notes are plain
                });
                setNotes(updatedNotes);
                setLocalstorage(updatedNotes);
            }
        } catch (error) {
            console.error("Error toggling favourite:", error);
            setNotes(notes);
        }
    };

    const togglePinUnpin = async (id: string) => {
        const currentNote = notes.find((note) => note._id === id);
        if (!currentNote) return;

        const updatedNotes: INotes[] = notes.map((note) => {
            if (note._id === id) {
                return {
                    ...(note.toObject ? note.toObject() : note), // convert if it's a Mongoose document
                    pinned: !note.pinned,
                };
            }
            return note.toObject ? note.toObject() : note; // ensure all notes are plain
        });
        setNotes(updatedNotes);
        setLocalstorage(updatedNotes);

        try {
            const res = await fetch("/api/notes/pinning", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notesId: id }),
            });

            if (!res.ok) {
                const currentNote = notes.find((note) => note._id === id);
                if (!currentNote) return;

                const updatedNotes: INotes[] = notes.map((note) => {
                    if (note._id === id) {
                        return {
                            ...(note.toObject ? note.toObject() : note),
                            pinned: !note.pinned,
                        };
                    }
                    return note.toObject ? note.toObject() : note;
                });
                setNotes(updatedNotes);
                setLocalstorage(updatedNotes);
            }
        } catch (error) {
            console.error("Error toggling pinning:", error);
            setNotes(notes);
        }
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
        setDeleteLoader(id);
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
        setDeleteLoader(null);
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

    const truncateMessage = (message: string | undefined, charLimit: number) => {
        if (!message) return "No content available...";
        return message.length > charLimit
            ? `${message.slice(0, charLimit)}...`
            : message;
    };

    const getFilteredNotes = useMemo(() => {
        switch (state) {
            case "Favourite":
                return notes.filter(note => note.favourite);
            case "Pinned":
                return notes.filter(note => note.pinned);
            default:
                return notes;
        }
    },[state,notes]);
    useEffect(() => {
        fetchNotes();
    }, []);
    return (
        <div className="w-full relative flex flex-col items-center justify-center pt-10 pb-10 px-6 sm:px-12 md:px-28 ">
            <button
                title='add'
                type='button'
                onClick={() => setShowDialog(true)}
                className=" text-lg cursor-pointer flex items-start mb-4 absolute bottom-0 -right-8"
            >
                <FaPlusCircle className='size-16 text-purple-700'/>
            </button>

            <div className='flex gap-2'>
                <button onClick={() => setState("All")} className={`${state === "All" ? "bg-purple-700 text-white" : "bg-white text-purple-700"} p-2 rounded-lg`}> All </button>
                <button onClick={() => setState("Favourite")} className={`${state === "Favourite" ? "bg-purple-700 text-white" : "bg-white text-purple-700"} p-2 rounded-lg`}> Favourite </button>
                <button onClick={() => setState("Pinned")} className={`${state === "Pinned" ? "bg-purple-700 text-white" : "bg-white text-purple-700"} p-2 rounded-lg`}> Pinned</button>
            </div>

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg relative max-w-lg w-full">
                        <button
                            onClick={() => setShowDialog(false)}
                            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-6">
                            {isEditMode ? "Update Note" : "Add New Note"}
                        </h2>
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
                                className="bg-purple-700 text-white px-4 py-2 rounded-lg text-xl cursor-pointer"
                            >
                                {loading ? <span className="loader"></span> : isEditMode ? "Update" : "Add"}

                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full mt-7">
                {getFilteredNotes.map((note) => (
                    <div
                        key={note._id as string}
                        className="relative border rounded-lg p-4 bg-white shadow-md hover:shadow-lg"
                        onClick={() => {
                            setSelectedNote(note);
                            setShowMessage(true);
                        }}
                    >
                        <div className='flex items-start justify-between'>
                            <h3 className="text-xl font-bold mb-2 text-purple-700">{truncateMessage(note.title, 13) || "Untitled"}</h3>
                        </div>
                        <p className="text-gray-600 mb-11">
                            {truncateMessage(note.message, 31)}
                        </p>

                        <div className='w-11/12 absolute bottom-2 flex gap-2 items-center justify-between'>
                            <button
                                title='delete note'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNote(note._id as string);
                                }}
                            >
                                {deleteLoader === note._id ? <span className="deleteLoader"></span> :
                                    <FaTrash className='text-purple-700' />
                                }

                            </button>
                            <DateDifference createdAt={note?.createdAt}/>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center absolute right-2 top-3'>
                            <button
                                title='edit note'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNote(note);
                                    setTitle(note.title);
                                    setMessage(note.message);
                                    setIsEditMode(true);
                                    setShowDialog(true);
                                }}
                            >
                                <FaEdit className='size-5 text-purple-700' />
                            </button>
                            <button
                                title='favourite'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLikeUnlike(note._id as string);
                                }}
                            >
                                {note.favourite ? <FaHeart className='size-5 text-purple-700' /> : <FaRegHeart className='size-5 text-purple-700' />}
                            </button>
                            <button
                                title='pinning'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePinUnpin(note._id as string);
                                }}
                            >
                                {note.pinned ? <TbPinnedFilled className='size-7 text-purple-700' /> : <VscPinned className='size-7 text-purple-700' />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog Box for Full Note */}
            {showMessage && selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg relative max-w-lg w-1/2">
                        <button
                            onClick={() => setShowMessage(false)}
                            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                        <button
                            onClick={() => setShowMessage(false)}
                            className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-400 mb-4"
                        >
                            Back
                        </button>
                        <h2 className="text-3xl font-bold mb-6 text-purple-700">{selectedNote.title}</h2>
                        <p className="text-lg text-gray-700 w-full break-words">{selectedNote.message || "No content available..."}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes