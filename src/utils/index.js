// Date and time utilities
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date))
}

export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date))
}

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export const getRelativeTime = (date) => {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now - target) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(date)
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

export const isValidPassword = (password) => {
  return password.length >= 8
}

export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required'
  }
  return null
}

export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!isValidEmail(email)) return 'Please enter a valid email address'
  return null
}

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required'
  if (!isValidPhone(phone)) return 'Please enter a valid phone number'
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (!isValidPassword(password)) return 'Password must be at least 8 characters long'
  return null
}

// String utilities
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str, length = 100) => {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export const unique = (array, key) => {
  if (!key) return [...new Set(array)]
  
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

// Object utilities
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const isEmpty = (value) => {
  if (value == null) return true
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// URL utilities
export const getQueryParams = (url = window.location.search) => {
  return Object.fromEntries(new URLSearchParams(url))
}

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

export const isAudioFile = (filename) => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'webm', 'm4a', 'aac']
  const extension = getFileExtension(filename).toLowerCase()
  return audioExtensions.includes(extension)
}

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Storage utilities
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error setting localStorage item:', error)
  }
}

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error getting localStorage item:', error)
    return defaultValue
  }
}

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage item:', error)
  }
}

// Async utilities
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const retry = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        await delay(delayMs * attempt)
      }
    }
  }
  
  throw lastError
}

// Device utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export const isAndroid = () => {
  return /Android/.test(navigator.userAgent)
}

// Clipboard utilities
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (fallbackError) {
      console.error('Failed to copy text:', fallbackError)
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Error utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error?.message) return error.error.message
  return 'An unexpected error occurred'
}

export const isNetworkError = (error) => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('network') ||
         error?.message?.includes('fetch')
}
