'use client'

import { Campaign } from '@/lib/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface CampaignChartProps {
  campaigns: Campaign[]
}

export function CampaignChart({ campaigns }: CampaignChartProps) {
  const data = campaigns.map((campaign) => ({
    name: campaign.name,
    sent: campaign.sentEmails,
    responses: campaign.responses,
    conversion: campaign.conversionRate,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="name"
          stroke="var(--color-muted-foreground)"
          style={{ fontSize: '0.875rem' }}
        />
        <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '0.875rem' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: 'var(--color-foreground)' }}
        />
        <Legend />
        <Bar dataKey="sent" fill="var(--color-primary)" name="Emails Sent" />
        <Bar dataKey="responses" fill="var(--color-chart-2)" name="Responses" />
      </BarChart>
    </ResponsiveContainer>
  )
}
