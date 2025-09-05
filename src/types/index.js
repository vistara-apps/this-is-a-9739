/**
 * @fileoverview Type definitions for Pocket Parley application
 * Using JSDoc for type definitions in JavaScript
 */

/**
 * @typedef {Object} User
 * @property {string} user_id - Unique user identifier
 * @property {string} email - User's email address
 * @property {'free'|'basic'|'premium'} subscription_status - Current subscription status
 * @property {string|null} stripe_customer_id - Stripe customer ID
 * @property {string|null} subscription_id - Stripe subscription ID
 * @property {string|null} subscription_end_date - Subscription end date
 * @property {string} created_at - Account creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} user_id - User ID reference
 * @property {'en'|'es'} language - Preferred language
 * @property {'light'|'dark'} theme - UI theme preference
 * @property {boolean} notifications_enabled - Notifications setting
 * @property {boolean} location_sharing_enabled - Location sharing setting
 * @property {boolean} auto_record_enabled - Auto recording setting
 * @property {boolean} emergency_contacts_alert - Emergency alerts setting
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} TrustedContact
 * @property {string} id - Unique contact identifier
 * @property {string} user_id - User ID reference
 * @property {string} name - Contact's name
 * @property {string|null} phone - Contact's phone number
 * @property {string|null} email - Contact's email address
 * @property {string|null} relationship - Relationship to user
 * @property {boolean} is_primary - Whether this is the primary contact
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} InteractionLog
 * @property {string} log_id - Unique log identifier
 * @property {string} user_id - User ID reference
 * @property {'traffic_stop'|'detention'|'arrest'|'questioning'|'other'} interaction_type - Type of interaction
 * @property {string} timestamp - Interaction timestamp
 * @property {number|null} location_lat - Latitude coordinate
 * @property {number|null} location_lng - Longitude coordinate
 * @property {string|null} location_city - City name
 * @property {string|null} location_state - State name
 * @property {string|null} location_address - Full address
 * @property {string|null} recording_url - URL to recording file
 * @property {string|null} notes - User notes about the interaction
 * @property {string|null} shared_summary_url - URL to shared summary
 * @property {'active'|'archived'|'deleted'} status - Log status
 * @property {string[]|null} rights_exercised - Array of rights exercised
 * @property {string[]|null} officer_badge_numbers - Array of officer badge numbers
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} RightsGuide
 * @property {string} guide_id - Unique guide identifier
 * @property {string} state - State name
 * @property {'traffic_stop'|'detention'|'arrest'|'questioning'|'other'} interaction_type - Type of interaction
 * @property {'en'|'es'} language - Language code
 * @property {RightsContent} content - Rights content object
 * @property {string} last_updated - Last update timestamp
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} RightsContent
 * @property {string[]} dos - Array of things to do
 * @property {string[]} donts - Array of things not to do
 * @property {string} summary - Brief summary
 * @property {string} detailedInfo - Detailed information
 */

/**
 * @typedef {Object} Script
 * @property {string} script_id - Unique script identifier
 * @property {string} scenario - Scenario name
 * @property {string} state - State name
 * @property {'en'|'es'} language - Language code
 * @property {ScriptItem[]} scripts - Array of script items
 * @property {string} last_updated - Last update timestamp
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} ScriptItem
 * @property {string} purpose - When to use this script
 * @property {string} text - The actual script text
 */

/**
 * @typedef {Object} InteractionSummary
 * @property {string} summary_id - Unique summary identifier
 * @property {string} log_id - Reference to interaction log
 * @property {string} summary_text - Summary content
 * @property {'en'|'es'} language - Language code
 * @property {string|null} share_token - Token for public sharing
 * @property {boolean} is_public - Whether summary is publicly accessible
 * @property {string|null} expires_at - Expiration timestamp
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} EmergencyAlert
 * @property {string} alert_id - Unique alert identifier
 * @property {string} user_id - User ID reference
 * @property {string|null} log_id - Reference to interaction log
 * @property {string} contact_id - Reference to trusted contact
 * @property {'interaction_started'|'emergency'|'location_update'} alert_type - Type of alert
 * @property {string|null} message - Alert message
 * @property {string|null} sent_at - When alert was sent
 * @property {'pending'|'sent'|'delivered'|'failed'} delivery_status - Delivery status
 * @property {string} created_at - Creation timestamp
 */

/**
 * @typedef {Object} Location
 * @property {number} lat - Latitude coordinate
 * @property {number} lng - Longitude coordinate
 * @property {number|null} accuracy - Location accuracy in meters
 * @property {string|null} city - City name
 * @property {string|null} state - State name
 * @property {string|null} country - Country name
 * @property {string|null} address - Full address
 * @property {string|null} postalCode - Postal code
 */

/**
 * @typedef {Object} RecordingData
 * @property {Blob} blob - Audio blob data
 * @property {string} url - Object URL for playback
 * @property {string} timestamp - Recording timestamp
 * @property {number|null} duration - Recording duration in seconds
 * @property {string|null} fileName - File name
 */

/**
 * @typedef {Object} SubscriptionPlan
 * @property {string} name - Plan name
 * @property {string} price - Price display string
 * @property {string} priceId - Stripe price ID
 * @property {string[]} features - Array of feature descriptions
 */

/**
 * @typedef {Object} AppState
 * @property {User|null} user - Current user
 * @property {boolean} isAuthenticated - Authentication status
 * @property {Subscription} subscription - Subscription details
 * @property {'en'|'es'} language - Current language
 * @property {'light'|'dark'} theme - Current theme
 * @property {Location|null} location - Current location
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Current error message
 * @property {InteractionLog|null} currentInteraction - Active interaction
 * @property {InteractionLog[]} interactionLogs - Interaction history
 * @property {boolean} isRecording - Recording state
 * @property {RecordingData|null} recordingData - Current recording
 * @property {TrustedContact[]} trustedContacts - Trusted contacts list
 * @property {Object.<string, RightsGuide>} rightsGuides - Cached rights guides
 * @property {Object.<string, Script>} scripts - Cached scripts
 */

/**
 * @typedef {Object} Subscription
 * @property {'free'|'basic'|'premium'} status - Subscription status
 * @property {string|null} plan - Plan name
 * @property {string|null} endDate - Subscription end date
 */

/**
 * @typedef {Object} FormValidationRule
 * @property {function(any, Object): string|null} validator - Validation function
 */

/**
 * @typedef {Object} FormState
 * @property {Object} values - Form values
 * @property {Object.<string, string|null>} errors - Validation errors
 * @property {Object.<string, boolean>} touched - Touched fields
 * @property {boolean} isValid - Overall form validity
 */

/**
 * @typedef {Object} APIResponse
 * @property {any} data - Response data
 * @property {Object|null} error - Error object if any
 * @property {boolean} success - Success status
 * @property {string|null} message - Response message
 */

/**
 * @typedef {Object} GeolocationPosition
 * @property {number} lat - Latitude
 * @property {number} lng - Longitude
 * @property {number} accuracy - Accuracy in meters
 * @property {number} timestamp - Position timestamp
 */

/**
 * @typedef {Object} MediaRecorderOptions
 * @property {boolean} audio - Enable audio recording
 * @property {boolean} video - Enable video recording
 * @property {string} mimeType - MIME type for recording
 */

/**
 * @typedef {Object} NotificationOptions
 * @property {string} title - Notification title
 * @property {string} body - Notification body
 * @property {string|null} icon - Notification icon URL
 * @property {string|null} tag - Notification tag
 * @property {boolean} requireInteraction - Require user interaction
 */

export {}
