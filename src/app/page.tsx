
'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Page() {
  const t = useTranslations()
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border p-8 bg-gradient-to-br from-gray-50 to-white">
        <h1 className="text-3xl font-bold mb-2">{t('brand')}</h1>
        <p className="text-gray-600">{t('hero_blurb')}</p>
        <p className="mt-1 text-xs text-gray-500">{t('north_area')}</p>
        <div className="mt-6 flex gap-3">
          <Link href="/client" className="px-4 py-2 rounded-xl bg-gray-900 text-white">{t('cta_post_job')}</Link>
          <Link href="/worker" className="px-4 py-2 rounded-xl border">{t('cta_find_work')}</Link>
        </div>
      </div>
    </div>
  )
}
