import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthedUserIdFromRequest } from "@/lib/auth";

function isStatus(value) {
  return value === "todo" || value === "progress" || value === "done";
}

export async function GET(request) {
  try {
    const userId = getAuthedUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const q = (searchParams.get("q") || "").trim();
    const statusRaw = (searchParams.get("status") || "").trim();

    if (!boardId) {
      return NextResponse.json({ message: "boardId is required." }, { status: 400 });
    }

    let sql =
      "SELECT t.id, t.board_id, t.title, t.description, t.status, t.created_at FROM tasks t INNER JOIN boards b ON b.id = t.board_id WHERE t.board_id = ? AND b.user_id = ?";
    const params = [boardId, userId];

    if (statusRaw && isStatus(statusRaw)) {
      sql += " AND status = ?";
      params.push(statusRaw);
    }

    if (q) {
      sql += " AND title LIKE ?";
      params.push(`%${q}%`);
    }

    sql += " ORDER BY created_at DESC";

    const tasks = await query(sql, params);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ message: "Failed to load tasks." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = getAuthedUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const b = body || {};

    const boardId = Number(b?.boardId);
    const title = (b?.title || "").trim();
    const description = (b?.description || "").trim();
    const statusRaw = (b?.status || "todo").trim();

    if (!boardId || Number.isNaN(boardId)) {
      return NextResponse.json({ message: "boardId is required." }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const safeStatus = isStatus(statusRaw) ? statusRaw : "todo";

    const boardRows = await query("SELECT id FROM boards WHERE id = ? AND user_id = ? LIMIT 1", [
      boardId,
      userId,
    ]);
    if (!boardRows.length) {
      return NextResponse.json({ message: "Board not found." }, { status: 404 });
    }

    const result = await query(
      "INSERT INTO tasks (user_id, board_id, title, description, status) VALUES (?, ?, ?, ?, ?)",
      [userId, boardId, title, description || null, safeStatus]
    );

    return NextResponse.json(
      { id: result.insertId, board_id: boardId, title, description, status: safeStatus },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ message: "Failed to create task." }, { status: 500 });
  }
}
