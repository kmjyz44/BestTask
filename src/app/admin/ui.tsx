
'use client'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminClient() {
  const router = useRouter()
  const { data: jobs } = useSWR('/api/jobs', fetcher)

  async function loadOffers(jobId: string) {
    const res = await fetch('/api/offers?jobId=' + jobId)
    return res.json()
  }
  async function acceptAndPay(job:any) {
    const offers = await loadOffers(job.id)
    if (!offers.length) { alert('No offers for this job'); return }
    const offer = offers[0]
    const res = await fetch('/api/contracts', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ jobId: job.id, workerId: offer.workerId, agreedPrice: offer.price })
    })
    const contract = await res.json()
    router.push('/checkout/' + contract.id)
  }

  async function setRole(email: string, role: string) {
    const r = await fetch('/api/admin/set-role', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, role })
    })
    if (r.ok) alert('Role updated'); else alert('Failed')
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-semibold">Admin</h2>

      <div className="rounded-xl border p-4 grid gap-2 max-w-lg">
        <div className="font-medium">Set user role</div>
        <RoleForm onSubmit={setRole} />
      </div>

      <div className="rounded-xl border">
        <div className="p-4 border-b font-medium">Jobs</div>
        <div className="p-4 grid gap-3">
          {(jobs || []).map((j: any) => (
            <div key={j.id} className="border rounded-lg p-3">
              <div className="font-medium">{j.title}</div>
              <div className="text-sm text-gray-600">{j.description}</div>
              <div className="text-xs text-gray-500">Budget: {j.budgetType} ${j.budgetMin ?? ''}</div>
              <div className="text-xs text-gray-500">Geo: {j.latitude}, {j.longitude}</div>
              <button onClick={()=>acceptAndPay(j)} className="mt-3 px-3 py-1 rounded-lg bg-gray-900 text-white text-sm">Accept & Pay</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RoleForm({onSubmit}:{onSubmit:(email:string, role:string)=>void}) {
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('WORKER')
  return (
    <div className="flex gap-2">
      <input className="border rounded px-2 py-1" placeholder="user@email" value={email} onChange={e=>setEmail(e.target.value)} />
      <select className="border rounded px-2 py-1" value={role} onChange={e=>setRole(e.target.value)}>
        <option>CLIENT</option>
        <option>WORKER</option>
        <option>ADMIN</option>
      </select>
      <button onClick={()=>onSubmit(email, role)} className="px-3 py-1 rounded bg-gray-900 text-white">Save</button>
    </div>
  )
}
