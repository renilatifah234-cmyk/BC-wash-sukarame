import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking } from "@/lib/types"; // Assuming Booking type is defined in lib/types
import { formatCurrency } from "@/lib/utils"; // Assuming formatCurrency utility exists

interface BookingStatsProps {
  bookings: Booking[];
}

export function BookingStats({ bookings }: BookingStatsProps) {
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_price, 0);
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;
  const inProgressBookings = bookings.filter(
    (booking) => booking.status === "in-progress"
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-14a2 2 0 0 0-2-2h-2" />
            <path d="M8 3V1h8v2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            +10% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v10" />
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10Z" />
            <path d="M12 6v6l4 3" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">
            +5% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-4a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v4" />
            <circle cx="8" cy="7" r="5" />
            <path d="M20 8v2a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V8" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{confirmedBookings}</div>
          <p className="text-xs text-muted-foreground">
            +20% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 6.5v11" />
            <path d="M17.5 13.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
            <path d="M22 10v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z" />
            <path d="M4 10v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {inProgressBookings}
          </div>
          <p className="text-xs text-muted-foreground">
            +{inProgressBookings / totalBookings * 100}% of total bookings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
