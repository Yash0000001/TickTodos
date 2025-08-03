import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { notes } from "@/models/notes.model";
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    try {
        // Parse the request body
        const { title, message, notesId } = await req.json();
        if (!notesId) {
            return NextResponse.json({ message: "Notes ID is required" }, { status: 400 });
        }
        if(!title || !message){
            return NextResponse.json({ message: "Notes title and message are required" }, { status: 400 });
        }
        // delete the notes document
        const updatedNote = await notes.findByIdAndUpdate(
            notesId,
            {
                title,
                message
            },
            { new: true },
        );

        if (!updatedNote) {
            return NextResponse.json({ message: "Note not found", updatedNote }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Note updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating Note:", error);
        return NextResponse.json({ message: "Unable to update Note" }, { status: 500 });
    }
}
