import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      subscription: {
        status: 'free',
        plan: null,
        endDate: null
      },

      // App state
      language: 'en',
      theme: 'light',
      location: null,
      isLoading: false,
      error: null,

      // Interaction state
      currentInteraction: null,
      interactionLogs: [],
      isRecording: false,
      recordingData: null,

      // Trusted contacts
      trustedContacts: [],

      // Cache
      rightsGuides: {},
      scripts: {},

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setSubscription: (subscription) => set({ subscription }),
      
      setLanguage: (language) => set({ language }),
      
      setTheme: (theme) => set({ theme }),
      
      setLocation: (location) => set({ location }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Interaction actions
      startInteraction: (interactionData) => set({ 
        currentInteraction: {
          ...interactionData,
          timestamp: new Date().toISOString(),
          status: 'active'
        }
      }),

      updateInteraction: (updates) => set((state) => ({
        currentInteraction: state.currentInteraction 
          ? { ...state.currentInteraction, ...updates }
          : null
      })),

      endInteraction: () => set((state) => {
        if (state.currentInteraction) {
          return {
            currentInteraction: null,
            interactionLogs: [
              { ...state.currentInteraction, status: 'completed' },
              ...state.interactionLogs
            ]
          }
        }
        return state
      }),

      setInteractionLogs: (logs) => set({ interactionLogs: logs }),

      addInteractionLog: (log) => set((state) => ({
        interactionLogs: [log, ...state.interactionLogs]
      })),

      // Recording actions
      startRecording: () => set({ isRecording: true }),
      
      stopRecording: (recordingData) => set({ 
        isRecording: false, 
        recordingData 
      }),

      clearRecording: () => set({ recordingData: null }),

      // Trusted contacts actions
      setTrustedContacts: (contacts) => set({ trustedContacts: contacts }),

      addTrustedContact: (contact) => set((state) => ({
        trustedContacts: [...state.trustedContacts, contact]
      })),

      updateTrustedContact: (contactId, updates) => set((state) => ({
        trustedContacts: state.trustedContacts.map(contact =>
          contact.id === contactId ? { ...contact, ...updates } : contact
        )
      })),

      removeTrustedContact: (contactId) => set((state) => ({
        trustedContacts: state.trustedContacts.filter(contact => contact.id !== contactId)
      })),

      // Cache actions
      cacheRightsGuide: (key, guide) => set((state) => ({
        rightsGuides: { ...state.rightsGuides, [key]: guide }
      })),

      getRightsGuide: (state, interactionType, language) => {
        const key = `${state}-${interactionType}-${language}`
        return get().rightsGuides[key]
      },

      cacheScripts: (key, scripts) => set((state) => ({
        scripts: { ...state.scripts, [key]: scripts }
      })),

      getScripts: (scenario, state, language) => {
        const key = `${scenario}-${state}-${language}`
        return get().scripts[key]
      },

      // Reset actions
      reset: () => set({
        user: null,
        isAuthenticated: false,
        subscription: { status: 'free', plan: null, endDate: null },
        currentInteraction: null,
        interactionLogs: [],
        isRecording: false,
        recordingData: null,
        trustedContacts: [],
        rightsGuides: {},
        scripts: {},
        error: null
      }),

      // Utility actions
      isSubscribed: () => {
        const { subscription } = get()
        return subscription.status !== 'free'
      },

      hasFeature: (feature) => {
        const { subscription } = get()
        const features = {
          free: ['basic_rights', 'limited_scripts'],
          basic: ['basic_rights', 'unlimited_scripts', 'basic_recording', 'all_states'],
          premium: ['basic_rights', 'unlimited_scripts', 'advanced_recording', 'all_states', 'trusted_contacts', 'priority_ai', 'unlimited_logs']
        }
        return features[subscription.status]?.includes(feature) || false
      }
    }),
    {
      name: 'pocket-parley-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        subscription: state.subscription,
        trustedContacts: state.trustedContacts,
        rightsGuides: state.rightsGuides,
        scripts: state.scripts
      })
    }
  )
)

export default useAppStore
