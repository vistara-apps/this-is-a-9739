import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

/**
 * Stripe payment service for subscription management
 */
export const paymentService = {
  /**
   * Get Stripe instance
   * @returns {Promise<Stripe>}
   */
  async getStripe() {
    return await stripePromise
  },

  /**
   * Create a payment intent for subscription
   * @param {string} planId - Subscription plan ID
   * @param {string} userId - User ID
   * @returns {Promise<{clientSecret: string, error: any}>}
   */
  async createPaymentIntent(planId, userId) {
    try {
      // In a real app, this would call your backend API
      // For demo purposes, we'll simulate the response
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      return { clientSecret, error: null }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return { clientSecret: null, error }
    }
  },

  /**
   * Create a subscription
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @returns {Promise<{subscription: any, error: any}>}
   */
  async createSubscription(customerId, priceId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create subscription')
      }

      const subscription = await response.json()
      return { subscription, error: null }
    } catch (error) {
      console.error('Error creating subscription:', error)
      return { subscription: null, error }
    }
  },

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<{success: boolean, error: any}>}
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: false, error }
    }
  },

  /**
   * Get customer's subscription status
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<{subscription: any, error: any}>}
   */
  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const subscription = await response.json()
      return { subscription, error: null }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return { subscription: null, error }
    }
  },

  /**
   * Process payment with Stripe Elements
   * @param {Stripe} stripe - Stripe instance
   * @param {StripeElements} elements - Stripe elements
   * @param {string} clientSecret - Payment intent client secret
   * @returns {Promise<{success: boolean, error: any}>}
   */
  async processPayment(stripe, elements, clientSecret) {
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
        },
      })

      if (error) {
        return { success: false, error }
      }

      if (paymentIntent.status === 'succeeded') {
        return { success: true, error: null }
      }

      return { success: false, error: new Error('Payment not completed') }
    } catch (error) {
      console.error('Error processing payment:', error)
      return { success: false, error }
    }
  }
}

/**
 * Subscription plans configuration
 */
export const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: [
      'Basic rights information',
      'Limited state coverage',
      'Basic scripts (3 per month)',
      'Community support'
    ],
    isPopular: false,
    stripePriceId: null
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 100, // $1.00 in cents
    interval: 'monthly',
    features: [
      'Complete rights information',
      'All 50 states coverage',
      'Unlimited scripts',
      'Basic recording features',
      'Email support'
    ],
    isPopular: false,
    stripePriceId: 'price_basic_monthly'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 300, // $3.00 in cents
    interval: 'monthly',
    features: [
      'Everything in Basic',
      'Advanced recording features',
      'Unlimited interaction logs',
      'Priority AI generation',
      'Trusted contact alerts',
      'Priority support',
      'Legal resource library'
    ],
    isPopular: true,
    stripePriceId: 'price_premium_monthly'
  }
]

/**
 * Get plan by ID
 * @param {string} planId 
 * @returns {Object|null}
 */
export const getPlanById = (planId) => {
  return subscriptionPlans.find(plan => plan.id === planId) || null
}

/**
 * Format price for display
 * @param {number} priceInCents 
 * @returns {string}
 */
export const formatPrice = (priceInCents) => {
  if (priceInCents === 0) return 'Free'
  return `$${(priceInCents / 100).toFixed(2)}`
}

/**
 * Check if user has access to feature based on subscription
 * @param {string} subscriptionStatus 
 * @param {string} feature 
 * @returns {boolean}
 */
export const hasFeatureAccess = (subscriptionStatus, feature) => {
  const featureMap = {
    free: [
      'basic_rights',
      'limited_scripts',
      'basic_recording'
    ],
    basic: [
      'basic_rights',
      'complete_rights',
      'unlimited_scripts',
      'basic_recording',
      'all_states'
    ],
    premium: [
      'basic_rights',
      'complete_rights',
      'unlimited_scripts',
      'basic_recording',
      'advanced_recording',
      'unlimited_logs',
      'trusted_contacts',
      'priority_ai',
      'all_states'
    ]
  }

  const userFeatures = featureMap[subscriptionStatus] || featureMap.free
  return userFeatures.includes(feature)
}

/**
 * Mock backend API functions (replace with real API calls)
 */
export const mockApiService = {
  /**
   * Simulate creating a payment intent
   * @param {string} planId 
   * @param {string} userId 
   * @returns {Promise<{clientSecret: string}>}
   */
  async createPaymentIntent(planId, userId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const plan = getPlanById(planId)
    if (!plan || plan.price === 0) {
      throw new Error('Invalid plan for payment')
    }

    // Return mock client secret
    return {
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    }
  },

  /**
   * Simulate subscription creation
   * @param {string} customerId 
   * @param {string} priceId 
   * @returns {Promise<Object>}
   */
  async createSubscription(customerId, priceId) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      id: `sub_mock_${Date.now()}`,
      status: 'active',
      current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      customer: customerId,
      items: {
        data: [{
          price: {
            id: priceId
          }
        }]
      }
    }
  }
}
