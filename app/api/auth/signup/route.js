import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = (body?.username || "").trim();
    const password = (body?.password || "").trim();

    if (!username) {
      return NextResponse.json({ message: "Username is required." }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json(
        { message: "Password must be at least 4 characters." },
        { status: 400 }
      );
    }

    const existing = await query("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);

    if (existing.length) {
      return NextResponse.json({ message: "Username already exists." }, { status: 409 });
    }

    const passwordHash = createHash("sha256").update(password).digest("hex");
    const result = await query("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
      username,
      passwordHash,
    ]);

    const res = NextResponse.json({ success: true, username }, { status: 201 });
    res.cookies.set("tbp_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookies.set("tbp_uid", String(result.insertId), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json({ message: "Signup failed." }, { status: 500 });
  }
}
