import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Poppins, Orbitron } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import StagewiseToolbarWrapper from "@/components/stagewise-toolbar"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
})
const orbitron = Orbitron({ 
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron"
})

export const metadata: Metadata = {
  title: "Anime Roblox Countdown - Track Upcoming Anime-Themed Roblox Games",
  description: "Stay updated on the latest anime-themed Roblox games with release dates, countdowns, and more.",
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=2', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    shortcut: { url: '/favicon.ico?v=2', type: 'image/x-icon' },
    apple: [
      { url: '/favicon.svg?v=2', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${poppins.variable} ${orbitron.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
          {children}
          </AuthProvider>
        </ThemeProvider>
        <StagewiseToolbarWrapper />
      </body>
    </html>
  )
}
