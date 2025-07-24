'use client'

import { useState } from 'react'
import { NotionButton, NotionCard } from '@/components/ui'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageSquare,
  Calendar,
  Send,
  CheckCircle,
  Linkedin,
  Twitter,
  AlertCircle
} from 'lucide-react'

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  contactPreference: 'email' | 'phone' | 'video'
  newsletter: boolean
}

const subjects = [
  'Allgemeine Anfrage',
  'Beratungstermin vereinbaren',
  'Preisanfrage',
  'Technischer Support',
  'Partnership/Kooperation',
  'Andere'
]

export default function ContactPage() {
  const styles = useNotionStyles()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    contactPreference: 'email',
    newsletter: false
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich'
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse'
    }
    if (!formData.company.trim()) newErrors.company = 'Unternehmen ist erforderlich'
    if (!formData.subject) newErrors.subject = 'Bitte wählen Sie ein Thema'
    if (!formData.message.trim()) newErrors.message = 'Nachricht ist erforderlich'
    if (formData.message.trim().length < 20) {
      newErrors.message = 'Nachricht muss mindestens 20 Zeichen lang sein'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <NotionCard className="text-center">
          <div className="w-16 h-16 bg-notion-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-notion-green" />
          </div>
          <h2 className={styles.text('h2', 'mb-4')}>Vielen Dank für Ihre Nachricht!</h2>
          <p className="text-lg text-notion-text-secondary dark:text-notion-dark-text-secondary mb-8">
            Wir haben Ihre Anfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
          </p>
          <NotionButton 
            variant="primary"
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                subject: '',
                message: '',
                contactPreference: 'email',
                newsletter: false
              })
            }}
          >
            Neue Anfrage senden
          </NotionButton>
        </NotionCard>
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={styles.text('h1', 'mb-4')}>Lassen Sie uns über Ihre KI-Zukunft sprechen</h1>
          <p className="text-xl text-notion-text-secondary dark:text-notion-dark-text-secondary max-w-2xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein unverbindliches Beratungsgespräch vereinbaren? 
            Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Methods */}
            <NotionCard>
              <h3 className={styles.text('h3', 'mb-6')}>Kontaktmöglichkeiten</h3>
              <div className="space-y-4">
                <a href="mailto:hello@ki-beratung.de" className="flex items-start group">
                  <div className="w-10 h-10 bg-notion-blue/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-notion-blue/20 transition-colors">
                    <Mail className="w-5 h-5 text-notion-blue" />
                  </div>
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      hello@ki-beratung.de
                    </p>
                  </div>
                </a>

                <a href="tel:+49123456789" className="flex items-start group">
                  <div className="w-10 h-10 bg-notion-green/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-notion-green/20 transition-colors">
                    <Phone className="w-5 h-5 text-notion-green" />
                  </div>
                  <div>
                    <p className="font-medium">Telefon</p>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      +49 (0) 123 456 789
                    </p>
                  </div>
                </a>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-notion-purple/10 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-notion-purple" />
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      Innovationsstraße 42<br />
                      10115 Berlin, Deutschland
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-notion-yellow/10 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-5 h-5 text-notion-yellow" />
                  </div>
                  <div>
                    <p className="font-medium">Geschäftszeiten</p>
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      Mo-Fr: 9:00 - 18:00 Uhr<br />
                      Sa-So: Geschlossen
                    </p>
                  </div>
                </div>
              </div>
            </NotionCard>

            {/* Quick Actions */}
            <NotionCard>
              <h3 className={styles.text('h3', 'mb-4')}>Schnelle Aktionen</h3>
              <div className="space-y-3">
                <NotionButton variant="secondary" className="w-full justify-start" leftIcon={<Calendar className="w-4 h-4" />}>
                  Beratungstermin buchen
                </NotionButton>
                <NotionButton variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Live-Chat starten
                </NotionButton>
              </div>
            </NotionCard>

            {/* Social Links */}
            <NotionCard>
              <h3 className={styles.text('h3', 'mb-4')}>Folgen Sie uns</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-notion-bg-hover dark:bg-notion-dark-bg-hover rounded-lg flex items-center justify-center hover:bg-notion-blue hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-notion-bg-hover dark:bg-notion-dark-bg-hover rounded-lg flex items-center justify-center hover:bg-notion-blue hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </NotionCard>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <NotionCard>
              <h3 className={styles.text('h3', 'mb-6')}>Kontaktformular</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ihr Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue ${
                        errors.name ? 'border-notion-red' : 'border-notion-border dark:border-notion-dark-border'
                      }`}
                      placeholder="Max Mustermann"
                    />
                    {errors.name && (
                      <p className="text-notion-red text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue ${
                        errors.email ? 'border-notion-red' : 'border-notion-border dark:border-notion-dark-border'
                      }`}
                      placeholder="max@beispiel.de"
                    />
                    {errors.email && (
                      <p className="text-notion-red text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unternehmen *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue ${
                        errors.company ? 'border-notion-red' : 'border-notion-border dark:border-notion-dark-border'
                      }`}
                      placeholder="Beispiel GmbH"
                    />
                    {errors.company && (
                      <p className="text-notion-red text-xs mt-1">{errors.company}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Telefonnummer (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-notion-border dark:border-notion-dark-border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue"
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Betreff *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue ${
                      errors.subject ? 'border-notion-red' : 'border-notion-border dark:border-notion-dark-border'
                    }`}
                  >
                    <option value="">Bitte wählen...</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="text-notion-red text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ihre Nachricht *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg bg-notion-bg dark:bg-notion-dark-bg focus:outline-none focus:ring-2 focus:ring-notion-blue resize-none ${
                      errors.message ? 'border-notion-red' : 'border-notion-border dark:border-notion-dark-border'
                    }`}
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                  />
                  {errors.message && (
                    <p className="text-notion-red text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bevorzugte Kontaktart
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: 'email', label: 'E-Mail' },
                      { value: 'phone', label: 'Telefon' },
                      { value: 'video', label: 'Video-Call' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="contactPreference"
                          value={option.value}
                          checked={formData.contactPreference === option.value}
                          onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                          className="w-4 h-4 text-notion-blue focus:ring-notion-blue"
                        />
                        <span className="ml-2 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="w-4 h-4 text-notion-blue rounded focus:ring-notion-blue mt-0.5"
                  />
                  <label htmlFor="newsletter" className="ml-3 text-sm">
                    Ich möchte den monatlichen Newsletter mit KI-Insights und Best Practices erhalten
                  </label>
                </div>

                {/* Privacy Notice */}
                <div className="p-4 bg-notion-blue/5 border border-notion-blue/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-notion-blue mt-0.5 mr-3" />
                    <p className="text-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
                      Mit dem Absenden dieses Formulars stimmen Sie unserer{' '}
                      <a href="/privacy" className="text-notion-blue hover:underline">
                        Datenschutzerklärung
                      </a>{' '}
                      zu. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <NotionButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                  </NotionButton>
                </div>
              </form>
            </NotionCard>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <NotionCard gradient className="max-w-4xl mx-auto">
            <h3 className={styles.text('h3', 'mb-4')}>
              Bevorzugen Sie ein persönliches Gespräch?
            </h3>
            <p className="text-lg text-notion-text-secondary dark:text-notion-dark-text-secondary mb-6">
              Buchen Sie direkt einen 30-minütigen Beratungstermin mit unseren KI-Experten.
              Kostenlos und unverbindlich.
            </p>
            <NotionButton variant="primary" size="lg" leftIcon={<Calendar className="w-5 h-5" />}>
              Termin vereinbaren
            </NotionButton>
          </NotionCard>
        </div>
      </div>
    </div>
  )
}