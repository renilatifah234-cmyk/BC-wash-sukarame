import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: branches, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ branches })
  } catch (error) {
    console.error("Get branches error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const branchData = await request.json()

    const supabase = createClient()

    const { data: branch, error } = await supabase
      .from("branches")
      .insert({
        ...branchData,
        id: `branch-${Date.now()}`,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ branch }, { status: 201 })
  } catch (error) {
    console.error("Create branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
