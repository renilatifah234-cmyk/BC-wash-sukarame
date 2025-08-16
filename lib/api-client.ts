interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Request failed",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error",
      }
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    return this.request("/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async logout() {
    return this.request("/auth", {
      method: "DELETE",
    })
  }

  // Booking methods
  async getBookings(params?: { branchId?: string; status?: string; date?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.branchId) searchParams.set("branchId", params.branchId)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.date) searchParams.set("date", params.date)
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/bookings${query ? `?${query}` : ""}`)
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`)
  }

  async createBooking(bookingData: any) {
    return this.request("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  async updateBooking(id: string, updateData: any) {
    return this.request(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    })
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: "DELETE",
    })
  }

  // Service methods
  async getServices() {
    return this.request("/services")
  }

  async createService(serviceData: any) {
    return this.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  // Branch methods
  async getBranches() {
    return this.request("/branches")
  }

  async createBranch(branchData: any) {
    return this.request("/branches", {
      method: "POST",
      body: JSON.stringify(branchData),
    })
  }

  // Customer methods
  async getCustomers(phone?: string) {
    const query = phone ? `?phone=${encodeURIComponent(phone)}` : ""
    return this.request(`/customers${query}`)
  }

  async createCustomer(customerData: any) {
    return this.request("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    })
  }

  // Report methods
  async getReports(params?: { startDate?: string; endDate?: string; branchId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set("startDate", params.startDate)
    if (params?.endDate) searchParams.set("endDate", params.endDate)
    if (params?.branchId) searchParams.set("branchId", params.branchId)

    const query = searchParams.toString()
    return this.request(`/reports${query ? `?${query}` : ""}`)
  }
}

export const apiClient = new ApiClient()
