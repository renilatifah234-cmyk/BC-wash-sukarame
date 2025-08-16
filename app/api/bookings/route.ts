import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const limit = searchParams.get("limit")

    const supabase = createClient()
    let query = supabase
      .from("bookings")
      .select(`
        *,
        services (name, category, price),
        branches (name, address)
      `)
      .order("created_at", { ascending: false })

    if (branchId) {
      query = query.eq("branch_id", branchId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (date) {
      query = query.eq("booking_date", date)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: bookings, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    const supabase = createClient()

    // Generate booking code
    const bookingCode = `BCW${Date.now().toString().slice(-6)}`

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        ...bookingData,
        id: `booking-${Date.now()}`,
        booking_code: bookingCode,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
