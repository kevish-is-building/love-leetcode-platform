"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout() {
  const pathname = usePathname();
  
  // Don't show navbar and footer on auth page
  if (pathname === "/auth") {
    return null;
  }
  if (pathname.startsWith("/problem/")) {
    return null;
  }
  
  return (
    <>
      <Navbar />
    </>
  );
}

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on auth page
  if (pathname === "/auth") {
    return null;
  }
  if (pathname.startsWith("/problem/")) {
    return null;
  }
  
  return <Footer />;
}
