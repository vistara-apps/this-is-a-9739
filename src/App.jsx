import { useState, useEffect } from 'react'
import { Shield, Mic, Share2 } from 'lucide-react'
import AppBar from './components/AppBar'
import Tabs from './components/Tabs'
import AlertBanner from './components/AlertBanner'
import QuickRightsReference from './components/QuickRightsReference'
import ScriptedResponses from './components/ScriptedResponses'
import IncidentRecording from './components/IncidentRecording'
import InteractionSummary from './components/InteractionSummary'
import SubscriptionModal from './components/SubscriptionModal'

function App() {
  const [activeTab, setActiveTab] = useState('rights')
  const [location, setLocation] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [language, setLanguage] = useState('en')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Mock location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            state: 'California', // Mock state for demo
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          setLocation({ state: 'Unknown', lat: null, lng: null })
        }
      )
    }
  }, [])

  const tabs = [
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'scripts', label: 'Scripts', icon: Mic },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'summary', label: 'Summary', icon: Share2 }
  ]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en')
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar 
        location={location}
        language={language}
        onLanguageToggle={toggleLanguage}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isSubscribed={isSubscribed}
      />

      {!isSubscribed && (
        <AlertBanner 
          type="info"
          message="Get unlimited access to all features with Pocket Parley Premium"
          action="Upgrade Now"
          onAction={() => setShowSubscriptionModal(true)}
        />
      )}

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            {language === 'en' ? 'Pocket Parley' : 'Pocket Parley'}
          </h1>
          <p className="text-text-secondary">
            {language === 'en' 
              ? 'Your rights, on call. Instant legal guidance in your pocket.'
              : 'Sus derechos, a su disposición. Orientación legal instantánea en su bolsillo.'
            }
          </p>
        </div>

        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
        />

        <div className="mt-6">
          {activeTab === 'rights' && (
            <QuickRightsReference 
              location={location}
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'scripts' && (
            <ScriptedResponses 
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'record' && (
            <IncidentRecording 
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'summary' && (
            <InteractionSummary 
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          )}
        </div>
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setIsSubscribed(true)
            setShowSubscriptionModal(false)
          }}
          language={language}
        />
      )}
    </div>
  )
}

export default App
