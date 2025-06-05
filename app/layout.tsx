import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
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

export const viewport: Viewport = {
  themeColor: "#000000",
}

export const metadata: Metadata = {
  title: "Anime Roblox Countdown - Track Upcoming Anime-Themed Roblox Games",
  description: "Stay updated on the latest anime-themed Roblox games with release dates, countdowns, and notifications. Find detailed information about upcoming releases and never miss a launch.",
  keywords: "anime, roblox, countdown, games, release dates, upcoming games, anime games",
  openGraph: {
    title: "Anime Roblox Countdown",
    description: "Track upcoming anime-themed Roblox games with release dates and countdowns",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Anime Roblox Countdown",
    images: [
      {
        url: "/background-image.png",
        width: 1200,
        height: 630,
        alt: "Anime Roblox Countdown",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Roblox Countdown",
    description: "Track upcoming anime-themed Roblox games with release dates and countdowns",
    images: ["/background-image.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: { url: '/favicon.svg', type: 'image/svg+xml' },
    apple: [
      { url: '/favicon.svg', rel: 'apple-touch-icon', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: "/site.webmanifest",
  robots: "index, follow",
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
