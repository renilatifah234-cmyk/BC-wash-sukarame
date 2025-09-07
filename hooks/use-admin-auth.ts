"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      try {
        await apiClient.checkAuth()
        setIsAuthenticated(true)
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }
    verify()
  }, [router])

  return { isAuthenticated, isLoading }
}
