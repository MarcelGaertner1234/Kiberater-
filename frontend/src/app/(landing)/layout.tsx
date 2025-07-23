'use client'

import Link from 'next/link'
import { NotionButton } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-notion-bg dark:bg-notion-dark-bg">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  )
}

function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-notion-border dark:border-notion-dark-border bg-notion-bg/95 dark:bg-notion-dark-bg/95 backdrop-blur supports-[backdrop-filter]:bg-notion-bg/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-notion-blue to-notion-purple"></div>
          <span className="hidden font-bold sm:inline-block">KI-Beratung</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="#features"
            className="transition-colors hover:text-notion-text dark:hover:text-notion-dark-text text-notion-text-secondary dark:text-notion-dark-text-secondary"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-notion-text dark:hover:text-notion-dark-text text-notion-text-secondary dark:text-notion-dark-text-secondary"
          >
            Preise
          </Link>
          <Link
            href="#about"
            className="transition-colors hover:text-notion-text dark:hover:text-notion-dark-text text-notion-text-secondary dark:text-notion-dark-text-secondary"
          >
            Über uns
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <NotionButton variant="ghost" size="sm">
              Anmelden
            </NotionButton>
          </Link>
          <Link href="/auth/register">
            <NotionButton variant="primary" size="sm">
              Kostenlos starten
            </NotionButton>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-notion-text-secondary dark:text-notion-dark-text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-notion-border dark:border-notion-dark-border bg-notion-bg dark:bg-notion-dark-bg">
          <nav className="px-4 py-4 space-y-4">
            <Link
              href="#features"
              className="block text-sm font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block text-sm font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preise
            </Link>
            <Link
              href="#about"
              className="block text-sm font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary hover:text-notion-text dark:hover:text-notion-dark-text"
              onClick={() => setMobileMenuOpen(false)}
            >
              Über uns
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-notion-border dark:border-notion-dark-border bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-notion-blue to-notion-purple"></div>
              <span className="font-bold">KI-Beratung</span>
            </div>
            <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              Ihre KI erfolgreich in Ihr Unternehmen integrieren.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-3">Produkt</h3>
            <ul className="space-y-2 text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              <li>
                <Link
                  href="#features"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Preise
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Unternehmen</h3>
            <ul className="space-y-2 text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              <li>
                <Link
                  href="/about"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/imprint"
                  className="hover:text-notion-text dark:hover:text-notion-dark-text"
                >
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-notion-border dark:border-notion-dark-border mt-8 pt-8 text-center text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
          <p>&copy; 2024 KI-Beratung. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
