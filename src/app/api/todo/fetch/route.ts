import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { user } from '@/models/user.model';
import { todo } from '@/models/todo.model';


export async function GET() {


    await dbConnect();

    try {
        const todos = await todo.find();
        if (!todos ) {
            return NextResponse.json({ message: "Error Fetching Todos" }, { status: 500 })
        }
        const { userId } = await auth();
        if (!userId) return new Response('Unauthorized', { status: 401 });
        const User = await user.findOne({ userId }).populate('todo');
        if (!User) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(User, { status: 200 });
    } catch (error) {
        console.error("Error fetching user : ", error);
        return NextResponse.json({ message: "Error Fetching Todos and Notes" }, { status: 500 });
    }
}