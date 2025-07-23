'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { Building, Users, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react'

const industries = [
  'Automobil & Mobilität',
  'Finanzdienstleistungen',
  'Gesundheitswesen',
  'Einzelhandel & E-Commerce',
  'Produktion & Industrie',
  'Technologie & Software',
  'Beratung & Services',
  'Bildung & Forschung',
  'Energie & Umwelt',
  'Medien & Marketing',
  'Andere',
]

const companySizes = [
  { value: '1-10', label: '1-10 Mitarbeiter (Startup/Freelancer)' },
  { value: '11-50', label: '11-50 Mitarbeiter (Kleines Unternehmen)' },
  { value: '51-200', label: '51-200 Mitarbeiter (Mittelstand)' },
  { value: '201-1000', label: '201-1000 Mitarbeiter (Großes Unternehmen)' },
  { value: '1000+', label: '1000+ Mitarbeiter (Konzern)' },
]

const revenueRanges = [
  { value: '<100k', label: 'Unter €100.000' },
  { value: '100k-500k', label: '€100.000 - €500.000' },
  { value: '500k-2m', label: '€500.000 - €2 Millionen' },
  { value: '2m-10m', label: '€2 - €10 Millionen' },
  { value: '10m-50m', label: '€10 - €50 Millionen' },
  { value: '50m+', label: 'Über €50 Millionen' },
  { value: 'prefer-not', label: 'Möchte ich nicht angeben' },
]

export default function AssessmentStartPage() {
  const router = useRouter()
  const styles = useNotionStyles()

  const [formData, setFormData] = useState({
    industry: '',
    companySize: '',
    revenue: '',
    role: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.industry) newErrors.industry = 'Bitte wählen Sie eine Branche'
    if (!formData.companySize) newErrors.companySize = 'Bitte wählen Sie die Unternehmensgröße'
    if (!formData.revenue) newErrors.revenue = 'Bitte wählen Sie einen Umsatzbereich'
    if (!formData.role) newErrors.role = 'Bitte geben Sie Ihre Rolle an'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      // Store form data (would normally be in state management)
      localStorage.setItem('assessmentData', JSON.stringify({ step1: formData }))
      router.push('/assessment/step-2')
    }
  }

  return (
    <NotionCard className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-notion-blue to-notion-purple rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-white" />
        </div>
        <h2 className={styles.text('h2', 'mb-2')}>Erzählen Sie uns von Ihrem Unternehmen</h2>
        <p className="text-notion-text-secondary dark:text-notion-dark-text-secondary">
          Diese Informationen helfen uns, maßgeschneiderte KI-Empfehlungen für Sie zu erstellen.
        </p>
      </div>

      <div className="space-y-6">
        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            In welcher Branche ist Ihr Unternehmen tätig? *
          </label>
          <div className="relative">
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className={`w-full px-3 py-2 text-sm border rounded-md bg-notion-bg dark:bg-notion-dark-bg appearance-none ${
                errors.industry
                  ? 'border-notion-red focus:ring-notion-red'
                  : 'border-notion-border dark:border-notion-dark-border focus:ring-notion-blue'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
            >
              <option value="">Branche auswählen...</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-notion-text-secondary pointer-events-none" />
          </div>
          {errors.industry && <p className="text-notion-red text-xs mt-1">{errors.industry}</p>}
        </div>

        {/* Company Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Wie groß ist Ihr Unternehmen? *</label>
          <div className="space-y-2">
            {companySizes.map((size) => (
              <label
                key={size.value}
                className="flex items-center p-3 border border-notion-border dark:border-notion-dark-border rounded-lg hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="companySize"
                  value={size.value}
                  checked={formData.companySize === size.value}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-4 h-4 text-notion-blue focus:ring-notion-blue border-notion-border dark:border-notion-dark-border"
                />
                <span className="ml-3 text-sm">{size.label}</span>
              </label>
            ))}
          </div>
          {errors.companySize && (
            <p className="text-notion-red text-xs mt-1">{errors.companySize}</p>
          )}
        </div>

        {/* Revenue Range */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Wie hoch ist Ihr jährlicher Umsatz? *
          </label>
          <div className="relative">
            <select
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              className={`w-full px-3 py-2 text-sm border rounded-md bg-notion-bg dark:bg-notion-dark-bg appearance-none ${
                errors.revenue
                  ? 'border-notion-red focus:ring-notion-red'
                  : 'border-notion-border dark:border-notion-dark-border focus:ring-notion-blue'
              } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
            >
              <option value="">Umsatzbereich auswählen...</option>
              {revenueRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-notion-text-secondary pointer-events-none" />
          </div>
          {errors.revenue && <p className="text-notion-red text-xs mt-1">{errors.revenue}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Wie ist Ihre Position im Unternehmen? *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="z.B. Geschäftsführer, IT-Leiter, Projektmanager..."
            className={`w-full px-3 py-2 text-sm border rounded-md bg-notion-bg dark:bg-notion-dark-bg ${
              errors.role
                ? 'border-notion-red focus:ring-notion-red'
                : 'border-notion-border dark:border-notion-dark-border focus:ring-notion-blue'
            } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
          />
          {errors.role && <p className="text-notion-red text-xs mt-1">{errors.role}</p>}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-notion-border dark:border-notion-dark-border">
          <div></div> {/* Empty div for spacing */}
          <NotionButton
            variant="primary"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Weiter zu Schritt 2
          </NotionButton>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-notion-blue/5 border border-notion-blue/20 rounded-lg">
        <div className="flex items-start">
          <div className="w-6 h-6 bg-notion-blue/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <TrendingUp className="w-3 h-3 text-notion-blue" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-notion-blue mb-1">Warum fragen wir das?</h4>
            <p className="text-xs text-notion-text-secondary dark:text-notion-dark-text-secondary">
              Ihre Unternehmensdaten helfen uns, branchenspezifische KI-Anwendungsfälle zu
              identifizieren und realistische ROI-Prognosen zu erstellen. Alle Daten werden
              vertraulich behandelt.
            </p>
          </div>
        </div>
      </div>
    </NotionCard>
  )
}
