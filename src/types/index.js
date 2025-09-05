/**
 * @typedef {Object} User
 * @property {string} userId - Unique user identifier
 * @property {string} email - User email address
 * @property {'free'|'basic'|'premium'} subscriptionStatus - Current subscription tier
 * @property {TrustedContact[]} trustedContacts - List of emergency contacts
 * @property {string} createdAt - Account creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} TrustedContact
 * @property {string} id - Contact identifier
 * @property {string} name - Contact name
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email address
 * @property {string} relationship - Relationship to user
 */

/**
 * @typedef {Object} InteractionLog
 * @property {string} logId - Unique log identifier
 * @property {string} userId - Associated user ID
 * @property {string} timestamp - Interaction timestamp
 * @property {Location} location - Interaction location
 * @property {string|null} recordingUrl - URL to recording file
 * @property {string} notes - User notes about interaction
 * @property {string|null} sharedSummaryUrl - URL to shared summary
 * @property {'traffic_stop'|'detention'|'arrest'|'questioning'|'other'} interactionType - Type of interaction
 * @property {string} status - Current status of the log
 */

/**
 * @typedef {Object} Location
 * @property {string} state - State/province name
 * @property {number|null} lat - Latitude coordinate
 * @property {number|null} lng - Longitude coordinate
 * @property {string|null} city - City name
 * @property {string|null} address - Full address
 */

/**
 * @typedef {Object} RightsGuide
 * @property {string} guideId - Unique guide identifier
 * @property {string} state - State/jurisdiction
 * @property {'traffic_stop'|'detention'|'arrest'|'questioning'|'other'} interactionType - Type of interaction
 * @property {RightsContent} content - Rights information content
 * @property {Script[]} scripts - Available scripts for this scenario
 * @property {string} lastUpdated - Last content update timestamp
 */

/**
 * @typedef {Object} RightsContent
 * @property {string[]} dos - List of recommended actions
 * @property {string[]} donts - List of actions to avoid
 * @property {string} summary - Brief rights summary
 * @property {string} detailedInfo - Detailed legal information
 */

/**
 * @typedef {Object} Script
 * @property {string} id - Script identifier
 * @property {string} scenario - Specific scenario name
 * @property {string} language - Language code (en, es)
 * @property {string} text - Script content
 * @property {string} purpose - Purpose/context of the script
 */

/**
 * @typedef {Object} SubscriptionPlan
 * @property {string} id - Plan identifier
 * @property {string} name - Plan name
 * @property {number} price - Monthly price in cents
 * @property {'monthly'|'yearly'} interval - Billing interval
 * @property {string[]} features - List of included features
 * @property {boolean} isPopular - Whether this is the popular choice
 */

/**
 * @typedef {Object} PaymentIntent
 * @property {string} id - Stripe payment intent ID
 * @property {string} clientSecret - Client secret for payment
 * @property {number} amount - Amount in cents
 * @property {string} currency - Currency code
 * @property {string} status - Payment status
 */

export {};
