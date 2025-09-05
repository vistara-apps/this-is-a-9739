import { useState, useRef } from 'react'
import { Video, Mic, Square, Phone, MapPin, Clock, Lock } from 'lucide-react'
import Card from './Card'
import Button from './Button'
import AlertBanner from './AlertBanner'

const IncidentRecording = ({ language, isSubscribed, onUpgrade }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState('audio')
  const [recordingTime, setRecordingTime] = useState(0)
  const [savedRecordings, setSavedRecordings] = useState([])
  const [emergencyContact, setEmergencyContact] = useState('')
  const intervalRef = useRef(null)

  const startRecording = () => {
    if (!isSubscribed) {
      onUpgrade()
      return
    }

    setIsRecording(true)
    setRecordingTime(0)
    
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)

    // Mock recording start
    console.log(`Started ${recordingType} recording`)
  }

  const stopRecording = () => {
    setIsRecording(false)
    clearInterval(intervalRef.current)

    // Save mock recording
    const newRecording = {
      id: Date.now(),
      type: recordingType,
      duration: recordingTime,
      timestamp: new Date().toISOString(),
      location: 'Mock Location'
    }

    setSavedRecordings(prev => [newRecording, ...prev])
    setRecordingTime(0)
  }

  const alertEmergencyContact = () => {
    if (!emergencyContact) {
      alert(language === 'en' 
        ? 'Please set an emergency contact first.' 
        : 'Por favor, establezca un contacto de emergencia primero.'
      )
      return
    }

    // Mock emergency alert
    alert(language === 'en'
      ? `Emergency alert sent to ${emergencyContact}!`
      : `¡Alerta de emergencia enviada a ${emergencyContact}!`
    )
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card variant="highlighted">
        <div className="flex items-center gap-3 mb-6">
          <Video className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-text-primary">
            {language === 'en' ? 'Incident Recording' : 'Grabación de Incidente'}
          </h2>
        </div>

        {!isSubscribed && (
          <AlertBanner
            type="warning"
            message={language === 'en' 
              ? 'Recording features require Premium subscription for legal compliance and secure storage.'
              : 'Las funciones de grabación requieren suscripción Premium para cumplimiento legal y almacenamiento seguro.'
            }
          />
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {language === 'en' ? 'Recording Controls' : 'Controles de Grabación'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                {language === 'en' ? 'Recording Type:' : 'Tipo de Grabación:'}
              </label>
              <div className="flex gap-2">
                <Button
                  variant={recordingType === 'audio' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setRecordingType('audio')}
                  disabled={isRecording}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Audio' : 'Audio'}
                </Button>
                <Button
                  variant={recordingType === 'video' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setRecordingType('video')}
                  disabled={isRecording}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Video' : 'Video'}
                </Button>
              </div>
            </div>

            <div className="text-center">
              {isRecording ? (
                <div className="space-y-4">
                  <div className="text-4xl font-mono text-red-600">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      {language === 'en' ? 'Recording...' : 'Grabando...'}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={stopRecording}
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    {language === 'en' ? 'Stop Recording' : 'Detener Grabación'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startRecording}
                  className="flex items-center gap-2"
                >
                  {recordingType === 'audio' ? <Mic className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  {language === 'en' ? 'Start Recording' : 'Iniciar Grabación'}
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {language === 'en' ? 'Emergency Contact' : 'Contacto de Emergencia'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                {language === 'en' ? 'Phone Number:' : 'Número de Teléfono:'}
              </label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder={language === 'en' ? '+1 (555) 123-4567' : '+1 (555) 123-4567'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button
              variant="secondary"
              onClick={alertEmergencyContact}
              disabled={!isSubscribed}
              className="w-full flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              {language === 'en' ? 'Alert Contact' : 'Alertar Contacto'}
            </Button>

            {!isSubscribed && (
              <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {language === 'en' ? 'Premium feature' : 'Función Premium'}
              </p>
            )}
          </div>
        </div>
      </Card>

      {savedRecordings.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            {language === 'en' ? 'Saved Recordings' : 'Grabaciones Guardadas'}
          </h3>

          <div className="space-y-3">
            {savedRecordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  {recording.type === 'audio' ? <Mic className="h-4 w-4 text-primary" /> : <Video className="h-4 w-4 text-primary" />}
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {recording.type === 'audio' 
                        ? (language === 'en' ? 'Audio Recording' : 'Grabación de Audio')
                        : (language === 'en' ? 'Video Recording' : 'Grabación de Video')
                      }
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(recording.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recording.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">
                  {formatDate(recording.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default IncidentRecording
