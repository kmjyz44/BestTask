
import { NextRequest } from 'next/server'
import { db } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  // Only admin can set roles
  if ((session as any)?.user?.role !== 'ADMIN') return new Response('Forbidden', { status: 403 })

  const { email, role } = await req.json()
  if (!email || !role) return new Response('Bad request', { status: 400 })
  await db.user.update({ where: { email }, data: { role } as any })
  return Response.json({ ok: true })
}
