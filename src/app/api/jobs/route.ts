
import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma'

// Haversine distance (km)
function distanceKm(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (v:number)=>v*Math.PI/180
  const R=6371
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1)
  const a=Math.sin(dLat/2)**2+Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2
  return 2*R*Math.asin((a**0.5))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || undefined
  const maxKm = Number(searchParams.get('maxKm') || process.env.APP_DEFAULT_AREA_KM || 64)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  const where:any = {}
  if (q) where.OR = [
    { title: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } }
  ]

  const jobs = await db.job.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100
  })

  // Optional radius filter in JS (simple and OK for MVP volumes)
  let filtered = jobs
  if (lat && lon) {
    const latN = Number(lat), lonN = Number(lon)
    filtered = jobs.filter(j => (j.latitude!=null && j.longitude!=null) and (distanceKm(latN, lonN, j.latitude!, j.longitude!) <= maxKm))
  }

  return Response.json(filtered)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // TODO: auth check; for MVP allow open
  const job = await db.job.create({
    data: {
      clientId: body.clientId || 'anonymous', // replace with session user id in real app
      title: body.title,
      description: body.description,
      address: body.address ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      budgetType: body.budgetType ?? 'fixed',
      budgetMin: body.budgetMin ?? null,
      budgetMax: body.budgetMax ?? null
    }
  })
  return Response.json(job, { status: 201 })
}
