
import Link from 'next/link'
import MapboxAutocomplete from '@/components/MapboxAutocomplete'
import { requireUser } from '@/lib/require'

export default async function ClientPage() {
  const user = await requireUser()
  if (!user) return <div className="grid gap-3"><div>Please <Link href="/(auth)/signin" className="underline">sign in</Link> to post a job.</div></div>

  return (
    <ClientForm />
  )
}

'use client'
import React, { useState } from 'react'

function ClientForm() {
  const [title, setTitle] = useState('Mount TV on wall')
  const [desc, setDesc] = useState('Need help mounting a 55-inch TV in living room.')
  const [budgetType, setBudgetType] = useState('fixed')
  const [budget, setBudget] = useState(120)
  const [address, setAddress] = useState('North Chicago, IL')
  const [lat, setLat] = useState<number | undefined>(42.3256)
  const [lon, setLon] = useState<number | undefined>(-87.8412)

  async function submit() {
    await fetch('/api/jobs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, description: desc, budgetType, budgetMin: budget, budgetMax: budget, address, latitude: lat, longitude: lon })
    })
    alert('Job posted. Check Admin -> Jobs.')
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Post a job</h2>
      <div className="grid gap-3 max-w-xl">
        <input className="border rounded-lg px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <textarea className="border rounded-lg px-3 py-2" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2" value={budgetType} onChange={e=>setBudgetType(e.target.value)}>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
          </select>
          <input type="number" className="border rounded-lg px-3 py-2 w-32" value={budget} onChange={e=>setBudget(Number(e.target.value))} placeholder="$" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-gray-600">Address search (Mapbox)</label>
          <MapboxAutocomplete onPick={(addr, lat, lon)=>{ setAddress(addr); setLat(lat); setLon(lon) }} />
          <div className="text-xs text-gray-500">Chosen: {address} (lat: {lat}, lon: {lon})</div>
        </div>
        <button onClick={submit} className="px-4 py-2 rounded-xl bg-gray-900 text-white w-fit">Post</button>
      </div>
      <Link href="/" className="text-sm underline">Back</Link>
    </div>
  )
}
