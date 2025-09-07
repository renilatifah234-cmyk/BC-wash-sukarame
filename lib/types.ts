// Struktur data booking tunggal sesuai respons API
export interface Booking {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_id: string;
  branch_id: string;
  booking_date: string;
  booking_time: string;
  total_price: number;
  status: "confirmed" | "picked-up" | "in-progress" | "completed" | "cancelled" | "pending"; // tambah status "pending"
  payment_proof: string | null;
  is_pickup_service: boolean;
  pickup_address: string | null;
  pickup_notes: string | null;
  vehicle_plate_number: string;
  loyalty_points_earned: number;
  loyalty_points_used: number;
  booking_source: string;
  created_by_admin: boolean;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services: {
    name: string;
    price: number;
    category: string;
    duration: number;
    pickup_fee: number;
  };
  branches: {
    name: string;
    phone: string;
    address: string;
  };
}

// Struktur untuk respons API
export interface BookingApiResponse {
  bookings: Booking[];
  total?: number;
}

// Struktur data statistik booking
export interface BookingStatsData {
  totalBookings: number;
  totalRevenue: number;
  confirmedBookings: number;
  inProgressBookings: number;
}
