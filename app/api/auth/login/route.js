import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const b = body || {};

    const username = (b?.username || "").trim();
    const password = (b?.password || "").trim();

    if (!username) {
      return NextResponse.json({ message: "Username is required." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ message: "Password is required." }, { status: 400 });
    }

    const passwordHash = createHash("sha256").update(password).digest("hex");
    const users = await query(
      "SELECT id, username FROM users WHERE username = ? AND password_hash = ? LIMIT 1",
      [username, passwordHash]
    );
    const user = users[0];
    if (!user) {
      return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, username: user.username });
    res.cookies.set("tbp_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookies.set("tbp_uid", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}

