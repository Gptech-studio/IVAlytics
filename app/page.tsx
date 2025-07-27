import Link from 'next/link';
import { 
  CalculatorIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Calcolo Automatico',
    description: 'Sistema intelligente per il calcolo preciso di imposte e contributi basato sul tuo regime fiscale.',
    icon: CalculatorIcon,
  },
  {
    name: 'Suggerimenti ATECO',
    description: 'Ti aiutiamo a trovare il codice ATECO più adatto alla tua attività con domande mirate.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Analisi Dettagliata',
    description: 'Visualizza grafici chiari e report dettagliati sui tuoi obblighi fiscali.',
    icon: ChartBarIcon,
  },
];

const benefits = [
  'Calcoli precisi e aggiornati alla normativa vigente',
  'Interfaccia semplice e guidata passo dopo passo',
  'Supporto per tutti i regimi fiscali',
  'Storico dei calcoli e scadenze personalizzate',
  'Esportazione in PDF per commercialista',
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container-custom py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="text-gradient">IVAlytics</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Calcola in modo <strong>semplice e preciso</strong> le tue imposte e contributi. 
              Sistema guidato con suggerimenti intelligenti per codici ATECO.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/calcola" className="btn-primary group">
                Inizia il Calcolo
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/demo" className="btn-outline">
                Vedi Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tutto quello che ti serve
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Un sistema completo per gestire i tuoi obblighi fiscali con la massima semplicità
            </p>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="card card-hover">
                <div className="card-body text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100">
                    <feature.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.name}</h3>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Perché scegliere IVAlytics?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Abbiamo progettato IVAlytics per semplificare la vita di liberi professionisti, 
                imprenditori e consulenti.
              </p>
              
              <ul className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-6 w-6 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Link href="/calcola" className="btn-primary">
                  Inizia Subito
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0">
              <div className="card">
                <div className="card-body p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-6">
                      <CalculatorIcon className="w-8 h-8 text-success-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Pronto in 3 minuti
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Inserisci i tuoi dati e ottieni immediatamente il calcolo completo
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>1. Dati anagrafici</span>
                        <span className="text-success-600">✓</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>2. Codice ATECO</span>
                        <span className="text-success-600">✓</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span>3. Ricavi e costi</span>
                        <span className="text-success-600">✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>4. Calcolo automatico</span>
                        <span className="text-success-600">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="container-custom py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Inizia oggi stesso
            </h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Non perdere più tempo con calcoli manuali. Prova IVAlytics e scopri 
              quanto può essere semplice gestire i tuoi obblighi fiscali.
            </p>
            <div className="mt-8">
              <Link href="/calcola" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
                Calcola le tue imposte
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 