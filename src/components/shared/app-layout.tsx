"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  Map,
  PlusCircle,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

const menuItems = [
  {
    href: "/",
    label: "Uppdrag",
    icon: ClipboardList,
  },
  {
    href: "/dashboard",
    label: "Översikt",
    icon: LayoutDashboard,
  },
  {
    href: "/new-report",
    label: "Ny Rapport",
    icon: PlusCircle,
  },
  {
    href: "/route-optimizer",
    label: "Ruttoptimering",
    icon: Map,
  },
  {
    href: "/users",
    label: "Användare",
    icon: Users,
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Icons.logo className="size-5" />
            </Button>
            <span className="font-headline text-lg font-semibold">
              RescueAssist
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="justify-start"
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between md:justify-end mb-6">
          <SidebarTrigger className="md:hidden" />
          {/* Header content for larger screens can go here */}
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
