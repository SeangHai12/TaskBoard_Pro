import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthedUserIdFromRequest } from "@/lib/auth";

function isStatus(value) {
  return value === "todo" || value === "progress" || value === "done";
}

export async function PUT(request, context) {
  try {
    const userId = getAuthedUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const body = await request.json();
    const b = body || {};

    const title = (b?.title || "").trim();
    const description = (b?.description || "").trim();
    const statusRaw = (b?.status || "todo").trim();

    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const safeStatus = isStatus(statusRaw) ? statusRaw : "todo";

    const result = await query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description || null, safeStatus, id, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ id: Number(id), title, description, status: safeStatus });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json({ message: "Failed to update task." }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    const userId = getAuthedUserIdFromRequest(_request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const result = await query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, userId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ message: "Failed to delete task." }, { status: 500 });
  }
}
