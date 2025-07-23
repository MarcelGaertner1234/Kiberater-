import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KI-Beratung - Ihre KI erfolgreich integrieren',
  description: 'Personalisierte KI-Beratung für Unternehmen. Von der Analyse bis zur Umsetzung - wir begleiten Sie auf Ihrer KI-Reise.',
  keywords: 'KI, Künstliche Intelligenz, Beratung, Unternehmensberatung, AI Consulting, Digital Transformation',
  authors: [{ name: 'KI-Beratung Team' }],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://ki-beratung.de',
    siteName: 'KI-Beratung',
    title: 'KI-Beratung - Ihre KI erfolgreich integrieren',
    description: 'Personalisierte KI-Beratung für Unternehmen',
    images: [
      {
        url: 'https://ki-beratung.de/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KI-Beratung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KI-Beratung - Ihre KI erfolgreich integrieren',
    description: 'Personalisierte KI-Beratung für Unternehmen',
    images: ['https://ki-beratung.de/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}