
import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId') || undefined
  const where:any = {}
  if (jobId) where.jobId = jobId

  const offers = await db.offer.findMany({
    where,
    orderBy: { id: 'desc' }
  })
  return Response.json(offers)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const offer = await db.offer.create({
    data: {
      jobId: body.jobId,
      workerId: body.workerId || 'worker_anon',
      price: body.price,
      note: body.note ?? null
    }
  })
  return Response.json(offer, { status: 201 })
}
