import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { PermissionProvider } from "@/context/PermissionContext";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | OSYSTIC Admin" },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AuthProvider>
        <PermissionProvider>
          <QueryProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
            <Toaster position="top-right" />
          </QueryProvider>
        </PermissionProvider>
      </AuthProvider>
    </div>
  );
}
