import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { notes } from '@/models/notes.model';
import { user } from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  console.log(userId)
  await dbConnect();

  try {
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const { title, message } = await req.json();
    if (!title && !message) {
      return NextResponse.json({ message: "Title and Message is required" }, { status: 400 });
    }

    // Create the Notes item
    const newNotes = await notes.create({ title, message });
    newNotes.save();

    // Find the user by userId or create a new user if not found
    const existingUser = await user.findOneAndUpdate(
      { userId },
      {
        $push: { notes: newNotes._id },
        $setOnInsert: { userId },
      },
      { new: true, upsert: true }
    ).populate("notes");


    return NextResponse.json(
      { message: "Todo created successfully", data: newNotes, user: existingUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notes:", error);
    return NextResponse.json({ message: "Unable to create a note" }, { status: 500 });
  }
}
