
import { PrismaClient, Role } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const admin = await db.user.upsert({
    where: { email: 'admin@besttask.local' },
    update: { role: 'ADMIN' },
    create: { email: 'admin@besttask.local', role: 'ADMIN', name: 'Admin' }
  })
  console.log('Seeded admin:', admin.email)
}

main().finally(() => db.$disconnect())
