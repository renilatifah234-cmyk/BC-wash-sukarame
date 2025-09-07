import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    if (!password) {
      return NextResponse.json({ error: "Password query parameter is required" }, { status: 400 })
    }

    const hash = await hashPassword(password)
    return NextResponse.json({ hash })
  } catch (error) {
    console.error("Password hash generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const hash = await hashPassword(password)

    return NextResponse.json({ hash })
  } catch (error) {
    console.error("Password hash generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
