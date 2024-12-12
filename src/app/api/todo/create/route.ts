import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { todo } from '@/models/todo.model';
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

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Create the Todo item
    const newTodo = await todo.create({ title });

    // Find the user by userId or create a new user if not found
    const existingUser = await user.findOneAndUpdate(
      { userId }, 
      { $push: { todo: newTodo._id },$setOnInsert: { userId } }, 
      { new: true,upsert:true } 
    ).populate("todo");

    return NextResponse.json(
      { message: "Todo created successfully", data: newTodo, user: existingUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ message: "Unable to create a todo" }, { status: 500 });
  }
}
