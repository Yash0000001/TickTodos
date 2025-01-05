import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { todo } from "@/models/todo.model";
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Parse the request body
    const { todoId } = await req.json();

    if (!todoId) {
      return NextResponse.json({ message: "Todo ID is required" }, { status: 400 });
    }

    // delete the todo document
    const deletedTodo = await todo.findByIdAndDelete(
      todoId, // Find todo by its id
    );

    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ message: "Unable to delete todo" }, { status: 500 });
  }
}