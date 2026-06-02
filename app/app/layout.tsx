import type React from "react"
import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SYNDEO - Conversational AI Platform",
  description: "Multi-channel conversational AI management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body className={`antialiased ${nunitoSans.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
