import React, { useState } from 'react'
import { MessageSquare, Copy, Lock, Volume2 } from 'lucide-react'
import Card from './Card'
import Button from './Button'

const ScriptedResponses = ({ language, isSubscribed, onUpgrade }) => {
  const [selectedCategory, setSelectedCategory] = useState('traffic-stop')
  const [copiedScript, setCopiedScript] = useState(null)

  const categories = {
    en: {
      'traffic-stop': 'Traffic Stop',
      'questioning': 'Police Questioning',
      'search-request': 'Search Request',
      'arrest': 'During Arrest'
    },
    es: {
      'traffic-stop': 'Parada de Tráfico',
      'questioning': 'Interrogatorio Policial',
      'search-request': 'Solicitud de Registro',
      'arrest': 'Durante Arresto'
    }
  }

  const scripts = {
    en: {
      'traffic-stop': [
        {
          situation: 'When pulled over',
          script: 'Good [morning/afternoon/evening], officer. I understand you pulled me over. How can I help you today?'
        },
        {
          situation: 'Providing documents',
          script: 'I\'m reaching for my [license/registration/insurance] in my [wallet/glove compartment]. Is that okay?'
        },
        {
          situation: 'Declining to answer questions',
          script: 'Officer, I prefer to exercise my right to remain silent. Am I free to leave?'
        }
      ],
      'questioning': [
        {
          situation: 'Invoking right to remain silent',
          script: 'I invoke my right to remain silent and my right to an attorney. I do not consent to any searches.'
        },
        {
          situation: 'Asking if detained',
          script: 'Officer, am I being detained or am I free to leave?'
        }
      ]
    },
    es: {
      'traffic-stop': [
        {
          situation: 'Cuando lo detienen',
          script: 'Buenos [días/tardes/noches], oficial. Entiendo que me detuvo. ¿Cómo puedo ayudarle hoy?'
        },
        {
          situation: 'Proporcionando documentos',
          script: 'Voy a buscar mi [licencia/registro/seguro] en mi [billetera/guantera]. ¿Está bien?'
        },
        {
          situation: 'Negándose a responder preguntas',
          script: 'Oficial, prefiero ejercer mi derecho a permanecer en silencio. ¿Soy libre de irme?'
        }
      ],
      'questioning': [
        {
          situation: 'Invocando el derecho a permanecer en silencio',
          script: 'Invoco mi derecho a permanecer en silencio y mi derecho a un abogado. No consiento ningún registro.'
        },
        {
          situation: 'Preguntando si está detenido',
          script: 'Oficial, ¿estoy siendo detenido o soy libre de irme?'
        }
      ]
    }
  }

  const currentScripts = scripts[language][selectedCategory] || []

  const copyScript = (script, index) => {
    navigator.clipboard.writeText(script)
    setCopiedScript(index)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  const speakScript = (script) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script)
      utterance.lang = language === 'en' ? 'en-US' : 'es-ES'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-text-primary">
            {language === 'en' ? 'Scripted Responses' : 'Respuestas con Guión'}
          </h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            {language === 'en' ? 'Select Category:' : 'Seleccionar Categoría:'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {Object.entries(categories[language]).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {currentScripts.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <div className="mb-3">
                <h3 className="font-medium text-text-primary">{item.situation}</h3>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-3">
                <p className="text-text-primary leading-relaxed">{item.script}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyScript(item.script, index)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copiedScript === index 
                    ? (language === 'en' ? 'Copied!' : '¡Copiado!')
                    : (language === 'en' ? 'Copy' : 'Copiar')
                  }
                </Button>
                
                {isSubscribed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => speakScript(item.script)}
                    className="flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    {language === 'en' ? 'Speak' : 'Hablar'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
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
                ? 'Access unlimited scripts, audio playback, and personalized responses with Premium.'
                : 'Acceda a guiones ilimitados, reproducción de audio y respuestas personalizadas con Premium.'
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

export default ScriptedResponses