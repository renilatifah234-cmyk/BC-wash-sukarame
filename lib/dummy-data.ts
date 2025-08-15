export interface Service {
  id: string
  name: string
  category: "car-regular" | "car-premium" | "motorcycle"
  price: number
  description: string
  duration: number // in minutes
  features?: string[]
  supportsPickup?: boolean
  pickupFee?: number
}

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  bankAccount: {
    bank: string
    accountNumber: string
    accountName: string
  }
  operatingHours: {
    open: string
    close: string
  }
  pickupCoverageRadius?: number // in km
  status: "active" | "inactive" // New field for branch management
  manager?: string // Branch manager name
  staffCount?: number // Number of staff members
  createdAt: string // When branch was added
  updatedAt: string // Last update timestamp
}

export interface Booking {
  id: string
  bookingCode: string
  customerName: string
  customerPhone: string
  customerEmail: string
  serviceId: string
  branchId: string
  date: string
  time: string
  totalPrice: number
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  paymentProof?: string
  createdAt: string
  updatedAt: string
  isPickupService?: boolean
  pickupAddress?: string
  pickupNotes?: string
  vehiclePlateNumber?: string
  loyaltyPointsEarned?: number
  loyaltyPointsUsed?: number
  bookingSource: "online" | "offline" // Track booking origin
  createdByAdmin?: boolean // Flag for admin-created bookings
  adminUserId?: string // Admin who created the booking
  paymentMethod?: "cash" | "transfer" | "qris" | "card" // Payment method for offline bookings
  notes?: string // Additional notes for the booking
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  vehiclePlateNumbers: string[]
  totalLoyaltyPoints: number
  totalBookings: number
  joinDate: string
}

