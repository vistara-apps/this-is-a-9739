import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import { locationService } from '../services/location'
import toast from 'react-hot-toast'

/**
 * Hook for managing location state and updates
 * @param {Object} options - Configuration options
 * @returns {Object} Location state and methods
 */
export const useLocation = (options = {}) => {
  const { autoRequest = false, watchPosition = false } = options
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState('unknown')
  const watchIdRef = useRef(null)

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { location: newLocation, error: locationError } = await locationService.getLocationWithAddress()
      
      if (locationError) {
        setError(locationError)
        setPermission('denied')
      } else {
        setLocation(newLocation)
        setPermission('granted')
      }
    } catch (err) {
      setError(err)
      setPermission('denied')
    } finally {
      setLoading(false)
    }
  }, [])

  const startWatching = useCallback(() => {
    if (watchIdRef.current) return

    watchIdRef.current = locationService.watchPosition(
      ({ location: newLocation, error: watchError }) => {
        if (watchError) {
          setError(watchError)
        } else {
          setLocation(newLocation)
        }
      }
    )
  }, [])

  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      locationService.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => {
    const checkPermission = async () => {
      const permissionStatus = await locationService.getPermissionStatus()
      setPermission(permissionStatus)
    }

    checkPermission()

    if (autoRequest) {
      requestLocation()
    }

    return () => {
      stopWatching()
    }
  }, [autoRequest, requestLocation, stopWatching])

  useEffect(() => {
    if (watchPosition && permission === 'granted') {
      startWatching()
    } else {
      stopWatching()
    }

    return () => {
      stopWatching()
    }
  }, [watchPosition, permission, startWatching, stopWatching])

  return {
    location,
    error,
    loading,
    permission,
    requestLocation,
    startWatching,
    stopWatching
  }
}

/**
 * Hook for managing media recording (audio/video)
 * @param {Object} options - Recording options
 * @returns {Object} Recording state and methods
 */
export const useMediaRecording = (options = {}) => {
  const { 
    audio = true, 
    video = false, 
    mimeType = 'audio/webm',
    onDataAvailable,
    onStop,
    onError
  } = options

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaBlob, setMediaBlob] = useState(null)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
          onDataAvailable?.(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setMediaBlob(blob)
        onStop?.(blob)
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.onerror = (event) => {
        const error = new Error(`Recording error: ${event.error}`)
        setError(error)
        onError?.(error)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      const error = new Error(`Failed to start recording: ${err.message}`)
      setError(error)
      onError?.(error)
    }
  }, [audio, video, mimeType, onDataAvailable, onStop, onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording, isPaused])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }, [isRecording, isPaused])

  const clearRecording = useCallback(() => {
    setMediaBlob(null)
    setRecordingTime(0)
    setError(null)
    chunksRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return {
    isRecording,
    isPaused,
    recordingTime,
    mediaBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording
  }
}

/**
 * Hook for managing form state with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Form state and methods
 */
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName]
    if (!rules) return null

    for (const rule of rules) {
      const error = rule(value, values)
      if (error) return error
    }
    return null
  }, [validationRules, values])

  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validate, validationRules, values])

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }, [errors])

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
  }, [])

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target
    const fieldValue = type === 'checkbox' ? checked : value
    setValue(name, fieldValue)
  }, [setValue])

  const handleBlur = useCallback((event) => {
    const { name, value } = event.target
    setFieldTouched(name, true)
    
    const error = validate(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validate, setFieldTouched])

  const handleSubmit = useCallback((onSubmit) => {
    return async (event) => {
      event.preventDefault()
      setIsSubmitting(true)

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {})
      setTouched(allTouched)

      const isValid = validateAll()
      
      if (isValid) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }

      setIsSubmitting(false)
    }
  }, [values, validationRules, validateAll])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset
  }
}

/**
 * Hook for debounced values
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for managing async operations
 * @param {Function} asyncFunction - Async function to execute
 * @returns {Object} Async state and execute function
 */
export const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  return { loading, error, data, execute }
}

/**
 * Hook for managing local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

/**
 * Hook for managing online/offline status
 * @returns {boolean} Online status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook for managing app store with toast notifications
 * @returns {Object} App store with enhanced methods
 */
export const useAppWithToast = () => {
  const store = useAppStore()

  const showSuccess = useCallback((message) => {
    toast.success(message)
  }, [])

  const showError = useCallback((message) => {
    toast.error(message)
  }, [])

  const showInfo = useCallback((message) => {
    toast(message)
  }, [])

  // Enhanced actions with toast notifications
  const enhancedActions = {
    ...store.actions,
    
    async signIn(email, password) {
      const result = await store.actions.signIn(email, password)
      if (result.success) {
        showSuccess('Successfully signed in!')
      } else {
        showError(result.error?.message || 'Failed to sign in')
      }
      return result
    },

    async signUp(email, password) {
      const result = await store.actions.signUp(email, password)
      if (result.success) {
        showSuccess('Account created successfully!')
      } else {
        showError(result.error?.message || 'Failed to create account')
      }
      return result
    },

    async requestLocation() {
      const result = await store.actions.requestLocation()
      if (result.success) {
        showSuccess('Location updated')
      } else {
        showError('Failed to get location')
      }
      return result
    },

    async createInteractionLog(logData) {
      const result = await store.actions.createInteractionLog(logData)
      if (result.success) {
        showSuccess('Interaction log saved')
      } else {
        showError('Failed to save interaction log')
      }
      return result
    }
  }

  return {
    ...store,
    actions: enhancedActions,
    showSuccess,
    showError,
    showInfo
  }
}
