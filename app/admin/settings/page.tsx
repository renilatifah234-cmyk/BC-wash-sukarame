"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { BranchManagement } from "@/components/admin/branch-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Bell } from "lucide-react"
import { NotificationTemplates } from "@/components/admin/notification-templates"

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Pengaturan Sistem</h1>
          <p className="text-muted-foreground mt-1">Kelola pengaturan dan konfigurasi sistem BC Wash</p>
        </div>

        <Tabs defaultValue="branches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Cabang
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branches">
            <BranchManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
