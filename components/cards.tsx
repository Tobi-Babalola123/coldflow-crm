import { ReactNode } from 'react'

interface CardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Card({
  title,
  description,
  children,
  className = '',
}: CardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-lg p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
