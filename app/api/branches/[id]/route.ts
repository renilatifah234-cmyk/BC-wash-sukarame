import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Update branch by id (partial update supported)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id
    const body = await request.json()

    const supabase = createClient()

    // Build update payload mapping UI fields -> DB columns
    const updatePayload: Record<string, any> = {}

    if (body.name !== undefined) updatePayload.name = body.name
    if (body.address !== undefined) updatePayload.address = body.address
    if (body.phone !== undefined) updatePayload.phone = body.phone
    if (body.manager !== undefined) updatePayload.manager = body.manager
    if (body.staffCount !== undefined) updatePayload.staff_count = body.staffCount

    if (body.bankAccount) {
      if (body.bankAccount.bank !== undefined) updatePayload.bank_name = body.bankAccount.bank
      if (body.bankAccount.accountNumber !== undefined)
        updatePayload.bank_account_number = body.bankAccount.accountNumber
      if (body.bankAccount.accountName !== undefined)
        updatePayload.bank_account_name = body.bankAccount.accountName
    }

    if (body.operatingHours) {
      if (body.operatingHours.open !== undefined) {
        updatePayload.operating_hours_open = new Date(`1970-01-01T${body.operatingHours.open}`).toLocaleTimeString(
          "en-US",
          { hour12: false, hour: "2-digit", minute: "2-digit" },
        )
      }
      if (body.operatingHours.close !== undefined) {
        updatePayload.operating_hours_close = new Date(`1970-01-01T${body.operatingHours.close}`).toLocaleTimeString(
          "en-US",
          { hour12: false, hour: "2-digit", minute: "2-digit" },
        )
      }
    }

    if (body.pickupCoverageRadius !== undefined)
      updatePayload.pickup_coverage_radius = body.pickupCoverageRadius

    if (body.status !== undefined) updatePayload.status = body.status

    if (body.latitude !== undefined) updatePayload.latitude = body.latitude
    if (body.longitude !== undefined) updatePayload.longitude = body.longitude

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("branches")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Not found" }, { status: 404 })
    }

    const branch = {
      ...data,
      operatingHours: {
        open: data.operating_hours_open,
        close: data.operating_hours_close,
      },
      bankAccount: {
        bank: data.bank_name,
        accountNumber: data.bank_account_number,
        accountName: data.bank_account_name,
      },
      latitude: data.latitude,
      longitude: data.longitude,
    }

    return NextResponse.json({ branch })
  } catch (error) {
    console.error("Update branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
