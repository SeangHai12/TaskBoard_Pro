import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthedUserIdFromRequest } from "@/lib/auth";
export async function GET(_request, context) {
  try {
    const userId = getAuthedUserIdFromRequest(_request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const rows = await query(
      "SELECT id, title, description, created_at FROM boards WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Board not found." }, { status: 404 });
    }

    return NextResponse.json({ board: rows[0] });
  } catch (error) {
    console.error("GET /api/boards/[id] error:", error);
    return NextResponse.json({ message: "Failed to load board." }, { status: 500 });
  }
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

    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const result = await query(
      "UPDATE boards SET title = ?, description = ? WHERE id = ? AND user_id = ?",
      [title, description || null, id, userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Board not found." }, { status: 404 });
    }

    return NextResponse.json({ id: Number(id), title, description });
  } catch (error) {
    console.error("PUT /api/boards/[id] error:", error);
    return NextResponse.json({ message: "Failed to update board." }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    const userId = getAuthedUserIdFromRequest(_request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const result = await query("DELETE FROM boards WHERE id = ? AND user_id = ?", [id, userId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Board not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/boards/[id] error:", error);
    return NextResponse.json({ message: "Failed to delete board." }, { status: 500 });
  }
}
