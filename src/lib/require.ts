
import { auth } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function requireUser() {
  const session = await auth()
  if (!session?.user) return null
  // hydrate role from DB to be safe
  const user = await db.user.findUnique({ where: { id: (session.user as any).id } })
  return user
}

export async function requireRole(role: 'CLIENT'|'WORKER'|'ADMIN') {
  const user = await requireUser()
  if (!user) return null
  if (user.role !== role) return null
  return user
}