export interface Admin {
  id: string
  username: string
  name: string
  email: string
  role: "super-admin" | "branch-admin" | "staff"
  branchId?: string // For branch-specific admins
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface ReceiptData {
  bookingCode: string
  customerName: string
  customerPhone: string
  service: string
  branch: string
  branchAddress: string
  date: string
  time: string
  amount: number
  paymentMethod: string
  completedAt: string
  staff: string
}

export const services: Service[] = [
  // Car Regular Services
  {
    id: "car-small-regular",
    name: "Cuci Mobil Kecil Non-Hidrolik",
    category: "car-regular",
    price: 35000,
    description: "Cuci mobil kecil dengan metode manual tanpa hidrolik",
    duration: 45,
    supportsPickup: true,
    pickupFee: 15000,
  },
  {
    id: "car-large-regular",
    name: "Cuci Mobil Sedang/Besar Non-Hidrolik",
    category: "car-regular",
    price: 40000,
    description: "Cuci mobil sedang hingga besar dengan metode manual tanpa hidrolik",
    duration: 60,
    supportsPickup: true,
    pickupFee: 20000,
  },
  {
    id: "car-steam-quick",
    name: "Cuci Steam Cepat",
    category: "car-regular",
    price: 30000,
    description: "Cuci cepat menggunakan steam untuk hasil yang bersih",
    duration: 30,
    supportsPickup: true,
    pickupFee: 15000,
  },
  // Car Premium Services
  {
    id: "car-small-premium",
    name: "Cuci Mobil Kecil Hidrolik",
    category: "car-premium",
    price: 45000,
    description: "Cuci mobil kecil dengan sistem hidrolik profesional",
    duration: 60,
    features: ["Gratis 1 Minuman"],
    supportsPickup: true,
    pickupFee: 20000,
  },
  {
    id: "car-large-premium",
    name: "Cuci Mobil Sedang/Besar Hidrolik",
    category: "car-premium",
    price: 50000,
    description: "Cuci mobil sedang hingga besar dengan sistem hidrolik profesional",
    duration: 75,
    features: ["Gratis 1 Minuman"],
    supportsPickup: true,
    pickupFee: 25000,
  },
  {
    id: "anti-bacterial",
    name: "Fogging Anti Bakteri",
    category: "car-premium",
    price: 75000,
    description: "Layanan fogging untuk membunuh bakteri dan virus di dalam mobil",
    duration: 30,
    supportsPickup: true,
    pickupFee: 30000,
  },
  {
    id: "glass-spot-removal",
    name: "Penghilang Noda Kaca",
    category: "car-premium",
    price: 75000,
    description: "Penghilangan noda membandel pada kaca mobil",
    duration: 45,
    supportsPickup: true,
    pickupFee: 25000,
  },
  // Motorcycle Services
  {
    id: "motorcycle-small",
    name: "Cuci Motor Kecil Steam",
    category: "motorcycle",
    price: 13000,
    description: "Cuci motor kecil menggunakan steam",
    duration: 20,
    supportsPickup: true,
    pickupFee: 10000,
  },
  {
    id: "motorcycle-medium",
    name: "Cuci Motor Sedang Steam",
    category: "motorcycle",
    price: 15000,
    description: "Cuci motor sedang menggunakan steam",
    duration: 25,
    supportsPickup: true,
    pickupFee: 10000,
  },
  {
    id: "motorcycle-large",
    name: "Cuci Motor Besar Steam",
    category: "motorcycle",
    price: 18000,
    description: "Cuci motor besar menggunakan steam",
    duration: 30,
    supportsPickup: true,
    pickupFee: 12000,
  },
]

export const branches: Branch[] = [
  {
    id: "sukarame-main",
    name: "BC Wash Sukarame Utama",
    address: "Jl. Jend. Sudirman No. 1, Kranji, Bekasi Barat",
    phone: "021-123456",
    bankAccount: {
      bank: "BCA",
      accountNumber: "4061524783",
      accountName: "Muhamad Akbar Afriansyah",
    },
    operatingHours: {
      open: "08:00",
      close: "18:00",
    },
    pickupCoverageRadius: 10,
    status: "active",
    manager: "Muhamad Akbar Afriansyah",
    staffCount: 8,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2024-01-10T10:30:00Z",
  },
  {
    id: "sukarame-branch2",
    name: "BC Wash Sukarame Cabang 2",
    address: "Jl. Pulo Ribung Raya No. 100, Pekayon Jaya, Bekasi Selatan",
    phone: "021-654321",
    bankAccount: {
      bank: "BRI",
      accountNumber: "084101037308530",
      accountName: "Muhamad Akbar Afriansyah",
    },
    operatingHours: {
      open: "08:00",
      close: "18:00",
    },
    pickupCoverageRadius: 8,
    status: "active",
    manager: "Muhamad Akbar Afriansyah",
    staffCount: 6,
    createdAt: "2023-06-20T09:00:00Z",
    updatedAt: "2024-01-08T14:15:00Z",
  },
  {
    id: "sukarame-branch3",
    name: "BC Wash Sukarame Cabang 3",
    address: "Jl. Cut Mutia No. 50, Margahayu, Bekasi Timur",
    phone: "021-111222",
    bankAccount: {
      bank: "BRI",
      accountNumber: "1122334455",
      accountName: "BC Wash Sukarame Cab 3",
    },
    operatingHours: {
      open: "08:00",
      close: "18:00",
    },
    pickupCoverageRadius: 12,
    status: "inactive",
    manager: "Akbar",
    staffCount: 4,
    createdAt: "2023-11-01T10:00:00Z",
    updatedAt: "2024-01-05T16:20:00Z",
  },
]

export const sampleCustomers: Customer[] = [
  {
    id: "customer-001",
    name: "Ahmad Rizki",
    phone: "08123456789",
    email: "ahmad.rizki@email.com",
    vehiclePlateNumbers: ["B 1234 ABC", "B 5678 DEF"],
    totalLoyaltyPoints: 150,
    totalBookings: 8,
    joinDate: "2023-06-15",
  },
  {
    id: "customer-002",
    name: "Sari Dewi",
    phone: "08987654321",
    email: "sari.dewi@email.com",
    vehiclePlateNumbers: ["BE 9876 XYZ"],
    totalLoyaltyPoints: 75,
    totalBookings: 4,
    joinDate: "2023-08-20",
  },
  {
    id: "customer-003",
    name: "Joko Susilo",
    phone: "08111222333",
    email: "joko.susilo@email.com",
    vehiclePlateNumbers: ["BE 5555 GHI", "B 7777 JKL"],
    totalLoyaltyPoints: 320,
    totalBookings: 15,
    joinDate: "2023-03-10",
  },
  {
    id: "customer-004",
    name: "Maya Putri",
    phone: "08444555666",
    email: "maya.putri@email.com",
    vehiclePlateNumbers: ["BE 1111 MNO"],
    totalLoyaltyPoints: 45,
    totalBookings: 2,
    joinDate: "2023-12-05",
  },
  {
    id: "customer-005",
    name: "Andi Wijaya",
    phone: "08777888999",
    email: "andi.wijaya@email.com",
    vehiclePlateNumbers: ["B 3333 PQR"],
    totalLoyaltyPoints: 180,
    totalBookings: 9,
    joinDate: "2023-07-22",
  },
  {
    id: "customer-006",
    name: "Rina Sari",
    phone: "08222333444",
    email: "rina.sari@email.com",
    vehiclePlateNumbers: ["BE 8888 STU"],
    totalLoyaltyPoints: 95,
    totalBookings: 5,
    joinDate: "2023-09-18",
  },
]

export const sampleBookings: Booking[] = [
  {
    id: "booking-001",
    bookingCode: "BCW001",
    customerName: "Ahmad Rizki",
    customerPhone: "08123456789",
    customerEmail: "ahmad.rizki@email.com",
    serviceId: "car-small-premium",
    branchId: "sukarame-main",
    date: "2024-01-15",
    time: "10:00",
    totalPrice: 45000,
    status: "confirmed",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
    isPickupService: false,
    vehiclePlateNumber: "B 1234 ABC",
    loyaltyPointsEarned: 45,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
  },
  {
    id: "booking-002",
    bookingCode: "BCW002",
    customerName: "Sari Dewi",
    customerPhone: "08987654321",
    customerEmail: "sari.dewi@email.com",
    serviceId: "motorcycle-medium",
    branchId: "sukarame-branch2",
    date: "2024-01-15",
    time: "14:00",
    totalPrice: 25000,
    status: "pending",
    createdAt: "2024-01-14T14:00:00Z",
    updatedAt: "2024-01-14T14:00:00Z",
    isPickupService: true,
    pickupAddress: "Jl. Raden Intan No. 789, Bandar Lampung",
    pickupNotes: "Rumah cat hijau, pagar putih",
    vehiclePlateNumber: "BE 9876 XYZ",
    loyaltyPointsEarned: 25,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
  },
  {
    id: "booking-003",
    bookingCode: "BCW003",
    customerName: "Joko Susilo",
    customerPhone: "08111222333",
    customerEmail: "joko.susilo@email.com",
    serviceId: "car-large-regular",
    branchId: "sukarame-main",
    date: "2024-01-16",
    time: "09:00",
    totalPrice: 40000,
    status: "completed",
    createdAt: "2024-01-16T08:30:00Z",
    updatedAt: "2024-01-16T10:15:00Z",
    isPickupService: false,
    vehiclePlateNumber: "BE 5555 GHI",
    loyaltyPointsEarned: 40,
    bookingSource: "offline",
    createdByAdmin: true,
    adminUserId: "admin-001",
    paymentMethod: "cash",
    notes: "Walk-in customer, paid cash",
  },
  {
    id: "booking-004",
    bookingCode: "BCW004",
    customerName: "Maya Putri",
    customerPhone: "08444555666",
    customerEmail: "maya.putri@email.com",
    serviceId: "anti-bacterial",
    branchId: "sukarame-main",
    date: "2024-01-16",
    time: "11:30",
    totalPrice: 75000,
    status: "in-progress",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
    isPickupService: false,
    vehiclePlateNumber: "BE 1111 MNO",
    loyaltyPointsEarned: 75,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "qris",
  },
  {
    id: "booking-005",
    bookingCode: "BCW005",
    customerName: "Andi Wijaya",
    customerPhone: "08777888999",
    customerEmail: "andi.wijaya@email.com",
    serviceId: "motorcycle-small",
    branchId: "sukarame-branch2",
    date: "2024-01-16",
    time: "15:00",
    totalPrice: 23000,
    status: "cancelled",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-16T08:00:00Z",
    isPickupService: true,
    pickupAddress: "Jl. Ahmad Yani No. 456, Bandar Lampung",
    pickupNotes: "Komplek perumahan, blok C no. 12",
    vehiclePlateNumber: "B 3333 PQR",
    loyaltyPointsEarned: 0,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
    notes: "Customer cancelled due to rain",
  },
  {
    id: "booking-006",
    bookingCode: "BCW006",
    customerName: "Rina Sari",
    customerPhone: "08222333444",
    customerEmail: "rina.sari@email.com",
    serviceId: "car-large-premium",
    branchId: "sukarame-branch2",
    date: "2024-01-17",
    time: "08:30",
    totalPrice: 50000,
    status: "confirmed",
    createdAt: "2024-01-16T15:30:00Z",
    updatedAt: "2024-01-16T16:00:00Z",
    isPickupService: false,
    vehiclePlateNumber: "BE 8888 STU",
    loyaltyPointsEarned: 50,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
  },
  {
    id: "booking-007",
    bookingCode: "BCW007",
    customerName: "Budi Hartono",
    customerPhone: "08555666777",
    customerEmail: "budi.hartono@email.com",
    serviceId: "glass-spot-removal",
    branchId: "sukarame-main",
    date: "2024-01-17",
    time: "10:00",
    totalPrice: 75000,
    status: "confirmed",
    createdAt: "2024-01-17T07:00:00Z",
    updatedAt: "2024-01-17T07:15:00Z",
    isPickupService: false,
    vehiclePlateNumber: "B 9999 VWX",
    loyaltyPointsEarned: 75,
    bookingSource: "offline",
    createdByAdmin: true,
    adminUserId: "admin-002",
    paymentMethod: "cash",
    notes: "Regular customer, requested specific staff member",
  },
  {
    id: "booking-008",
    bookingCode: "BCW008",
    customerName: "Siti Nurhaliza",
    customerPhone: "08333444555",
    customerEmail: "siti.nurhaliza@email.com",
    serviceId: "car-steam-quick",
    branchId: "sukarame-branch2",
    date: "2024-01-17",
    time: "13:00",
    totalPrice: 45000,
    status: "pending",
    createdAt: "2024-01-17T08:30:00Z",
    updatedAt: "2024-01-17T08:30:00Z",
    isPickupService: true,
    pickupAddress: "Jl. Diponegoro No. 123, Bandar Lampung",
    pickupNotes: "Kantor, gedung biru lantai 2",
    vehiclePlateNumber: "BE 4444 YZA",
    loyaltyPointsEarned: 45,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
  },
  {
    id: "booking-009",
    bookingCode: "BCW009",
    customerName: "Dedi Setiawan",
    customerPhone: "08666777888",
    customerEmail: "dedi.setiawan@email.com",
    serviceId: "motorcycle-large",
    branchId: "sukarame-main",
    date: "2024-01-17",
    time: "16:30",
    totalPrice: 30000,
    status: "completed",
    createdAt: "2024-01-17T14:00:00Z",
    updatedAt: "2024-01-17T17:00:00Z",
    isPickupService: true,
    pickupAddress: "Jl. Gatot Subroto No. 789, Bandar Lampung",
    pickupNotes: "Rumah sudut, cat kuning",
    vehiclePlateNumber: "BE 6666 BCD",
    loyaltyPointsEarned: 30,
    bookingSource: "offline",
    createdByAdmin: true,
    adminUserId: "admin-002",
    paymentMethod: "card",
    notes: "Customer paid with debit card, service completed on time",
  },
  {
    id: "booking-010",
    bookingCode: "BCW010",
    customerName: "Lina Marlina",
    customerPhone: "08999000111",
    customerEmail: "lina.marlina@email.com",
    serviceId: "car-small-regular",
    branchId: "sukarame-branch2",
    date: "2024-01-18",
    time: "09:30",
    totalPrice: 35000,
    status: "confirmed",
    createdAt: "2024-01-17T18:00:00Z",
    updatedAt: "2024-01-17T18:15:00Z",
    isPickupService: false,
    vehiclePlateNumber: "B 2222 EFG",
    loyaltyPointsEarned: 35,
    bookingSource: "online",
    createdByAdmin: false,
    paymentMethod: "transfer",
  },
]

export const sampleAdmins: Admin[] = [
  {
    id: "admin-001",
    username: "superadmin",
    name: "Admin Utama",
    email: "admin@bcwash.com",
    role: "super-admin",
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: "2024-01-17T08:00:00Z",
    isActive: true,
  },
  {
    id: "admin-002",
    username: "branch1admin",
    name: "Budi Santoso",
    email: "budi@bcwash.com",
    role: "branch-admin",
    branchId: "sukarame-main",
    createdAt: "2023-01-15T08:00:00Z",
    lastLogin: "2024-01-17T07:30:00Z",
    isActive: true,
  },
  {
    id: "admin-003",
    username: "branch2admin",
    name: "Sari Indah",
    email: "sari@bcwash.com",
    role: "branch-admin",
    branchId: "sukarame-branch2",
    createdAt: "2023-06-20T09:00:00Z",
    lastLogin: "2024-01-16T16:45:00Z",
    isActive: true,
  },
  {
    id: "admin-004",
    username: "staff001",
    name: "Rudi Hartono",
    email: "rudi@bcwash.com",
    role: "staff",
    branchId: "sukarame-main",
    createdAt: "2023-02-01T09:00:00Z",
    lastLogin: "2024-01-16T14:20:00Z",
    isActive: true,
  },
  {
    id: "admin-005",
    username: "staff002",
    name: "Dewi Sartika",
    email: "dewi@bcwash.com",
    role: "staff",
    branchId: "sukarame-branch2",
    createdAt: "2023-07-15T10:00:00Z",
    lastLogin: "2024-01-15T16:30:00Z",
    isActive: true,
  },
  {
    id: "admin-006",
    username: "branch3admin",
    name: "Andi Wijaya",
    email: "andi.admin@bcwash.com",
    role: "branch-admin",
    branchId: "sukarame-branch3",
    createdAt: "2023-11-01T10:00:00Z",
    lastLogin: "2024-01-05T15:00:00Z",
    isActive: false,
  },
]

export const getBookingsByDateRange = (startDate: string, endDate: string): Booking[] => {
  return sampleBookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    return bookingDate >= start && bookingDate <= end
  })
}

