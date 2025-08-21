import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    const { data: service, error } = await supabase.from("services").select("*").eq("id", params.id).single()

    if (error) {
      console.error("[v0] Database error in GET /api/services/[id]:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("[v0] Get service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "pickup_fee",
      "supports_pickup",
      "duration",
      "features",
      "is_active"
    ]

    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    filteredData.updated_at = new Date().toISOString()

    const supabase = createClient()

    const { data: service, error } = await supabase
      .from("services")
      .update(filteredData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error in PUT /api/services/[id]:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ service })
  } catch (error) {
    console.error("[v0] Update service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()

    // Check if service is being used in any bookings
    const { data: bookings, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("service_id", params.id)
      .limit(1)

    if (bookingError) {
      console.error("[v0] Error checking service usage:", bookingError)
      return NextResponse.json({ error: "Error checking service usage" }, { status: 500 })
    }

    if (bookings && bookings.length > 0) {
      return NextResponse.json({ error: "Cannot delete service that has existing bookings" }, { status: 400 })
    }

    const { error } = await supabase.from("services").delete().eq("id", params.id)

    if (error) {
      console.error("[v0] Database error in DELETE /api/services/[id]:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
