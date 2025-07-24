import Link from 'next/link'
import { NotionButton } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Target, Play } from 'lucide-react'

export function HeroSection() {
  const styles = useNotionStyles()

  return (
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
  )
}