export const getBookingsByBranch = (branchId: string): Booking[] => {
  return sampleBookings.filter((booking) => booking.branchId === branchId)
}

export const getBookingsByStatus = (status: Booking["status"]): Booking[] => {
  return sampleBookings.filter((booking) => booking.status === status)
}

export const getOfflineBookings = (): Booking[] => {
  return sampleBookings.filter((booking) => booking.bookingSource === "offline")
}

export const getOnlineBookings = (): Booking[] => {
  return sampleBookings.filter((booking) => booking.bookingSource === "online")
}

export const getTodayBookings = (): Booking[] => {
  const today = new Date().toISOString().split("T")[0]
  return sampleBookings.filter((booking) => booking.date === today)
}

export const getRevenueByDateRange = (startDate: string, endDate: string): number => {
  const bookings = getBookingsByDateRange(startDate, endDate)
  return bookings
    .filter((booking) => booking.status === "completed")
    .reduce((total, booking) => total + booking.totalPrice, 0)
}

export const getRevenueByBranch = (branchId: string): number => {
  const bookings = getBookingsByBranch(branchId)
  return bookings
    .filter((booking) => booking.status === "completed")
    .reduce((total, booking) => total + booking.totalPrice, 0)
}

export const getBookingStats = () => {
  const today = new Date().toISOString().split("T")[0]
  const todayBookings = sampleBookings.filter((booking) => booking.date === today)

  return {
    totalToday: todayBookings.length,
    pending: todayBookings.filter((b) => b.status === "pending").length,
    confirmed: todayBookings.filter((b) => b.status === "confirmed").length,
    inProgress: todayBookings.filter((b) => b.status === "in-progress").length,
    completed: todayBookings.filter((b) => b.status === "completed").length,
    cancelled: todayBookings.filter((b) => b.status === "cancelled").length,
    onlineBookings: todayBookings.filter((b) => b.bookingSource === "online").length,
    offlineBookings: todayBookings.filter((b) => b.bookingSource === "offline").length,
  }
}

