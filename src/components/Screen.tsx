import type { ReactNode } from 'react'

type ScreenProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Screen({ title, subtitle, children }: ScreenProps) {
  return (
    <section className="page-card">
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
      {children}
    </section>
  )
}
