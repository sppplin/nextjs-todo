import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { title } = await req.json();

  const todo = await prisma.todo.create({
    data: { title },
  });

  return NextResponse.json(todo);
}

export async function PUT(req: Request) {
  const { id, completed } = await req.json();

  const todo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json(todo);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}