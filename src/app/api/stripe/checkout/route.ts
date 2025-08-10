
import Stripe from 'stripe'
import { db } from '@/lib/prisma'

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return new Response('Stripe not configured', { status: 500 })
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })

  const { contractId } = await req.json()
  const contract = await db.contract.findUnique({ where: { id: contractId } })
  if (!contract) return new Response('Contract not found', { status: 404 })

  // In a real app, get worker's connected accountId from DB (profile table field)
  // For MVP demo, expect the connected account id passed in env (NOT for production)
  const connectedAccount = process.env.STRIPE_CONNECTED_ACCOUNT_ID || null

  const amount = contract.agreedPrice * 100 // USD cents
  const fee = Math.round(amount * 0.1) // 10% platform fee (example)

  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    description: `BestTask contract ${contractId}`
  }

  if (connectedAccount) {
    params.application_fee_amount = fee
    params.transfer_data = { destination: connectedAccount }
  }

  const intent = await stripe.paymentIntents.create(params)
  await db.payment.upsert({
    where: { contractId },
    create: { contractId, amount: amount, fee, status: intent.status, stripeIntentId: intent.id },
    update: { amount, fee, status: intent.status, stripeIntentId: intent.id }
  })

  return Response.json({ clientSecret: intent.client_secret })
}
