"use client"

import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ServiceManagement } from "@/components/admin/service-management"

export default function AdminServicesPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <ServiceManagement />
    </AdminLayout>
  )
}
