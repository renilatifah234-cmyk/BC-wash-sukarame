import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)

    return NextResponse.json({ hash })
  } catch (error) {
    console.error("Password hash generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
