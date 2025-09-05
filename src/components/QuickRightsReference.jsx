import { useState } from 'react'
import { Shield, MapPin, Lock } from 'lucide-react'
import Card from './Card'
import Button from './Button'

const QuickRightsReference = ({ location, language, isSubscribed, onUpgrade }) => {
  const [selectedScenario, setSelectedScenario] = useState('traffic-stop')

  const scenarios = {
    en: {
      'traffic-stop': 'Traffic Stop',
      'detention': 'Detention/Questioning',
      'search': 'Search Request',
      'arrest': 'Arrest'
    },
    es: {
      'traffic-stop': 'Parada de Tráfico',
      'detention': 'Detención/Interrogatorio',
      'search': 'Solicitud de Registro',
      'arrest': 'Arresto'
    }
  }

  const rightsContent = {
    en: {
      'traffic-stop': {
        dos: [
          'Keep your hands visible',
          'Provide license, registration, and insurance when requested',
          'Remain calm and polite',
          'You can ask if you are free to leave'
        ],
        donts: [
          "Don't reach for documents until asked",
          "Don't get out of the vehicle unless instructed",
          "Don't argue or resist",
          "Don't consent to searches without a warrant"
        ]
      },
      'detention': {
        dos: [
          'Ask "Am I free to leave?"',
          'Stay calm and keep hands visible',
          'Ask for a lawyer if arrested',
          'Remember details for later'
        ],
        donts: [
          "Don't answer questions without a lawyer",
          "Don't resist physically",
          "Don't lie or provide false information",
          "Don't consent to searches"
        ]
      }
    },
    es: {
      'traffic-stop': {
        dos: [
          'Mantenga las manos visibles',
          'Proporcione licencia, registro y seguro cuando se solicite',
          'Manténgase calmado y cortés',
          'Puede preguntar si es libre de irse'
        ],
        donts: [
          'No busque documentos hasta que se lo pidan',
          'No salga del vehículo a menos que se lo indiquen',
          'No discuta o se resista',
          'No consienta búsquedas sin una orden'
        ]
      },
      'detention': {
        dos: [
          'Pregunte "¿Soy libre de irme?"',
          'Manténgase calmado y mantenga las manos visibles',
          'Pida un abogado si es arrestado',
          'Recuerde detalles para más tarde'
        ],
        donts: [
          'No responda preguntas sin un abogado',
          'No se resista físicamente',
          'No mienta o proporcione información falsa',
          'No consienta búsquedas'
        ]
      }
    }
  }

  const content = rightsContent[language][selectedScenario] || rightsContent[language]['traffic-stop']

  return (
    <div className="space-y-6">
      <Card variant="highlighted">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-text-primary">
            {language === 'en' ? 'Quick Rights Reference' : 'Referencia Rápida de Derechos'}
          </h2>
        </div>

        {location && (
          <div className="flex items-center gap-2 mb-4 text-text-secondary">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {language === 'en' ? `Rights for ${location.state}` : `Derechos para ${location.state}`}
            </span>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            {language === 'en' ? 'Select Scenario:' : 'Seleccionar Escenario:'}
          </label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {Object.entries(scenarios[language]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-bold">✓</span>
              {language === 'en' ? "DO's" : "HACER"}
            </h3>
            <ul className="space-y-2">
              {content.dos.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-700 text-sm font-bold">✗</span>
              {language === 'en' ? "DON'Ts" : "NO HACER"}
            </h3>
            <ul className="space-y-2">
              {content.donts.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!isSubscribed && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md border">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-text-secondary" />
              <span className="text-sm font-medium text-text-secondary">
                {language === 'en' ? 'Premium Feature' : 'Función Premium'}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              {language === 'en' 
                ? 'Get detailed state-specific guidance and unlimited scenarios with Premium.'
                : 'Obtenga orientación detallada específica del estado y escenarios ilimitados con Premium.'
              }
            </p>
            <Button variant="secondary" size="sm" onClick={onUpgrade}>
              {language === 'en' ? 'Upgrade to Premium' : 'Actualizar a Premium'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default QuickRightsReference
