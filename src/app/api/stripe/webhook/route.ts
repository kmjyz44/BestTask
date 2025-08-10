
import Stripe from 'stripe'
import { db } from '@/lib/prisma'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return new Response('Webhook secret not set', { status: 500 })
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

  const sig = (req.headers as any).get('stripe-signature') as string
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err:any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed' || event.type === 'payment_intent.processing') {
    const pi = event.data.object as Stripe.PaymentIntent
    await db.payment.updateMany({
      where: { stripeIntentId: pi.id },
      data: { status: pi.status }
    })
  }

  return Response.json({ received: true })
}

export const config = { api: { bodyParser: false } } as any
