
import Stripe from 'stripe'

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) return new Response('Stripe not configured', { status: 500 })
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: { transfers: { requested: true }, card_payments: { requested: true } }
  })
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: process.env.NEXTAUTH_URL + '/worker?onboarding=refresh',
    return_url: process.env.NEXTAUTH_URL + '/worker?onboarding=return',
    type: 'account_onboarding'
  })
  return Response.json({ accountId: account.id, url: link.url })
}
