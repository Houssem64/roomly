'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchParamsWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  return <>{children}</>
}