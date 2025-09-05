import { Crown, Check } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const SubscriptionModal = ({ onClose, onSubscribe, language }) => {
  const features = {
    en: [
      'Unlimited state-specific rights guidance',
      'Complete scripted responses library',
      'Secure incident recording & storage',
      'Emergency contact alerts',
      'Professional interaction summaries',
      'Multi-language support',
      'Priority customer support'
    ],
    es: [
      'Orientación ilimitada de derechos específicos del estado',
      'Biblioteca completa de respuestas con guión',
      'Grabación y almacenamiento seguro de incidentes',
      'Alertas de contacto de emergencia',
      'Resúmenes profesionales de interacción',
      'Soporte multiidioma',
      'Atención al cliente prioritaria'
    ]
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={language === 'en' ? 'Upgrade to Premium' : 'Actualizar a Premium'}
      className="max-w-lg"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {language === 'en' ? 'Pocket Parley Premium' : 'Pocket Parley Premium'}
        </h3>
        <p className="text-text-secondary">
          {language === 'en' 
            ? 'Get full access to all legal protection features'
            : 'Obtenga acceso completo a todas las funciones de protección legal'
          }
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">$3</div>
          <div className="text-text-secondary">
            {language === 'en' ? 'per month' : 'por mes'}
          </div>
        </div>

        <div className="space-y-3">
          {features[language].map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-text-primary">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={onSubscribe}
          className="w-full"
        >
          {language === 'en' ? 'Start Premium Trial' : 'Iniciar Prueba Premium'}
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-text-secondary">
            {language === 'en' 
              ? '7-day free trial, then $3/month. Cancel anytime.'
              : 'Prueba gratuita de 7 días, luego $3/mes. Cancele en cualquier momento.'
            }
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-text-primary mb-2">
            {language === 'en' ? 'Basic Plan - $1/month' : 'Plan Básico - $1/mes'}
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• {language === 'en' ? 'Basic rights reference' : 'Referencia básica de derechos'}</li>
            <li>• {language === 'en' ? 'Limited scripts' : 'Guiones limitados'}</li>
            <li>• {language === 'en' ? 'No recording features' : 'Sin funciones de grabación'}</li>
          </ul>
          <Button
            variant="outline"
            onClick={onSubscribe}
            className="w-full mt-3"
            size="sm"
          >
            {language === 'en' ? 'Choose Basic' : 'Elegir Básico'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SubscriptionModal
