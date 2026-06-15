'use client'

import { useState } from 'react'
import { Card } from '@/components/cards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Mail,
} from 'lucide-react'

interface FollowUp {
  id: string
  leadName: string
  email: string
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
  lastContact: string
  attempts: number
}

const mockFollowUps: FollowUp[] = [
  {
    id: '1',
    leadName: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    dueDate: '2024-06-14',
    status: 'pending',
    lastContact: '2024-06-10',
    attempts: 1,
  },
  {
    id: '2',
    leadName: 'Emma Rodriguez',
    email: 'emma@datavizpro.com',
    dueDate: '2024-06-19',
    status: 'pending',
    lastContact: '2024-06-12',
    attempts: 1,
  },
  {
    id: '3',
    leadName: 'James Wilson',
    email: 'james@cloudfirst.com',
    dueDate: '2024-06-14',
    status: 'pending',
    lastContact: 'N/A',
    attempts: 0,
  },
  {
    id: '4',
    leadName: 'Michael Chen',
    email: 'michael@innovatelabs.com',
    dueDate: '2024-06-10',
    status: 'overdue',
    lastContact: '2024-06-08',
    attempts: 2,
  },
  {
    id: '5',
    leadName: 'Jessica Lee',
    email: 'jessica@futuretech.com',
    dueDate: '2024-06-13',
    status: 'overdue',
    lastContact: '2024-06-11',
    attempts: 1,
  },
]

const statusIcons = {
  pending: Clock,
  completed: CheckCircle,
  overdue: AlertCircle,
}

const statusColors = {
  pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState(mockFollowUps)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredFollowUps = selectedStatus
    ? followUps.filter((fu) => fu.status === selectedStatus)
    : followUps

  const overdueCount = followUps.filter((fu) => fu.status === 'overdue').length
  const pendingCount = followUps.filter((fu) => fu.status === 'pending').length
  const completedCount = followUps.filter((fu) => fu.status === 'completed')
    .length

  const handleMarkComplete = (id: string) => {
    setFollowUps(
      followUps.map((fu) =>
        fu.id === id ? { ...fu, status: 'completed' as const } : fu
      )
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Follow-ups</h1>
          <p className="text-muted-foreground mt-2">
            Manage your customer follow-up schedule
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Follow-up
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Due Today
            </p>
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">
              Pending follow-ups
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Overdue
            </p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {overdueCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Completed
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </p>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { value: null, label: 'All', count: followUps.length },
          {
            value: 'overdue',
            label: 'Overdue',
            count: overdueCount,
          },
          {
            value: 'pending',
            label: 'Pending',
            count: pendingCount,
          },
          {
            value: 'completed',
            label: 'Completed',
            count: completedCount,
          },
        ].map((status) => (
          <button
            key={status.value || 'all'}
            onClick={() => setSelectedStatus(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {filteredFollowUps.map((followUp) => {
          const StatusIcon = statusIcons[followUp.status]

          return (
            <Card key={followUp.id}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${statusColors[followUp.status]}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {followUp.leadName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {followUp.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {followUp.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {followUp.attempts} attempts
                    </span>
                  </div>

                  <Badge
                    variant="default"
                    className={statusColors[followUp.status]}
                  >
                    {followUp.status === 'pending'
                      ? 'Pending'
                      : followUp.status === 'overdue'
                        ? 'Overdue'
                        : 'Completed'}
                  </Badge>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    {followUp.status !== 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkComplete(followUp.id)}
                      >
                        Mark Done
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredFollowUps.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-foreground font-medium">No follow-ups found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedStatus === 'completed'
                ? 'You have no completed follow-ups'
                : 'Great job! You are all caught up'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
