
'use client'
import React, { useEffect, useState } from 'react'

type Suggestion = { place_name: string; center: [number, number] }

export default function MapboxAutocomplete({ onPick }:{ onPick: (addr:string, lat:number, lon:number)=>void }) {
  const [q, setQ] = useState('North Chicago, IL')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(()=>{
    const t = setTimeout(async ()=>{
      if (!q || !token) return
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}`
        const res = await fetch(url)
        const data = await res.json()
        const feats = (data.features||[]).slice(0,5).map((f:any)=>({ place_name: f.place_name, center: f.center }))
        setSuggestions(feats)
      } catch(e) { /* ignore */ }
    }, 300)
    return ()=>clearTimeout(t)
  }, [q, token])

  return (
    <div className="grid gap-2">
      <input className="border rounded-lg px-3 py-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Enter address or area" />
      {!!suggestions.length && (
        <div className="border rounded-lg divide-y">
          {suggestions.map((s, i)=>(
            <button key={i} type="button" onClick={()=>onPick(s.place_name, s.center[1], s.center[0])} className="text-left px-3 py-2 w-full hover:bg-gray-50">
              {s.place_name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
