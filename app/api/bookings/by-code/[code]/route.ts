import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const supabase = createClient()

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services (name, category, price, duration, pickup_fee, features),
        branches (name, address, phone, pickup_coverage_radius)
      `)
      .eq("booking_code", params.code)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("[v0] Get booking by code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

