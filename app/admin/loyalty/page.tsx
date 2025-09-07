"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { LoyaltyDashboard } from "@/components/admin/loyalty-dashboard"

export default function LoyaltyPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <LoyaltyDashboard />
    </AdminLayout>
  )
}
