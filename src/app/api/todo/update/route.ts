import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { todo } from "@/models/todo.model";
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Parse the request body
    const { todoId, status } = await req.json();

    if (!todoId ) {
      return NextResponse.json({ message: "Todo ID are required" }, { status: 400 });
    }

    // Update the todo document
    const updatedTodo = await todo.findByIdAndUpdate(
      todoId, // Find todo by its ID
      { completed:status }, // Update the title field
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo updated successfully", data: updatedTodo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ message: "Unable to update todo" }, { status: 500 });
  }
}
