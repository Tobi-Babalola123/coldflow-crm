export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone?: string
  status: 'new' | 'contacted' | 'interested' | 'qualified' | 'closed'
  lastContact?: string
  nextFollowUp?: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: 'cold-outreach' | 'follow-up' | 'proposal' | 'closing'
}

export interface Campaign {
  id: string
  name: string
  status: 'draft' | 'active' | 'completed'
  leadsCount: number
  sentEmails: number
  responses: number
  conversionRate: number
  createdAt: string
}

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    email: 'sarah@techcorp.com',
    phone: '+1 (555) 234-5678',
    status: 'interested',
    lastContact: '2024-06-10',
    nextFollowUp: '2024-06-17',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'InnovateLabs Inc',
    email: 'michael@innovatelabs.com',
    phone: '+1 (555) 345-6789',
    status: 'qualified',
    lastContact: '2024-06-08',
    nextFollowUp: '2024-06-15',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    company: 'DataViz Pro',
    email: 'emma@datavizpro.com',
    phone: '+1 (555) 456-7890',
    status: 'contacted',
    lastContact: '2024-06-12',
    nextFollowUp: '2024-06-19',
  },
  {
    id: '4',
    name: 'James Wilson',
    company: 'CloudFirst Systems',
    email: 'james@cloudfirst.com',
    phone: '+1 (555) 567-8901',
    status: 'new',
    lastContact: undefined,
    nextFollowUp: '2024-06-14',
  },
  {
    id: '5',
    name: 'Lisa Park',
    company: 'AI Innovations',
    email: 'lisa@aiinnovations.com',
    phone: '+1 (555) 678-9012',
    status: 'interested',
    lastContact: '2024-06-09',
    nextFollowUp: '2024-06-16',
  },
  {
    id: '6',
    name: 'David Martinez',
    company: 'Digital Transform Co',
    email: 'david@digitaltransform.com',
    phone: '+1 (555) 789-0123',
    status: 'closed',
    lastContact: '2024-06-05',
    nextFollowUp: undefined,
  },
  {
    id: '7',
    name: 'Jessica Lee',
    company: 'Future Tech Ventures',
    email: 'jessica@futuretech.com',
    phone: '+1 (555) 890-1234',
    status: 'contacted',
    lastContact: '2024-06-11',
    nextFollowUp: '2024-06-18',
  },
  {
    id: '8',
    name: 'Robert Anderson',
    company: 'Quantum Computing Corp',
    email: 'robert@quantumcomputing.com',
    phone: '+1 (555) 901-2345',
    status: 'qualified',
    lastContact: '2024-06-07',
    nextFollowUp: '2024-06-14',
  },
]

export const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    subject: 'Quick Question About {{company}}',
    content: `Hi {{name}},

I came across {{company}} and was impressed by your work in {{industry}}.

I think there might be a great fit between what we do and your business. Would you be open to a quick 15-minute call next week?

Best,
[Your Name]`,
    category: 'cold-outreach',
  },
  {
    id: '2',
    name: 'Follow-up - No Response',
    subject: 'Following up: {{subject}}',
    content: `Hi {{name}},

I wanted to follow up on my previous email. I know things get busy, but I genuinely think this could be valuable for {{company}}.

Are you available for a quick call this week?

Best,
[Your Name]`,
    category: 'follow-up',
  },
  {
    id: '3',
    name: 'Proposal',
    subject: 'Proposal for {{company}} - {{deal_name}}',
    content: `Hi {{name}},

Based on our conversation, I've prepared a customized proposal for {{company}} addressing {{pain_point}}.

I've attached the details and pricing. Do you have 15 minutes this week to go over it?

Best,
[Your Name]`,
    category: 'proposal',
  },
  {
    id: '4',
    name: 'Closing',
    subject: 'Moving Forward - {{company}}',
    content: `Hi {{name}},

Thanks for taking the time to review the proposal. We're excited about the opportunity to work with {{company}}.

Let's lock in a start date. How does {{date}} work for you?

Best,
[Your Name]`,
    category: 'closing',
  },
]

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Q2 Enterprise Outreach',
    status: 'active',
    leadsCount: 150,
    sentEmails: 127,
    responses: 31,
    conversionRate: 20.7,
    createdAt: '2024-04-01',
  },
  {
    id: '2',
    name: 'SaaS Product Launch',
    status: 'active',
    leadsCount: 200,
    sentEmails: 156,
    responses: 42,
    conversionRate: 22.5,
    createdAt: '2024-05-15',
  },
  {
    id: '3',
    name: 'Mid-Market Segment',
    status: 'completed',
    leadsCount: 100,
    sentEmails: 89,
    responses: 18,
    conversionRate: 18.0,
    createdAt: '2024-03-01',
  },
]

export const mockDashboardStats = {
  totalLeads: 850,
  newLeads: 34,
  activeConversations: 127,
  conversionRate: 18.5,
  emailsSentWeek: 234,
  averageResponseTime: '2.3 days',
  upcomingFollowUps: 42,
}
