import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET - Fetch all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create OR Update (edit title)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✏ If ID exists → Update title
    if (body.id && body.title) {
      const updated = await prisma.todo.update({
        where: { id: body.id },
        data: { title: body.title },
      });

      return NextResponse.json(updated);
    }

    // ➕ Otherwise create new todo
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: { title: body.title },
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create/update todo" },
      { status: 500 }
    );
  }
}

// ✅ PUT - Toggle completed
export async function PUT(req: Request) {
  try {
    const { id, completed } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Remove todo
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}