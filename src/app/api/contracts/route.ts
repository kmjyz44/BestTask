
import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  // accept an offer and create contract
  const contract = await db.contract.create({
    data: {
      jobId: body.jobId,
      workerId: body.workerId,
      agreedPrice: body.agreedPrice
    }
  })
  return Response.json(contract, { status: 201 })
}
