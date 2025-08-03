import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { notes } from '@/models/notes.model';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { notesId } = await req.json();

    if (!notesId) {
      return NextResponse.json({ message: 'Notes ID is required' }, { status: 400 });
    }

    // Fetch the existing note first
    const existingNote = await notes.findById(notesId);

    if (!existingNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    // Toggle pinned value
    const newPinnedValue = !existingNote.pinned;

    const updatedNote = await notes.findByIdAndUpdate(
      notesId,
      { pinned: newPinnedValue },
      { new: true }
    );

    return NextResponse.json(
      { message: `Note ${newPinnedValue ? 'pinned' : 'unpinned'} successfully`, updatedNote },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error pinning/unpinning Note:', error);
    return NextResponse.json({ message: 'Unable to pin/unpin note' }, { status: 500 });
  }
}
