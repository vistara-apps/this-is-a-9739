/**
 * Location service for geolocation and address resolution
 */
export const locationService = {
  /**
   * Get current position using browser geolocation API
   * @param {Object} options - Geolocation options
   * @returns {Promise<{location: Object, error: any}>}
   */
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }

    const finalOptions = { ...defaultOptions, ...options }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          location: null,
          error: new Error('Geolocation is not supported by this browser')
        })
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }
          resolve({ location, error: null })
        },
        (error) => {
          let errorMessage = 'Unknown geolocation error'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }

          resolve({
            location: null,
            error: new Error(errorMessage)
          })
        },
        finalOptions
      )
    })
  },

  /**
   * Watch position changes
   * @param {Function} callback - Callback function for position updates
   * @param {Object} options - Geolocation options
   * @returns {number} Watch ID for clearing the watch
   */
  watchPosition(callback, options = {}) {
    if (!navigator.geolocation) {
      callback({
        location: null,
        error: new Error('Geolocation is not supported by this browser')
      })
      return null
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    const finalOptions = { ...defaultOptions, ...options }

    return navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }
        callback({ location, error: null })
      },
      (error) => {
        callback({ location: null, error })
      },
      finalOptions
    )
  },

  /**
   * Clear position watch
   * @param {number} watchId - Watch ID returned by watchPosition
   */
  clearWatch(watchId) {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  },

  /**
   * Reverse geocode coordinates to get address information
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<{address: Object, error: any}>}
   */
  async reverseGeocode(lat, lng) {
    try {
      // Using a free geocoding service (replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )

      if (!response.ok) {
        throw new Error('Geocoding service unavailable')
      }

      const data = await response.json()
      
      const address = {
        city: data.city || data.locality || 'Unknown',
        state: data.principalSubdivision || 'Unknown',
        country: data.countryName || 'Unknown',
        countryCode: data.countryCode || 'Unknown',
        postalCode: data.postcode || null,
        address: data.localityInfo?.administrative?.[0]?.name || null,
        formattedAddress: `${data.city || data.locality || 'Unknown'}, ${data.principalSubdivision || 'Unknown'}`
      }

      return { address, error: null }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return { address: null, error }
    }
  },

  /**
   * Get location with address information
   * @param {Object} options - Geolocation options
   * @returns {Promise<{location: Object, error: any}>}
   */
  async getLocationWithAddress(options = {}) {
    try {
      const { location, error: positionError } = await this.getCurrentPosition(options)
      
      if (positionError || !location) {
        return { location: null, error: positionError }
      }

      const { address, error: geocodeError } = await this.reverseGeocode(location.lat, location.lng)
      
      const fullLocation = {
        ...location,
        ...address,
        hasAddress: !geocodeError
      }

      return { location: fullLocation, error: null }
    } catch (error) {
      return { location: null, error }
    }
  },

  /**
   * Get state from coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<{state: string, error: any}>}
   */
  async getStateFromCoordinates(lat, lng) {
    try {
      const { address, error } = await this.reverseGeocode(lat, lng)
      
      if (error || !address) {
        return { state: null, error: error || new Error('Unable to determine state') }
      }

      return { state: address.state, error: null }
    } catch (error) {
      return { state: null, error }
    }
  },

  /**
   * Check if coordinates are within a specific state/region
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} targetState - Target state name
   * @returns {Promise<{isWithin: boolean, error: any}>}
   */
  async isWithinState(lat, lng, targetState) {
    try {
      const { state, error } = await this.getStateFromCoordinates(lat, lng)
      
      if (error) {
        return { isWithin: false, error }
      }

      const isWithin = state?.toLowerCase().includes(targetState.toLowerCase()) || false
      return { isWithin, error: null }
    } catch (error) {
      return { isWithin: false, error }
    }
  },

  /**
   * Calculate distance between two points (in kilometers)
   * @param {number} lat1 - First point latitude
   * @param {number} lng1 - First point longitude
   * @param {number} lat2 - Second point latitude
   * @param {number} lng2 - Second point longitude
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  /**
   * Convert degrees to radians
   * @param {number} degrees 
   * @returns {number}
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  },

  /**
   * Format coordinates for display
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} precision - Decimal places
   * @returns {string}
   */
  formatCoordinates(lat, lng, precision = 6) {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`
  },

  /**
   * Get location permission status
   * @returns {Promise<string>} Permission status: 'granted', 'denied', 'prompt', or 'unsupported'
   */
  async getPermissionStatus() {
    if (!navigator.permissions || !navigator.geolocation) {
      return 'unsupported'
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return permission.state
    } catch (error) {
      return 'unknown'
    }
  },

  /**
   * Request location permission
   * @returns {Promise<{granted: boolean, error: any}>}
   */
  async requestPermission() {
    try {
      const { location, error } = await this.getCurrentPosition({ timeout: 5000 })
      
      if (error) {
        return { granted: false, error }
      }

      return { granted: true, error: null }
    } catch (error) {
      return { granted: false, error }
    }
  }
}

/**
 * US States mapping for validation and normalization
 */
export const US_STATES = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming',
  'DC': 'District of Columbia'
}

/**
 * Normalize state name
 * @param {string} stateName 
 * @returns {string}
 */
export const normalizeStateName = (stateName) => {
  if (!stateName) return 'Unknown'
  
  // Check if it's an abbreviation
  const upperState = stateName.toUpperCase()
  if (US_STATES[upperState]) {
    return US_STATES[upperState]
  }
  
  // Check if it's a full name
  const stateEntry = Object.entries(US_STATES).find(
    ([, fullName]) => fullName.toLowerCase() === stateName.toLowerCase()
  )
  
  return stateEntry ? stateEntry[1] : stateName
}
