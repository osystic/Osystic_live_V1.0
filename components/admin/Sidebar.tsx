"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Landmark, Settings, ChevronDown, ChevronRight,
  Menu, X, Newspaper, GraduationCap, LayoutGrid, Sparkles,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Modules", href: "/admin", icon: <LayoutGrid size={18} /> },
      { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: "Finance System",
    items: [
      { label: "Open Finance", href: "/dashboard", icon: <Landmark size={18} /> },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Case Studies Generate", href: "/admin/case-studies", icon: <Sparkles size={18} /> },
      { label: "Content", href: "/admin/content", icon: <Newspaper size={18} /> },
      { label: "Careers", href: "/admin/careers", icon: <GraduationCap size={18} /> },
      { label: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS.map(g => g.title))
  );

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300 w-64">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">O</div>
        <span className="text-white font-semibold text-lg">OSYSTIC</span>
        <span className="text-xs text-gray-500 ml-auto">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {NAV_GROUPS.map(group => (
          <div key={group.title} className="mb-1">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400"
            >
              {group.title}
              {expandedGroups.has(group.title) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {expandedGroups.has(group.title) && (
              <div className="mt-0.5">
                {group.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-600">
        OSYSTIC Finance v0.2
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform lg:transform-none ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {sidebar}
      </aside>
    </>
  );
}