export const getBranchStats = (branchId: string) => {
  const branchBookings = getBookingsByBranch(branchId)
  const today = new Date().toISOString().split("T")[0]
  const todayBranchBookings = branchBookings.filter((booking) => booking.date === today)

  return {
    totalBookings: branchBookings.length,
    todayBookings: todayBranchBookings.length,
    completedBookings: branchBookings.filter((b) => b.status === "completed").length,
    totalRevenue: getRevenueByBranch(branchId),
    averageBookingValue:
      branchBookings.length > 0
        ? Math.round(getRevenueByBranch(branchId) / branchBookings.filter((b) => b.status === "completed").length)
        : 0,
  }
}

export const getPopularServices = () => {
  const serviceCounts = sampleBookings.reduce(
    (acc, booking) => {
      acc[booking.serviceId] = (acc[booking.serviceId] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(serviceCounts)
    .map(([serviceId, count]) => ({
      service: getServiceById(serviceId),
      bookingCount: count,
    }))
    .filter((item) => item.service)
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5)
}

export const getCustomerRetentionData = () => {
  const customerBookingCounts = sampleCustomers.map((customer) => ({
    customer,
    bookingCount: sampleBookings.filter((booking) => booking.customerPhone === customer.phone).length,
  }))

  return {
    newCustomers: customerBookingCounts.filter((c) => c.bookingCount === 1).length,
    returningCustomers: customerBookingCounts.filter((c) => c.bookingCount > 1).length,
    loyalCustomers: customerBookingCounts.filter((c) => c.bookingCount >= 5).length,
    averageBookingsPerCustomer: Math.round(
      customerBookingCounts.reduce((sum, c) => sum + c.bookingCount, 0) / customerBookingCounts.length,
    ),
  }
}

export const addNewBranch = (branchData: Omit<Branch, "id" | "createdAt" | "updatedAt">): Branch => {
  const newBranch: Branch = {
    ...branchData,
    id: `branch-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  branches.push(newBranch)
  return newBranch
}

export const updateBranchInfo = (branchId: string, updateData: Partial<Branch>): boolean => {
  const branchIndex = branches.findIndex((b) => b.id === branchId)
  if (branchIndex !== -1) {
    branches[branchIndex] = {
      ...branches[branchIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    return true
  }
  return false
}

export const getBranchPerformanceMetrics = () => {
  return branches.map((branch) => {
    const branchBookings = getBookingsByBranch(branch.id)
    const completedBookings = branchBookings.filter((b) => b.status === "completed")
    const revenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)

    return {
      branch,
      metrics: {
        totalBookings: branchBookings.length,
        completedBookings: completedBookings.length,
        revenue,
        averageBookingValue: completedBookings.length > 0 ? Math.round(revenue / completedBookings.length) : 0,
        completionRate:
          branchBookings.length > 0 ? Math.round((completedBookings.length / branchBookings.length) * 100) : 0,
      },
    }
  })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const generateBookingCode = (): string => {
  const prefix = "BCW"
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}${timestamp}`
}

export const getServiceById = (id: string): Service | undefined => {
  return services.find((service) => service.id === id)
}

export const getBranchById = (id: string): Branch | undefined => {
  return branches.find((branch) => branch.id === id)
}

export const generateReceiptData = (bookingId: string): ReceiptData => {
  const booking = sampleBookings.find((b) => b.id === bookingId)
  const branch = getBranchById(booking?.branchId || "sukarame-main")
  const service = getServiceById(booking?.serviceId || "car-small-premium")

  return {
    bookingCode: booking?.bookingCode || "BCW001",
    customerName: booking?.customerName || "Ahmad Rizki",
    customerPhone: booking?.customerPhone || "08123456789",
    service: service?.name || "Cuci Mobil Kecil Hidrolik",
    branch: branch?.name || "BC Wash Sukarame Utama",
    branchAddress: branch?.address || "Jl. Soekarno Hatta No. 123, Sukarame",
    date: booking?.date || "2024-01-15",
    time: booking?.time || "10:00",
    amount: service?.price || 45000,
    paymentMethod: "Transfer Bank",
    completedAt: new Date().toISOString(),
    staff: "Budi (Staff)",
  }
}

export const calculateLoyaltyPoints = (amount: number): number => {
  // 1 point for every 1000 IDR spent
  return Math.floor(amount / 1000)
}

export const getCustomerByPhone = (phone: string): Customer | undefined => {
  return sampleCustomers.find((customer) => customer.phone === phone)
}

export const addVehiclePlateToCustomer = (customerId: string, plateNumber: string): void => {
  const customer = sampleCustomers.find((c) => c.id === customerId)
  if (customer && !customer.vehiclePlateNumbers.includes(plateNumber)) {
    customer.vehiclePlateNumbers.push(plateNumber)
  }
}

export const getAdminById = (id: string): Admin | undefined => {
  return sampleAdmins.find((admin) => admin.id === id)
}

export const getActiveBranches = (): Branch[] => {
  return branches.filter((branch) => branch.status === "active")
}

export const createOfflineBooking = (
  bookingData: Omit<Booking, "id" | "bookingCode" | "createdAt" | "updatedAt">,
): Booking => {
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}`,
    bookingCode: generateBookingCode(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingSource: "offline",
    createdByAdmin: true,
  }

  sampleBookings.push(newBooking)
  return newBooking
}

export const updateBranchStatus = (branchId: string, status: "active" | "inactive"): boolean => {
  const branch = branches.find((b) => b.id === branchId)
  if (branch) {
    branch.status = status
    branch.updatedAt = new Date().toISOString()
    return true
  }
  return false
}
