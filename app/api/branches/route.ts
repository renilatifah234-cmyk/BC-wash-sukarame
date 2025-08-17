import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data: branchesData, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const branches = branchesData.map((branch) => ({
      ...branch,
      operatingHours: {
        open: branch.operating_hours_open ? new Date(`1970-01-01T${branch.operating_hours_open}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : "08:00",
        close: branch.operating_hours_close ? new Date(`1970-01-01T${branch.operating_hours_close}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : "18:00",
      },
      bankAccount: {
        bank: branch.bank_name,
        accountNumber: branch.bank_account_number,
        accountName: branch.bank_account_name,
      },
    }))

    return NextResponse.json({ branches })
  } catch (error) {
    console.error("Get branches error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      address,
      phone,
      manager,
      staffCount,
      bankAccount,
      operatingHours,
      pickupCoverageRadius,
    } = await request.json()

    const supabase = createClient()

    const { data: newBranch, error } = await supabase
      .from("branches")
      .insert({
        id: `branch-${Date.now()}`,
        name,
        address,
        phone,
        manager,
        staff_count: staffCount,
        bank_name: bankAccount.bank,
        bank_account_number: bankAccount.accountNumber,
        bank_account_name: bankAccount.accountName,
        operating_hours_open: new Date(`1970-01-01T${operatingHours.open}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        operating_hours_close: new Date(`1970-01-01T${operatingHours.close}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        pickup_coverage_radius: pickupCoverageRadius,
      })
      .select()
      .single()

    if (error) {
      console.error("Create branch error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const branch = {
      ...newBranch,
      operatingHours: {
        open: newBranch.operating_hours_open,
        close: newBranch.operating_hours_close,
      },
      bankAccount: {
        bank: newBranch.bank_name,
        accountNumber: newBranch.bank_account_number,
        accountName: newBranch.bank_account_name,
      },
    }

    return NextResponse.json({ branch }, { status: 201 })
  } catch (error) {
    console.error("Create branch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
