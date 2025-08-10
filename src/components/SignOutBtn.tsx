
'use client'
import { signOut } from 'next-auth/react'

export function SignOutBtn() {
  return <button onClick={()=>signOut()} className="px-2 py-1 text-xs rounded border">Sign out</button>
}
