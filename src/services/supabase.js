import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Authentication service
 */
export const authService = {
  /**
   * Sign up a new user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: any, error: any}>}
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  /**
   * Sign in an existing user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{user: any, error: any}>}
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { user: data.user, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<{error: any}>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Get the current user
   * @returns {Promise<{user: any, error: any}>}
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      return { user: null, error }
    }
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
    return () => subscription.unsubscribe()
  }
}

/**
 * Database service for user profiles
 */
export const userService = {
  /**
   * Create a user profile
   * @param {Object} profile 
   * @returns {Promise<{data: any, error: any}>}
   */
  async createProfile(profile) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([profile])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get user profile by ID
   * @param {string} userId 
   * @returns {Promise<{data: any, error: any}>}
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Update user profile
   * @param {string} userId 
   * @param {Object} updates 
   * @returns {Promise<{data: any, error: any}>}
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Add trusted contact
   * @param {string} userId 
   * @param {Object} contact 
   * @returns {Promise<{data: any, error: any}>}
   */
  async addTrustedContact(userId, contact) {
    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .insert([{ user_id: userId, ...contact }])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get trusted contacts for user
   * @param {string} userId 
   * @returns {Promise<{data: any[], error: any}>}
   */
  async getTrustedContacts(userId) {
    try {
      const { data, error } = await supabase
        .from('trusted_contacts')
        .select('*')
        .eq('user_id', userId)
      return { data: data || [], error }
    } catch (error) {
      return { data: [], error }
    }
  }
}

/**
 * Database service for interaction logs
 */
export const interactionService = {
  /**
   * Create an interaction log
   * @param {Object} log 
   * @returns {Promise<{data: any, error: any}>}
   */
  async createLog(log) {
    try {
      const { data, error } = await supabase
        .from('interaction_logs')
        .insert([log])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get interaction logs for user
   * @param {string} userId 
   * @returns {Promise<{data: any[], error: any}>}
   */
  async getUserLogs(userId) {
    try {
      const { data, error } = await supabase
        .from('interaction_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
      return { data: data || [], error }
    } catch (error) {
      return { data: [], error }
    }
  },

  /**
   * Update interaction log
   * @param {string} logId 
   * @param {Object} updates 
   * @returns {Promise<{data: any, error: any}>}
   */
  async updateLog(logId, updates) {
    try {
      const { data, error } = await supabase
        .from('interaction_logs')
        .update(updates)
        .eq('log_id', logId)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Delete interaction log
   * @param {string} logId 
   * @returns {Promise<{error: any}>}
   */
  async deleteLog(logId) {
    try {
      const { error } = await supabase
        .from('interaction_logs')
        .delete()
        .eq('log_id', logId)
      return { error }
    } catch (error) {
      return { error }
    }
  }
}

/**
 * Storage service for file uploads
 */
export const storageService = {
  /**
   * Upload a file to storage
   * @param {string} bucket 
   * @param {string} path 
   * @param {File} file 
   * @returns {Promise<{data: any, error: any}>}
   */
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Get public URL for a file
   * @param {string} bucket 
   * @param {string} path 
   * @returns {string}
   */
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  /**
   * Delete a file from storage
   * @param {string} bucket 
   * @param {string} path 
   * @returns {Promise<{error: any}>}
   */
  async deleteFile(bucket, path) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      return { error }
    } catch (error) {
      return { error }
    }
  }
}
