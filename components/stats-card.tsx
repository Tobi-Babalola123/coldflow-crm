import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  purple:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  orange:
    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-green-600 dark:text-green-400">{change} from last month</p>
      </div>
    </div>
  )
}
