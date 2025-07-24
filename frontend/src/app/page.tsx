'use client'

import Link from 'next/link'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import {
  ArrowRight,
  Brain,
  Target,
  Zap,
  BarChart3,
  Users,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Award,
  TrendingUp,
  Play,
} from 'lucide-react'

export default function HomePage() {
  const styles = useNotionStyles()

  return (
    <div className={styles.page()}>
      {/* Hero Section */}
      <section className="min-h-screen">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={styles.text('h1', 'mb-6')}>
              KI einfach machen - für Ihr Unternehmen
            </h1>
            <p className={styles.text('lead', 'mb-8 max-w-2xl mx-auto')}>
              Transformieren Sie Ihr Unternehmen mit künstlicher Intelligenz. Von der ersten Analyse bis zur erfolgreichen Umsetzung - wir begleiten Sie auf Ihrer KI-Reise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <NotionButton variant="primary" size="lg" leftIcon={<Target className="w-5 h-5" />}>
                  Kostenlose KI-Analyse starten
                </NotionButton>
              </Link>
              <NotionButton variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                Demo ansehen
              </NotionButton>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 px-4 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <NotionCard gradient className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-notion-blue/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-notion-blue" />
                </div>
              </div>
              <h3 className={styles.text('h2', 'mb-2')}>500+</h3>
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Unternehmen transformiert
              </p>
            </NotionCard>

            <NotionCard gradient className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-notion-green/10 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-notion-green" />
                </div>
              </div>
              <h3 className={styles.text('h2', 'mb-2')}>98%</h3>
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Erfolgsrate bei Projekten
              </p>
            </NotionCard>

            <NotionCard gradient className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-notion-purple/10 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-notion-purple" />
                </div>
              </div>
              <h3 className={styles.text('h2', 'mb-2')}>3 Monate</h3>
              <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary')}>
                Durchschnittliche Time-to-Value
              </p>
            </NotionCard>
          </div>
        </div>
      </section>

      {/* Features Section - 4 Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className={styles.text('h1', 'mb-4')}>
              Ihre KI-Reise in 4 Schritten
            </h2>
            <p className={styles.text('lead', 'text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto')}>
              Von der ersten Analyse bis zur erfolgreichen Implementierung - unser bewährter Prozess führt Sie sicher zum Ziel.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <NotionCard className="text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-notion-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="pt-6">
                <Target className="w-12 h-12 text-notion-blue mb-6 mx-auto" />
                <h3 className={styles.text('h3', 'mb-3')}>Quick Assessment</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4')}>
                  5 Minuten zur KI-Strategie. Ermitteln Sie Ihren KI-Reifegrad und entdecken Sie konkrete Potentiale für Ihr Unternehmen.
                </p>
                <NotionButton variant="ghost" size="sm">
                  Assessment starten
                </NotionButton>
              </div>
            </NotionCard>

            <NotionCard className="text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-notion-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="pt-6">
                <Brain className="w-12 h-12 text-notion-purple mb-6 mx-auto" />
                <h3 className={styles.text('h3', 'mb-3')}>Personalisierte Roadmap</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4')}>
                  Ihr Weg zur KI. Maßgeschneiderte Strategie mit priorisierten Use Cases und realistischen Zeitplänen für Ihren Erfolg.
                </p>
                <NotionButton variant="ghost" size="sm">
                  Roadmap ansehen
                </NotionButton>
              </div>
            </NotionCard>

            <NotionCard className="text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-notion-yellow text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="pt-6">
                <Zap className="w-12 h-12 text-notion-yellow mb-6 mx-auto" />
                <h3 className={styles.text('h3', 'mb-3')}>Projekt Management</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4')}>
                  Schritt für Schritt. Agile Umsetzung mit transparentem Tracking und regelmäßigen Erfolgskontrollen.
                </p>
                <NotionButton variant="ghost" size="sm">
                  Projekte verwalten
                </NotionButton>
              </div>
            </NotionCard>

            <NotionCard className="text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-notion-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="pt-6">
                <Users className="w-12 h-12 text-notion-green mb-6 mx-auto" />
                <h3 className={styles.text('h3', 'mb-3')}>Experten-Beratung</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4')}>
                  Immer an Ihrer Seite. Persönliche Begleitung durch erfahrene KI-Berater für nachhaltigen Erfolg.
                </p>
                <NotionButton variant="ghost" size="sm">
                  Berater kontaktieren
                </NotionButton>
              </div>
            </NotionCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className={styles.text('h1', 'mb-4')}>
              Transparent. Fair. Erfolgsorientiert.
            </h2>
            <p className={styles.text('lead', 'text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto')}>
              Wählen Sie das Paket, das zu Ihrem Unternehmen passt. Alle Pläne beinhalten persönliche Beratung und können jederzeit angepasst werden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <NotionCard className="relative">
              <div className="text-center">
                <h3 className={styles.text('h3', 'mb-2')}>Starter</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6')}>
                  Perfekt für erste KI-Experimente
                </p>
                <div className="mb-6">
                  <span className={styles.text('h1')}>49€</span>
                  <span className={styles.text('body', 'text-notion-text-secondary')}>/Monat</span>
                </div>
                <NotionButton variant="secondary" className="w-full mb-6">
                  Starter wählen
                </NotionButton>
                <div className="text-left space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>KI-Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Basis-Roadmap</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>1 Projekt gleichzeitig</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>E-Mail Support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Basis-Analytics</span>
                  </div>
                </div>
              </div>
            </NotionCard>

            {/* Professional Plan - Highlighted */}
            <NotionCard gradient className="relative border-2 border-notion-blue">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-notion-blue text-white px-4 py-1 rounded-full text-sm font-medium">
                Beliebteste Wahl
              </div>
              <div className="text-center">
                <h3 className={styles.text('h3', 'mb-2')}>Professional</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6')}>
                  Für ambitionierte KI-Transformationen
                </p>
                <div className="mb-6">
                  <span className={styles.text('h1')}>199€</span>
                  <span className={styles.text('body', 'text-notion-text-secondary')}>/Monat</span>
                </div>
                <NotionButton variant="primary" className="w-full mb-6">
                  Professional wählen
                </NotionButton>
                <div className="text-left space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Erweiterte KI-Analyse</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Detaillierte Roadmap</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>5 Projekte gleichzeitig</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Priority Support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Erweiterte Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Monatliche Beratergespräche</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Team-Training</span>
                  </div>
                </div>
              </div>
            </NotionCard>

            {/* Enterprise Plan */}
            <NotionCard className="relative">
              <div className="text-center">
                <h3 className={styles.text('h3', 'mb-2')}>Enterprise</h3>
                <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6')}>
                  Maximale Flexibilität für Großunternehmen
                </p>
                <div className="mb-6">
                  <span className={styles.text('h1')}>499€</span>
                  <span className={styles.text('body', 'text-notion-text-secondary')}>/Monat</span>
                </div>
                <NotionButton variant="secondary" className="w-full mb-6">
                  Enterprise wählen
                </NotionButton>
                <div className="text-left space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Vollständige KI-Strategie</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Custom Roadmap</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Unbegrenzte Projekte</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Dedicated Support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Custom Analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>Wöchentliche Beratung</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>On-Site Training</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3" />
                    <span className={styles.text('body')}>API-Zugang</span>
                  </div>
                </div>
              </div>
            </NotionCard>
          </div>

          {/* CTA unter Pricing */}
          <div className="text-center mt-12">
            <p className={styles.text('body', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6')}>
              Alle Pläne beinhalten eine 14-tägige kostenlose Testphase. Keine Einrichtungsgebühren.
            </p>
            <NotionButton variant="ghost">
              Individuelle Lösungen anfragen
            </NotionButton>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className={styles.text('h1', 'mb-6')}>
            Bereit für Ihre KI-Transformation?
          </h2>
          <p className={styles.text('lead', 'text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8')}>
            Starten Sie heute mit Ihrem kostenlosen Assessment und entdecken Sie die Möglichkeiten von KI für Ihr Unternehmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <NotionButton variant="primary" size="lg" leftIcon={<Target className="w-5 h-5" />}>
                Kostenlos starten
              </NotionButton>
            </Link>
            <Link href="/contact">
              <NotionButton variant="ghost" size="lg">
                Beratungsgespräch buchen
              </NotionButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}