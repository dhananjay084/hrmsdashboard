"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); 

  return (
    <html lang="en">
      <body>
        <>
          {pathname !== "/Login" && <Header />}
          <div className={pathname == "/Login"?'':'p-6'}>{children}</div>
        </>
      </body>
    </html>
  );
}
