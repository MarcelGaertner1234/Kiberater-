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
} from 'lucide-react'

export default function HomePage() {
  const styles = useNotionStyles()

  return (
    <div className={styles.page()}>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">
            KI-Transformation für Ihr Unternehmen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Nutzen Sie die Kraft der künstlichen Intelligenz mit unserer bewährten Methodik
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/assessment">
              <NotionButton variant="primary" size="large">
                Kostenloses Assessment starten
                <ArrowRight className="ml-2 w-5 h-5" />
              </NotionButton>
            </Link>
            <Link href="/login">
              <NotionButton variant="secondary" size="large">
                Anmelden
              </NotionButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ihre KI-Reise in 4 Schritten
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NotionCard>
              <Target className="w-12 h-12 text-notion-blue mb-4" />
              <h3 className="text-xl font-semibold mb-2">Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyse Ihres KI-Reifegrads und Identifikation von Potenzialen
              </p>
            </NotionCard>
            <NotionCard>
              <Brain className="w-12 h-12 text-notion-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2">Roadmap</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maßgeschneiderte Strategie für Ihre KI-Transformation
              </p>
            </NotionCard>
            <NotionCard>
              <Zap className="w-12 h-12 text-notion-yellow mb-4" />
              <h3 className="text-xl font-semibold mb-2">Projekte</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Konkrete Umsetzung mit messbaren Ergebnissen
              </p>
            </NotionCard>
            <NotionCard>
              <Users className="w-12 h-12 text-notion-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Beratung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Persönliche Begleitung durch KI-Experten
              </p>
            </NotionCard>
          </div>
        </div>
      </section>
    </div>
  )
}