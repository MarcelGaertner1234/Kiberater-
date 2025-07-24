import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns - KI-Beratungsplattform',
  description: 'Erfahren Sie mehr über unsere Mission, KI-Transformation für Unternehmen zugänglich zu machen.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
            Über uns
          </h1>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Unsere Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Wir machen KI-Transformation für jedes Unternehmen zugänglich. Von der ersten Bewertung 
              bis zur vollständigen Implementierung begleiten wir Sie auf Ihrem Weg zur digitalen 
              Transformation.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Unsere Plattform bietet strukturierte Assessments, individuelle Roadmaps und 
              direkten Zugang zu KI-Experten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Unsere Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Eine Welt, in der jedes Unternehmen die Vorteile der KI nutzen kann, 
                unabhängig von Größe oder technischer Expertise.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🚀 Unser Ansatz
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Strukturiert, praktisch und individuell. Wir entwickeln maßgeschneiderte 
                Lösungen, die zu Ihrem Unternehmen passen.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Warum KI-Beratungsplattform?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Datengetrieben
                </h4>
                <p className="text-gray-600">
                  Unsere Empfehlungen basieren auf bewährten Methoden und Datenanalyse.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Expertenteam
                </h4>
                <p className="text-gray-600">
                  Direkter Zugang zu erfahrenen KI-Beratern und Implementierungsexperten.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Schnell & Effizient
                </h4>
                <p className="text-gray-600">
                  Von der Bewertung zur Implementierung in Rekordzeit.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a 
              href="/contact" 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Kontaktieren Sie uns
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}