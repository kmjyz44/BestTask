
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignOutBtn } from '@/components/SignOutBtn'

export const metadata = {
  title: 'BestTask',
  description: 'Hire trusted local pros — fast. North Chicago + 40 miles.'
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const messages = await getMessages();
  const session = await auth();
  const user = session?.user as any | undefined
  return (
    <html lang="en">
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 bg-white/90 backdrop-blur border-b">
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
              <Link href="/" className="font-bold text-xl">BestTask</Link>
              <div className="ml-auto flex items-center gap-4 text-sm">
                <Link href="/client" className="px-3 py-1 rounded-md border">Client</Link>
                <Link href="/worker" className="px-3 py-1 rounded-md border">Worker</Link>
                <Link href="/admin"  className="px-3 py-1 rounded-md border">Admin</Link>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Hi, {user.email} ({user.role})</span>
                    <SignOutBtn />
                  </div>
                ) : (
                  <Link href="/(auth)/signin" className="px-3 py-1 rounded-md bg-gray-900 text-white">Sign in</Link>
                )}
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <footer className="border-t mt-10">
            <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
              © {new Date().getFullYear()} BestTask — North Chicago + 40 miles
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
