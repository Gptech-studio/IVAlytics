import Link from 'next/link';
import { 
  PlayIcon,
  CalculatorIcon,
  ChartBarIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const demoFeatures = [
  {
    title: 'Wizard Guidato',
    description: 'Processo step-by-step per inserimento dati',
    icon: CalculatorIcon,
    demo: 'Inserimento dati personali → Selezione ATECO → Dati economici → Risultati'
  },
  {
    title: 'Suggerimenti ATECO Intelligenti',
    description: 'Sistema AI per suggerire codici più adatti',
    icon: LightBulbIcon,
    demo: 'Questionario intelligente con match personalizzati'
  },
  {
    title: 'Calcoli Precisi',
    description: 'Engine di calcolo per tutti i regimi fiscali',
    icon: ChartBarIcon,
    demo: 'IVA, IRPEF, IRES, Contributi INPS/INAIL, Addizionali'
  },
  {
    title: 'Risultati Dettagliati',
    description: 'Report completi con scadenze fiscali',
    icon: DocumentTextIcon,
    demo: 'Grafici, tabelle, esportazione PDF, calendario scadenze'
  }
];

const demoScenarios = [
  {
    title: 'Libero Professionista - Regime Forfettario',
    persona: 'Mario Rossi, Consulente IT',
    scenario: 'Ricavi: €45.000 - Costi: €8.000',
    results: {
      imposte: '€5.550 Imposta Sostitutiva (15%)',
      iva: '€0 (Esente)',
      contributi: '€8.880 INPS (sconto 50% primo anno)',
      totale: '€14.430'
    }
  },
  {
    title: 'Architetto - Regime Forfettario',
    persona: 'Giulia Bianchi, Architetto',
    scenario: 'Ricavi: €50.000 - Costi: €12.000',
    results: {
      imposte: '€5.700 Imposta Sostitutiva (15%)',
      iva: '€0 (Esente)',
      contributi: '€2.755 INARCASSA (sconto 50% primo anno)',
      totale: '€8.455'
    }
  },
  {
    title: 'Azienda - Regime Ordinario',
    persona: 'Tech Solutions SRL',
    scenario: 'Ricavi: €150.000 - Costi: €45.000',
    results: {
      ires: '€25.200 IRES (24%)',
      iva: '€23.100 IVA (22%)',
      irap: '€4.095 IRAP (3.9%)',
      addizionali: '€2.835 Addizionali Territoriali',
      totale: '€55.230'
    }
  },
  {
    title: 'E-commerce - Regime Semplificato',
    persona: 'Luca Verdi, Vendita Online',
    scenario: 'Ricavi: €80.000 - Costi: €25.000',
    results: {
      irpef: '€20.900 IRPEF (38%)',
      addizionali: '€1.485 Addizionali Territoriali',
      iva: '€12.100 IVA (22%)',
      contributi: '€13.750 INPS + INAIL',
      totale: '€48.235'
    }
  }
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold text-gradient">
                IVAlytics
              </Link>
              <p className="text-gray-600 mt-1">Demo Interattiva</p>
            </div>
            <Link href="/calcola" className="btn-primary">
              Inizia il Calcolo Reale
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Intro */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scopri IVAlytics in Azione
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Esplora le funzionalità principali attraverso scenari reali e vedi 
            come IVAlytics semplifica il calcolo di imposte e contributi.
          </p>
        </div>

        {/* Video Demo Placeholder */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-24 h-24 text-primary-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Video Demo
                </h3>
                <p className="text-gray-600 mb-6">
                  Guarda una panoramica completa delle funzionalità
                </p>
                <button className="btn-primary">
                  Guarda il Video Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Funzionalità Principali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {demoFeatures.map((feature, index) => (
              <div key={index} className="card card-hover">
                <div className="card-body">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <strong>Demo:</strong> {feature.demo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Scenari di Esempio
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {demoScenarios.map((scenario, index) => (
              <div key={index} className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-gray-900">
                    {scenario.title}
                  </h3>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Contribuente:</p>
                    <p className="font-medium text-gray-900">{scenario.persona}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Scenario:</p>
                    <p className="text-sm text-gray-900">{scenario.scenario}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Risultati:</p>
                    <div className="space-y-2">
                      {Object.entries(scenario.results).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className={`font-medium ${
                            key === 'totale' ? 'text-primary-600 font-semibold' : 'text-gray-900'
                          }`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="btn-outline w-full text-sm">
                      Prova questo Scenario
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Come Funziona
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Linea di connessione */}
              <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-primary-200 hidden md:block"></div>
              
              <div className="space-y-12">
                {[
                  {
                    step: 1,
                    title: 'Inserisci i tuoi dati',
                    description: 'Nome, codice fiscale, regime fiscale. Il sistema ti guida in ogni campo.',
                    features: ['Validazione automatica', 'Suggerimenti intelligenti', 'Privacy garantita']
                  },
                  {
                    step: 2,
                    title: 'Trova il codice ATECO',
                    description: 'Questionario smart o ricerca libera per identificare la tua attività.',
                    features: ['IA per suggerimenti', 'Database completo', 'Match personalizzati']
                  },
                  {
                    step: 3,
                    title: 'Dati economici',
                    description: 'Ricavi, costi, periodo. Anteprima calcolo in tempo reale.',
                    features: ['Calcolo istantaneo', 'Tutti i regimi', 'Opzioni avanzate']
                  },
                  {
                    step: 4,
                    title: 'Risultati completi',
                    description: 'Report dettagliato con scadenze, grafici e possibilità di export.',
                    features: ['Export PDF', 'Calendario fiscale', 'Condivisione']
                  }
                ].map((item, index) => (
                  <div key={index} className="relative flex items-start">
                    {/* Numero step */}
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                      {item.step}
                    </div>
                    
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.features.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-soft p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto per iniziare?
            </h3>
            <p className="text-gray-600 mb-6">
              Utilizza IVAlytics gratuitamente per calcolare le tue imposte e contributi. 
              Nessuna registrazione richiesta per la demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/calcola" className="btn-primary">
                Calcola le tue Imposte
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/" className="btn-outline">
                Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 