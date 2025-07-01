"use client";

import NavBar from "@/components/NavBar";
import { useAuthContext } from "@/components/Prividers/AuthProvider";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuthContext();
  const [dashboardSwitch, setDashboardSwitch] = useState<boolean>(false);

  useEffect(() => {
    setDashboardSwitch(pathname === "/dashboard");
  }, [pathname]);

  return (
    <main className="relative flex flex-column h-screen w-screen overflow-hidden">
      {auth?.isAuthenticated && (
        <NavBar
          dashboardSwitch={dashboardSwitch}
          setDashboardSwitch={setDashboardSwitch}
        />
      )}
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          padding: "var(--space-6) var(--space-8)",
          height: auth?.isAuthenticated ? "calc(100vh - 5rem)" : "calc(100vh)",
          maxHeight: auth?.isAuthenticated
            ? "calc(100vh - 5rem)"
            : "calc(100vh)",
        }}
      >
        {children}
      </div>
    </main>
  );
}
