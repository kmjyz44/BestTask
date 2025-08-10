
'use client'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  return (
    <div className="grid gap-4 max-w-sm">
      <h2 className="text-2xl font-semibold">Sign in</h2>
      <button onClick={()=>signIn('email')} className="px-4 py-2 rounded-xl border w-fit">Sign in with Email</button>
      <button onClick={()=>signIn('google')} className="px-4 py-2 rounded-xl border w-fit">Sign in with Google</button>
      <p className="text-xs text-gray-500">Email sign-in uses SMTP settings. In Docker demo, check Mailhog at :8025.</p>
    </div>
  )
}
