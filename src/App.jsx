import React, { useEffect } from 'react'
import { Shield, Mic, Share2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './stores/appStore'
import AppBar from './components/AppBar'
import Tabs from './components/Tabs'
import AlertBanner from './components/AlertBanner'
import QuickRightsReference from './components/QuickRightsReference'
import ScriptedResponses from './components/ScriptedResponses'
import IncidentRecording from './components/IncidentRecording'
import InteractionSummary from './components/InteractionSummary'
import SubscriptionModal from './components/SubscriptionModal'

function App() {
  const {
    activeTab,
    location,
    subscriptionStatus,
    showSubscriptionModal,
    language,
    isLoading,
    actions
  } = useAppStore()

  const isSubscribed = subscriptionStatus !== 'free'

  // Initialize app on mount
  useEffect(() => {
    actions.initialize()
  }, [actions])

  const tabs = [
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'scripts', label: 'Scripts', icon: Mic },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'summary', label: 'Summary', icon: Share2 }
  ]

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en'
    actions.setLanguage(newLanguage)
  }

  // Show loading screen during initialization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Pocket Parley...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(220 10% 100%)',
            color: 'hsl(220 15% 20%)',
            border: '1px solid hsl(220 10% 90%)',
            borderRadius: '10px',
            boxShadow: '0 4px 12px hsla(220, 10%, 20%, 0.1)'
          }
        }}
      />
      
      <AppBar 
        location={location}
        language={language}
        onLanguageToggle={toggleLanguage}
        onMenuToggle={() => {}} // Menu functionality can be added later
        isSubscribed={isSubscribed}
      />

      {!isSubscribed && (
        <AlertBanner 
          type="info"
          message="Get unlimited access to all features with Pocket Parley Premium"
          action="Upgrade Now"
          onAction={() => actions.toggleSubscriptionModal(true)}
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
          onTabChange={actions.setActiveTab}
          language={language}
        />

        <div className="mt-6">
          {activeTab === 'rights' && (
            <QuickRightsReference 
              location={location}
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => actions.toggleSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'scripts' && (
            <ScriptedResponses 
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => actions.toggleSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'record' && (
            <IncidentRecording 
              location={location}
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => actions.toggleSubscriptionModal(true)}
            />
          )}
          
          {activeTab === 'summary' && (
            <InteractionSummary 
              language={language}
              isSubscribed={isSubscribed}
              onUpgrade={() => actions.toggleSubscriptionModal(true)}
            />
          )}
        </div>
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => actions.toggleSubscriptionModal(false)}
          onSubscribe={(planId) => {
            actions.updateSubscriptionStatus(planId)
            actions.toggleSubscriptionModal(false)
          }}
          language={language}
        />
      )}
    </div>
  )
}

export default App
