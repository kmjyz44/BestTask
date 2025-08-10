
import { requireUser } from '@/lib/require'
import Link from 'next/link'

export default async function WorkerPage() {
  const user = await requireUser()
  if (!user) return <div className="grid gap-3"><div>Please <Link href="/(auth)/signin" className="underline">sign in</Link> as a worker.</div></div>
  if (user.role !== 'WORKER') return <div className="text-red-600">Access denied. Your role is {user.role}. Ask admin to set WORKER.</div>

  return <WorkerClient />
}

'use client'
import React, { useState } from 'react'

function WorkerClient() {
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null)
  const [jobId, setJobId] = useState('')
  const [price, setPrice] = useState(100)

  async function createStripeAccount() {
    const res = await fetch('/api/stripe/connect', { method: 'POST' })
    const data = await res.json()
    setOnboardingUrl(data.url)
  }

  async function createOffer() {
    await fetch('/api/offers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ jobId, price })
    })
    alert('Offer sent.')
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Worker dashboard</h2>
      <div className="grid gap-3 max-w-xl">
        <button onClick={createStripeAccount} className="px-4 py-2 rounded-xl border w-fit">Start Stripe onboarding</button>
        {onboardingUrl && <a href={onboardingUrl} className="underline text-blue-600" target="_blank">Open onboarding link</a>}

        <div className="pt-4 font-medium">Send offer</div>
        <input className="border rounded-lg px-3 py-2" placeholder="Job ID" value={jobId} onChange={e=>setJobId(e.target.value)} />
        <input type="number" className="border rounded-lg px-3 py-2 w-40" placeholder="Price" value={price} onChange={e=>setPrice(Number(e.target.value))} />
        <button onClick={createOffer} className="px-4 py-2 rounded-xl bg-gray-900 text-white w-fit">Send</button>
      </div>
    </div>
  )
}
