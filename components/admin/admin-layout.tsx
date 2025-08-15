"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, Calendar, BarChart3, Settings, LogOut, Car, Users } from "lucide-react"
import Link from "next/link"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kelola Booking",
      url: "/admin/bookings",
      icon: Calendar,
    },
    {
      title: "Layanan",
      url: "/admin/services",
      icon: Car,
    },
    {
      title: "Pelanggan",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Laporan",
      url: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sidebar-foreground">BC Wash</h2>
              <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">BC Wash Sukarame</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Panel Administrasi</span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
