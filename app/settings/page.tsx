'use client'

import { useState } from 'react'
import { Card } from '@/components/cards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bell,
  Lock,
  Users,
  Palette,
  Mail as MailIcon,
  LogOut,
  ChevronRight,
} from 'lucide-react'

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    icon: Users,
    description: 'Manage your account information',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Control how you receive updates',
  },
  {
    id: 'email',
    title: 'Email Configuration',
    icon: MailIcon,
    description: 'Setup your email integration',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Palette,
    description: 'Customize your dashboard theme',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: Lock,
    description: 'Manage security settings',
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{section.title}</p>
                    <p className="text-xs opacity-75 hidden sm:block">
                      {section.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <>
              <Card title="Personal Information">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      defaultValue="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <Input
                      type="text"
                      placeholder="Your Company"
                      defaultValue="ColdFlow Solutions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <Input
                      type="text"
                      placeholder="Sales Manager"
                      defaultValue="Sales Manager"
                    />
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <>
              <Card title="Email Notifications">
                <div className="space-y-4">
                  {[
                    {
                      id: 'new-leads',
                      label: 'New leads added',
                      description: 'Get notified when new leads are added',
                    },
                    {
                      id: 'follow-ups',
                      label: 'Follow-up reminders',
                      description: 'Receive daily reminders for pending follow-ups',
                    },
                    {
                      id: 'responses',
                      label: 'Email responses',
                      description: 'Notify when prospects reply to your emails',
                    },
                    {
                      id: 'campaign',
                      label: 'Campaign updates',
                      description: 'Get updates on your active campaigns',
                    },
                  ].map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {notification.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-1 rounded border-border"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Email Configuration */}
          {activeSection === 'email' && (
            <>
              <Card title="Email Provider Setup">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      SMTP Server
                    </label>
                    <Input
                      type="text"
                      placeholder="smtp.gmail.com"
                      defaultValue="smtp.gmail.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Port
                      </label>
                      <Input
                        type="number"
                        placeholder="587"
                        defaultValue="587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Authentication
                      </label>
                      <select className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm">
                        <option>TLS</option>
                        <option>SSL</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Username
                    </label>
                    <Input
                      type="email"
                      placeholder="your-email@gmail.com"
                      defaultValue="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      defaultValue="••••••••"
                    />
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Test Connection & Save'}
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <>
              <Card title="Theme Settings">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', label: 'Light' },
                        { id: 'dark', label: 'Dark' },
                        { id: 'system', label: 'System' },
                      ].map((theme) => (
                        <label
                          key={theme.id}
                          className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted"
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            defaultChecked={theme.id === 'system'}
                          />
                          <span className="text-sm font-medium text-foreground">
                            {theme.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Theme'}
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <>
              <Card title="Change Password">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </Card>

              <Card title="Two-Factor Authentication">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </Card>

              <Card title="Active Sessions">
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', lastActive: 'Just now' },
                    { device: 'Safari on iPhone', lastActive: '2 hours ago' },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.device}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.lastActive}
                        </p>
                      </div>
                      <button className="text-xs text-destructive hover:underline">
                        Sign out
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 pt-8 border-t border-border">
        <Card title="Danger Zone" className="border-red-200 dark:border-red-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="outline" className="border-red-200 text-destructive hover:bg-red-50 dark:hover:bg-red-900/20">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
