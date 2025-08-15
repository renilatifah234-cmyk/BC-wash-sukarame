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
    address: "Jl. Soekarno Hatta No. 123, Sukarame, Bandar Lampung",
    phone: "0721-123456",
    bankAccount: {
      bank: "BCA",
      accountNumber: "1234567890",
      accountName: "BC Wash Sukarame",
    },
    operatingHours: {
      open: "08:00",
      close: "18:00",
    },
    pickupCoverageRadius: 10,
  },
  {
    id: "sukarame-branch2",
    name: "BC Wash Sukarame Cabang 2",
    address: "Jl. Teuku Umar No. 456, Sukarame, Bandar Lampung",
    phone: "0721-654321",
    bankAccount: {
      bank: "Mandiri",
      accountNumber: "0987654321",
      accountName: "BC Wash Sukarame Cab 2",
    },
    operatingHours: {
      open: "08:00",
      close: "18:00",
    },
    pickupCoverageRadius: 8,
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
    loyaltyPointsEarned: 20,
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
    loyaltyPointsEarned: 10,
  },
]

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
