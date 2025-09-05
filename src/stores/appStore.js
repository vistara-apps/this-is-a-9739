import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, userService, interactionService } from '../services/supabase'
import { locationService } from '../services/location'
import { aiService } from '../services/openai'

/**
 * Main application store using Zustand
 */
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // User profile and subscription
      profile: null,
      subscriptionStatus: 'free',
      trustedContacts: [],

      // Location state
      location: null,
      locationError: null,
      locationPermission: 'unknown',

      // App settings
      language: 'en',
      theme: 'light',
      notifications: true,

      // Interaction logs
      interactionLogs: [],
      currentLog: null,

      // Rights and scripts cache
      rightsCache: {},
      scriptsCache: {},

      // UI state
      activeTab: 'rights',
      showSubscriptionModal: false,
      isRecording: false,

      // Actions
      actions: {
        // Authentication actions
        async signIn(email, password) {
          set({ isLoading: true })
          try {
            const { user, error } = await authService.signIn(email, password)
            if (error) throw error

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })

            // Load user profile
            await get().actions.loadProfile(user.id)
            return { success: true, error: null }
          } catch (error) {
            set({ isLoading: false })
            return { success: false, error }
          }
        },

        async signUp(email, password) {
          set({ isLoading: true })
          try {
            const { user, error } = await authService.signUp(email, password)
            if (error) throw error

            // Create initial profile
            await userService.createProfile({
              user_id: user.id,
              email: user.email,
              subscription_status: 'free',
              created_at: new Date().toISOString()
            })

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              subscriptionStatus: 'free'
            })

            return { success: true, error: null }
          } catch (error) {
            set({ isLoading: false })
            return { success: false, error }
          }
        },

        async signOut() {
          try {
            await authService.signOut()
            set({
              user: null,
              isAuthenticated: false,
              profile: null,
              trustedContacts: [],
              interactionLogs: [],
              currentLog: null,
              subscriptionStatus: 'free'
            })
            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        async loadProfile(userId) {
          try {
            const { data: profile, error } = await userService.getProfile(userId)
            if (error) throw error

            const { data: contacts } = await userService.getTrustedContacts(userId)

            set({ 
              profile,
              subscriptionStatus: profile?.subscription_status || 'free',
              trustedContacts: contacts || []
            })

            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        async updateProfile(updates) {
          const { user } = get()
          if (!user) return { success: false, error: new Error('Not authenticated') }

          try {
            const { data, error } = await userService.updateProfile(user.id, updates)
            if (error) throw error

            set({ profile: data })
            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        // Location actions
        async requestLocation() {
          set({ locationError: null })
          try {
            const { location, error } = await locationService.getLocationWithAddress()
            
            if (error) {
              set({ locationError: error })
              return { success: false, error }
            }

            set({ location, locationPermission: 'granted' })
            return { success: true, error: null }
          } catch (error) {
            set({ locationError: error, locationPermission: 'denied' })
            return { success: false, error }
          }
        },

        async checkLocationPermission() {
          const permission = await locationService.getPermissionStatus()
          set({ locationPermission: permission })
          return permission
        },

        // Rights and scripts actions
        async loadRightsGuide(state, interactionType, language = 'en') {
          const cacheKey = `${state}-${interactionType}-${language}`
          const cached = get().rightsCache[cacheKey]
          
          // Return cached version if available and recent (1 hour)
          if (cached && Date.now() - cached.timestamp < 3600000) {
            return { content: cached.content, error: null }
          }

          try {
            const { content, error } = await aiService.generateRightsGuide(state, interactionType, language)
            
            if (error) throw error

            // Cache the result
            set(state => ({
              rightsCache: {
                ...state.rightsCache,
                [cacheKey]: {
                  content,
                  timestamp: Date.now()
                }
              }
            }))

            return { content, error: null }
          } catch (error) {
            // Return fallback content on error
            const fallbackContent = get().actions.getFallbackRights(interactionType, language)
            return { content: fallbackContent, error }
          }
        },

        async loadScripts(scenario, state, language = 'en') {
          const cacheKey = `${scenario}-${state}-${language}`
          const cached = get().scriptsCache[cacheKey]
          
          if (cached && Date.now() - cached.timestamp < 3600000) {
            return { scripts: cached.scripts, error: null }
          }

          try {
            const { scripts, error } = await aiService.generateScripts(scenario, state, language)
            
            if (error) throw error

            set(state => ({
              scriptsCache: {
                ...state.scriptsCache,
                [cacheKey]: {
                  scripts,
                  timestamp: Date.now()
                }
              }
            }))

            return { scripts, error: null }
          } catch (error) {
            return { scripts: [], error }
          }
        },

        getFallbackRights(interactionType, language) {
          // Fallback rights content when AI is unavailable
          const fallbackContent = {
            en: {
              traffic_stop: {
                dos: [
                  "Keep your hands visible",
                  "Remain calm and respectful",
                  "Provide required documents",
                  "Follow lawful orders",
                  "Remember details"
                ],
                donts: [
                  "Don't make sudden movements",
                  "Don't argue",
                  "Don't consent to searches",
                  "Don't lie",
                  "Don't resist"
                ],
                summary: "Stay calm, comply with lawful orders, and exercise your rights respectfully.",
                detailedInfo: "You have the right to remain silent and refuse consent to search your vehicle without a warrant."
              }
            }
          }

          return fallbackContent[language]?.[interactionType] || fallbackContent.en.traffic_stop
        },

        // Interaction log actions
        async createInteractionLog(logData) {
          const { user } = get()
          if (!user) return { success: false, error: new Error('Not authenticated') }

          try {
            const log = {
              user_id: user.id,
              timestamp: new Date().toISOString(),
              ...logData
            }

            const { data, error } = await interactionService.createLog(log)
            if (error) throw error

            set(state => ({
              interactionLogs: [data, ...state.interactionLogs],
              currentLog: data
            }))

            return { success: true, data, error: null }
          } catch (error) {
            return { success: false, data: null, error }
          }
        },

        async loadInteractionLogs() {
          const { user } = get()
          if (!user) return { success: false, error: new Error('Not authenticated') }

          try {
            const { data, error } = await interactionService.getUserLogs(user.id)
            if (error) throw error

            set({ interactionLogs: data })
            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        async updateInteractionLog(logId, updates) {
          try {
            const { data, error } = await interactionService.updateLog(logId, updates)
            if (error) throw error

            set(state => ({
              interactionLogs: state.interactionLogs.map(log => 
                log.log_id === logId ? data : log
              ),
              currentLog: state.currentLog?.log_id === logId ? data : state.currentLog
            }))

            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        async deleteInteractionLog(logId) {
          try {
            const { error } = await interactionService.deleteLog(logId)
            if (error) throw error

            set(state => ({
              interactionLogs: state.interactionLogs.filter(log => log.log_id !== logId),
              currentLog: state.currentLog?.log_id === logId ? null : state.currentLog
            }))

            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        // Trusted contacts actions
        async addTrustedContact(contact) {
          const { user } = get()
          if (!user) return { success: false, error: new Error('Not authenticated') }

          try {
            const { data, error } = await userService.addTrustedContact(user.id, contact)
            if (error) throw error

            set(state => ({
              trustedContacts: [...state.trustedContacts, data]
            }))

            return { success: true, error: null }
          } catch (error) {
            return { success: false, error }
          }
        },

        // UI actions
        setActiveTab(tab) {
          set({ activeTab: tab })
        },

        setLanguage(language) {
          set({ language })
        },

        setTheme(theme) {
          set({ theme })
        },

        toggleSubscriptionModal(show) {
          set({ showSubscriptionModal: show })
        },

        setRecording(isRecording) {
          set({ isRecording })
        },

        updateSubscriptionStatus(status) {
          set({ subscriptionStatus: status })
        },

        // Initialize app
        async initialize() {
          set({ isLoading: true })
          
          try {
            // Check authentication
            const { user } = await authService.getCurrentUser()
            
            if (user) {
              set({ user, isAuthenticated: true })
              await get().actions.loadProfile(user.id)
              await get().actions.loadInteractionLogs()
            }

            // Check location permission
            await get().actions.checkLocationPermission()

            set({ isLoading: false })
          } catch (error) {
            console.error('App initialization error:', error)
            set({ isLoading: false })
          }
        }
      }
    }),
    {
      name: 'pocket-parley-store',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        notifications: state.notifications,
        subscriptionStatus: state.subscriptionStatus
      })
    }
  )
)
