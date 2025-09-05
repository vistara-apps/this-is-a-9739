import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Users
  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Interaction logs
  getInteractionLogs: async (userId) => {
    const { data, error } = await supabase
      .from('interaction_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    return { data, error }
  },

  createInteractionLog: async (logData) => {
    const { data, error } = await supabase
      .from('interaction_logs')
      .insert(logData)
      .select()
      .single()
    return { data, error }
  },

  updateInteractionLog: async (logId, updates) => {
    const { data, error } = await supabase
      .from('interaction_logs')
      .update(updates)
      .eq('log_id', logId)
      .select()
      .single()
    return { data, error }
  },

  // Rights guides
  getRightsGuide: async (state, interactionType, language = 'en') => {
    const { data, error } = await supabase
      .from('rights_guides')
      .select('*')
      .eq('state', state)
      .eq('interaction_type', interactionType)
      .eq('language', language)
      .single()
    return { data, error }
  },

  // Scripts
  getScripts: async (scenario, state, language = 'en') => {
    const { data, error } = await supabase
      .from('scripts')
      .select('*')
      .eq('scenario', scenario)
      .eq('state', state)
      .eq('language', language)
      .single()
    return { data, error }
  },

  // Trusted contacts
  getTrustedContacts: async (userId) => {
    const { data, error } = await supabase
      .from('trusted_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
    return { data, error }
  },

  createTrustedContact: async (contactData) => {
    const { data, error } = await supabase
      .from('trusted_contacts')
      .insert(contactData)
      .select()
      .single()
    return { data, error }
  },

  updateTrustedContact: async (contactId, updates) => {
    const { data, error } = await supabase
      .from('trusted_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    return { data, error }
  },

  deleteTrustedContact: async (contactId) => {
    const { error } = await supabase
      .from('trusted_contacts')
      .delete()
      .eq('id', contactId)
    return { error }
  }
}

// Storage helpers
export const storage = {
  uploadRecording: async (userId, file, fileName) => {
    const filePath = `${userId}/${fileName}`
    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(filePath, file)
    return { data, error }
  },

  getRecordingUrl: async (filePath) => {
    const { data } = supabase.storage
      .from('recordings')
      .getPublicUrl(filePath)
    return data.publicUrl
  },

  deleteRecording: async (filePath) => {
    const { error } = await supabase.storage
      .from('recordings')
      .remove([filePath])
    return { error }
  }
}

export default supabase
