import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const branchId = searchParams.get("branchId")

    const supabase = createClient()

    // Base query for bookings with joins
    let query = supabase
      .from("bookings")
      .select(`
        *,
        services (name, category, price),
        branches (name)
      `)
      .eq("status", "completed")

    if (startDate && endDate) {
      query = query.gte("booking_date", startDate).lte("booking_date", endDate)
    }

    if (branchId) {
      query = query.eq("branch_id", branchId)
    }

    const { data: bookings, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate report metrics
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_price, 0)
    const totalBookings = bookings.length

    const serviceStats = bookings.reduce(
      (acc, booking) => {
        const serviceId = booking.service_id
        if (!acc[serviceId]) {
          acc[serviceId] = {
            name: booking.services.name,
            count: 0,
            revenue: 0,
          }
        }
        acc[serviceId].count++
        acc[serviceId].revenue += booking.total_price
        return acc
      },
      {} as Record<string, { name: string; count: number; revenue: number }>,
    )

    const branchStats = bookings.reduce(
      (acc, booking) => {
        const branchId = booking.branch_id
        if (!acc[branchId]) {
          acc[branchId] = {
            name: booking.branches.name,
            count: 0,
            revenue: 0,
          }
        }
        acc[branchId].count++
        acc[branchId].revenue += booking.total_price
        return acc
      },
      {} as Record<string, { name: string; count: number; revenue: number }>,
    )

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalBookings,
        averageBookingValue: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
      },
      serviceStats: Object.values(serviceStats),
      branchStats: Object.values(branchStats),
      bookings,
    })
  } catch (error) {
    console.error("Get reports error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
