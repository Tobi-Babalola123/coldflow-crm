'use client'

import { useState } from 'react'
import { mockTemplates } from '@/lib/mock-data'
import { Card } from '@/components/cards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  FileText,
  Tag,
  Mail,
  Copy as CopyIcon,
} from 'lucide-react'

const categoryColors = {
  'cold-outreach':
    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'follow-up':
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  proposal:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  closing:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selected = templates.find((t) => t.id === selectedTemplate)

  const handleCopyTemplate = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your email templates
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <div>
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Templates */}
          <div className="space-y-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <p className="font-medium text-foreground text-sm">
                  {template.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {template.subject}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Template Details */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              {/* Template Header */}
              <Card>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selected.name}
                    </h2>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[selected.category]}`}
                        >
                          {selected.category.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject Line
                    </label>
                    <div className="p-3 bg-muted rounded-lg border border-border">
                      <p className="text-sm text-foreground break-words">
                        {selected.subject}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Template Content */}
              <Card title="Email Content">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg border border-border min-h-64">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {selected.content}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => handleCopyTemplate(selected.content)}
                  >
                    <CopyIcon className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
              </Card>

              {/* Variables */}
              <Card
                title="Available Variables"
                description="Use these placeholders in your template"
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { var: 'name', desc: 'Contact name' },
                    { var: 'company', desc: 'Company name' },
                    { var: 'email', desc: 'Email address' },
                    { var: 'industry', desc: 'Industry' },
                    { var: 'title', desc: 'Job title' },
                    { var: 'region', desc: 'Region' },
                  ].map((item) => (
                    <div
                      key={item.var}
                      className="p-3 bg-card rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCopyTemplate(`{{${item.var}}}`)}
                    >
                      <code className="text-xs font-mono text-primary">
                        {`{{${item.var}}}`}
                      </code>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Use This Template
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-foreground font-medium">
                  Select a template
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a template from the list to view its content
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
