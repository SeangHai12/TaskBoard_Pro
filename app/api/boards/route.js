import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthedUserIdFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const userId = getAuthedUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const boards = await query(
      "SELECT id, title, description, created_at FROM boards WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return NextResponse.json({ boards });
  } catch (error) {
    console.error("GET /api/boards error:", error);
    return NextResponse.json({ message: "Failed to load boards." }, { status: 500 });
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

    const title = (b?.title || "").trim();
    const description = (b?.description || "").trim();

    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO boards (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description || null]
    );

    return NextResponse.json({ id: result.insertId, title, description }, { status: 201 });
  } catch (error) {
    console.error("POST /api/boards error:", error);
    return NextResponse.json({ message: "Failed to create board." }, { status: 500 });
  }
}
