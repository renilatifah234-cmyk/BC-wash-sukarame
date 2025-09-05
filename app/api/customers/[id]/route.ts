import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { data: customer, error } = await supabase.from("customers").select("*").eq("id", params.id).single()
    if (error) {
      console.error("[v0] Database error in GET /api/customers/[id]:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }
    return NextResponse.json({ customer })
  } catch (error) {
    console.error("[v0] Get customer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const allowedFields = [
      "name",
      "phone",
      "email",
      "vehicle_plate_numbers",
      "total_bookings",
      "total_loyalty_points",
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
    const { data: customer, error } = await supabase
      .from("customers")
      .update(filteredData)
      .eq("id", params.id)
      .select()
      .single()
    if (error) {
      console.error("[v0] Database error in PUT /api/customers/[id]:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }
    return NextResponse.json({ customer })
  } catch (error) {
    console.error("[v0] Update customer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
