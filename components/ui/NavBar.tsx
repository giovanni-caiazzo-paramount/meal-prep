"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/menu", label: "📅 Menu" },
  { href: "/shopping", label: "🛒 Shopping" },
  { href: "/inventory", label: "🧂 Inventory" },
  { href: "/kitchen", label: "🍳 Kitchen" },
  { href: "/optimize", label: "🤖 Optimize" },
  { href: "/settings", label: "⚙️ Settings" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col group">
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Karotte & Erbse
            </span>
            <span className="text-xs text-gray-500 leading-none">
              Catering Automation
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
