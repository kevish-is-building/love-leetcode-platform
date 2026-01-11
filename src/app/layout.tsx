
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import ConditionalLayout, { ConditionalFooter } from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthInitializer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
              borderRadius: '0.5rem',
              padding: '8px',
              fontWeight: '400',
            },
            success: {
              style: {
                background: '#000',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.25), 0 0 20px rgba(16, 185, 129, 0.15)',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                background: '#000',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px 0 rgba(239, 68, 68, 0.25), 0 0 20px rgba(239, 68, 68, 0.15)',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            loading: {
              style: {
                background: '#000',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.25), 0 0 20px rgba(99, 102, 241, 0.15)',
              },
              iconTheme: {
                primary: '#6366f1',
                secondary: '#fff',
              },
            },
          }}
        />
        <ConditionalLayout />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
