import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface CreateServiceInput {
  name: string
  description: string
  category: string
  price: number
  pickup_fee: number
  supports_pickup: boolean
  duration: number
  features: string[]
  loyalty_points_reward?: number
}

function validateServiceInput(data: any): CreateServiceInput {
  const errors: string[] = []

  if (!data.name?.trim()) errors.push("name is required")
  if (!data.description?.trim()) errors.push("description is required")
  if (!data.category?.trim()) errors.push("category is required")
  if (typeof data.price !== "number" || data.price <= 0) errors.push("price must be a positive number")
  if (typeof data.pickup_fee !== "number" || data.pickup_fee < 0)
    errors.push("pickup_fee must be a non-negative number")
  if (typeof data.supports_pickup !== "boolean") errors.push("supports_pickup must be a boolean")
  if (typeof data.duration !== "number" || data.duration <= 0) errors.push("duration must be a positive number")
  if (!Array.isArray(data.features)) errors.push("features must be an array")
  if (
    typeof data.loyalty_points_reward !== "undefined" &&
    (typeof data.loyalty_points_reward !== "number" || data.loyalty_points_reward < 0)
  ) {
    errors.push("loyalty_points_reward must be a non-negative number")
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`)
  }

  return data as CreateServiceInput
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .order("price", { ascending: true })

    if (error) {
      console.error("[v0] Database error in GET /api/services:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ services: services || [] })
  } catch (error) {
    console.error("[v0] Get services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json()
    const serviceData = validateServiceInput(rawData)

    const supabase = createClient()
    const now = new Date()

    const insertData = {
      ...serviceData,
      id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      loyalty_points_reward: serviceData.loyalty_points_reward ?? 0,
    }

    const { data: service, error } = await supabase.from("services").insert(insertData).select().single()

    if (error) {
      console.error("[v0] Database error in POST /api/services:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create service error:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
