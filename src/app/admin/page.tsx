
import { requireUser } from '@/lib/require'
import AdminClient from './ui'

export default async function AdminPage() {
  const user = await requireUser()
  if (!user) return <div>Please sign in</div>
  if (user.role !== 'ADMIN') return <div className="text-red-600">Admin only</div>
  return <AdminClient />
}
