import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const createCheckoutSession = async (priceId, userId) => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate the flow
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      }),
    })

    const session = await response.json()
    
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export const createPortalSession = async (customerId) => {
  try {
    // In a real app, this would call your backend API
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    })

    const session = await response.json()
    window.location.href = session.url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    price: '$1/month',
    priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      'Complete rights information',
      'All 50 states coverage',
      'Unlimited scripts',
      'Basic recording features',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    price: '$3/month',
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Basic',
      'Advanced recording features',
      'Unlimited interaction logs',
      'Priority AI generation',
      'Trusted contact alerts',
      'Priority support',
      'Legal resource library'
    ]
  }
}

export default stripePromise
