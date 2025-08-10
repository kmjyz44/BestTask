
'use client'
import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>
export default function getStripe() {
  if (!stripePromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    stripePromise = loadStripe(pk)
  }
  return stripePromise
}
