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
  Play,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react'

export default function LandingPage() {
  const styles = useNotionStyles()

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

function HeroSection() {
  const styles = useNotionStyles()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-notion-blue/5 via-notion-purple/5 to-notion-green/5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-notion-blue/10 text-notion-blue text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            KI erfolgreich implementieren
          </div>

          {/* Main Headline */}
          <h1 className={styles.text('h1', 'mb-6 text-4xl lg:text-6xl bg-gradient-to-r from-notion-text via-notion-blue to-notion-purple bg-clip-text text-transparent')}>
            KI einfach machen - für Ihr Unternehmen
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
            Personalisierte Beratung, praktische Umsetzung, messbare Erfolge. 
            Wir begleiten Sie auf Ihrer KI-Reise - von der ersten Idee bis zur erfolgreichen Implementation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <NotionButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Kostenlose KI-Analyse starten
              </NotionButton>
            </Link>
            <Link href="#demo">
              <NotionButton variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                Demo ansehen (2 Min)
              </NotionButton>
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-notion-text dark:text-notion-dark-text">500+</div>
              <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">Unternehmen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-notion-text dark:text-notion-dark-text">98%</div>
              <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">Erfolgsrate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-notion-text dark:text-notion-dark-text">3x</div>
              <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">ROI im Schnitt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-notion-text dark:text-notion-dark-text">30 Tage</div>
              <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">bis zum Start</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "KI-Assessment",
      description: "Detaillierte Analyse Ihres Unternehmens und maßgeschneiderte KI-Empfehlungen für optimale Ergebnisse.",
      color: "notion-blue"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategische Roadmap",
      description: "Schritt-für-Schritt Plan zur KI-Implementation mit klaren Meilensteinen und messbaren Zielen.",
      color: "notion-purple"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert:innen-Beratung",
      description: "Persönliche Betreuung durch erfahrene KI-Berater:innen mit Branchenerfahrung.",
      color: "notion-green"
    }
  ]

  return (
    <section id="features" className="py-20 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Warum KI-Beratung der richtige Partner ist
          </h2>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto">
            Wir machen KI verständlich, planbar und erfolgreich für Ihr Unternehmen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <NotionCard
              key={index}
              clickable
              gradient
              className="text-center group hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${feature.color}/10 text-${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
                {feature.description}
              </p>
            </NotionCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      step: "1",
      title: "KI-Assessment",
      description: "In 15 Minuten analysieren wir Ihr Unternehmen und identifizieren die besten KI-Anwendungsfälle.",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      step: "2", 
      title: "Strategische Planung",
      description: "Wir erstellen Ihre personalisierte KI-Roadmap mit konkreten Schritten und Zeitplänen.",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Implementation", 
      description: "Schritt-für-Schritt begleiten wir Sie bei der Umsetzung - von der Technologie bis zum Change Management.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Erfolgsmessung",
      description: "Kontinuierliches Monitoring und Optimierung für maximalen ROI und nachhaltigen Erfolg.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Wie wir Ihnen helfen
          </h2>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto">
            Ein bewährter 4-Schritte-Prozess für erfolgreiche KI-Integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-notion-blue to-notion-purple z-0"></div>
              )}
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-notion-blue to-notion-purple text-white font-bold text-lg flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "49",
      period: "/Monat",
      description: "Perfekt für erste KI-Schritte",
      features: [
        "KI-Assessment",
        "Basis-Roadmap", 
        "Email-Support",
        "Monatlicher Check-in",
        "Resource Library"
      ],
      popular: false,
      cta: "Jetzt starten"
    },
    {
      name: "Professional", 
      price: "199",
      period: "/Monat",
      description: "Für ernsthafte KI-Implementation",
      features: [
        "Detailliertes KI-Assessment",
        "Umfassende Roadmap",
        "Chat-Support",
        "Wöchentliche 1:1 Beratung",
        "Projekt-Management",
        "Priorisierter Support"
      ],
      popular: true,
      cta: "14 Tage testen"
    },
    {
      name: "Enterprise",
      price: "499", 
      period: "/Monat",
      description: "Für Unternehmen mit hohen Ansprüchen",
      features: [
        "Alles aus Professional",
        "Dedizierter KI-Berater",
        "Unbegrenzte Beratung",
        "Custom Integration",
        "Team-Training",
        "SLA Garantie"
      ],
      popular: false,
      cta: "Beratung buchen"
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Transparente Preise für jeden Bedarf
          </h2>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto">
            Wählen Sie das Paket, das zu Ihrem Unternehmen passt. Jederzeit kündbar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <NotionCard 
              key={index}
              className={`relative text-center ${plan.popular ? 'ring-2 ring-notion-blue shadow-lg scale-105' : ''}`}
              gradient={plan.popular}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-notion-blue to-notion-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                    Beliebteste Wahl
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className="text-notion-text-secondary dark:text-notion-dark-text-secondary ml-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-notion-green mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <NotionButton 
                variant={plan.popular ? "primary" : "secondary"} 
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </NotionButton>
            </NotionCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary mb-4">
            14 Tage Geld-zurück-Garantie • Keine Einrichtungsgebühren • Jederzeit kündbar
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-notion-green mr-2" />
              <span>DSGVO-konform</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-notion-blue mr-2" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Die KI-Beratung hat unser Unternehmen transformiert. ROI von 300% innerhalb von 6 Monaten.",
      author: "Maria Schmidt",
      role: "CEO, TechStart GmbH",
      rating: 5
    },
    {
      quote: "Endlich KI, die wirklich funktioniert. Das Team versteht unsere Branche und liefert Ergebnisse.",
      author: "Thomas Weber", 
      role: "CTO, Innovation AG",
      rating: 5
    },
    {
      quote: "Von der ersten Analyse bis zur Implementation - alles war professionell und effizient.",
      author: "Anna Müller",
      role: "Geschäftsführerin, Digital Plus",
      rating: 5
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Das sagen unsere Kunden
          </h2>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Über 500 Unternehmen vertrauen auf unsere KI-Expertise
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <NotionCard key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-notion-yellow fill-current" />
                ))}
              </div>
              <blockquote className="text-lg mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                  {testimonial.role}
                </div>
              </div>
            </NotionCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-notion-blue/10 via-notion-purple/10 to-notion-green/10">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Bereit für Ihre KI-Transformation?
          </h2>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8">
            Starten Sie heute mit Ihrer kostenlosen KI-Analyse und entdecken Sie das Potenzial für Ihr Unternehmen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/register">
              <NotionButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Kostenlos loslegen
              </NotionButton>
            </Link>
            <Link href="/contact">
              <NotionButton variant="secondary" size="lg">
                Persönliches Gespräch buchen
              </NotionButton>
            </Link>
          </div>

          <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Keine Kreditkarte erforderlich • 14 Tage kostenlos testen • Jederzeit kündbar
          </p>
        </div>
      </div>
    </section>
  )
}