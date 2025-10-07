import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Crimson_Text, Dancing_Script, Island_Moments, Cormorant_SC } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { LanguageProvider } from "@/lib/language-context"
import { Footer } from "@/components/footer"

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  display: "swap",
})

const islandMoments = Island_Moments({
  variable: "--font-island-moments",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const cormorantSC = Cormorant_SC({
  variable: "--font-cormorant-sc",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Biraveen & Varnie Wedding",
  description: "Join us for our Tamil Hindu wedding celebration in Cyprus, March 2026",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${crimsonText.variable} ${dancingScript.variable} ${islandMoments.variable} ${cormorantSC.variable}`}
    >
      <body className="font-sans antialiased floral-background">
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
