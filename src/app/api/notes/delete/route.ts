import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { notes } from "@/models/notes.model";
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Parse the request body
    const { notesId } = await req.json();
    if (!notesId) {
      return NextResponse.json({ message: "Notes ID is required" }, { status: 400 });
    }
    // delete the notes document
    const deletedTodo = await notes.findByIdAndDelete(
      notesId, // Find note by its id
    );

    if (!deletedTodo) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Note:", error);
    return NextResponse.json({ message: "Unable to delete Note" }, { status: 500 });
  }
}
