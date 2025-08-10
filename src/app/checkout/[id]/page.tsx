
'use client'
import React, { useEffect, useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import getStripe from '@/lib/stripe-client'
import { useRouter } from 'next/navigation'

function CheckoutForm({clientSecret}:{clientSecret:string}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onPay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError(null)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/checkout/success' },
      redirect: 'if_required'
    })
    setLoading(false)
    if (error) setError(error.message || 'Payment failed')
    else if (paymentIntent?.status === 'succeeded') router.push('/checkout/success')
  }

  return (
    <form onSubmit={onPay} className="grid gap-4 max-w-lg">
      <PaymentElement />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button disabled={loading || !stripe || !elements} className="px-4 py-2 rounded-xl bg-gray-900 text-white w-fit">
        {loading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId: params.id })
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
    })()
  }, [params.id])

  if (!clientSecret) return <div>Loading checkout...</div>

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Checkout</h2>
      <Elements stripe={getStripe()} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  )
}
