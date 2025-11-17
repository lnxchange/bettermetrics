'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import mammoth from 'mammoth'

export default function NewArticlePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: 'Yule Guttenbeil',
    category: '',
    tags: '',
    featuredImage: '',
    metaDescription: '',
    linkedinMessage: '',
    facebookMessage: '',
    xMessage: '',
    status: 'draft'
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, formData.slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileType = file.name.split('.').pop()?.toLowerCase()

      if (fileType === 'txt' || fileType === 'md') {
        // Handle text/markdown files
        const text = await file.text()
        setFormData(prev => ({ ...prev, content: text }))
        toast.success(`${fileType.toUpperCase()} file loaded successfully`)
      } else if (fileType === 'docx') {
        // Handle Word documents
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setFormData(prev => ({ ...prev, content: result.value }))
        toast.success('Word document converted successfully')
        if (result.messages.length > 0) {
          console.warn('Conversion warnings:', result.messages)
        }
      } else {
        toast.error('Unsupported file type. Please use .txt, .md, or .docx')
      }
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Failed to process file')
    }
  }

  const handleSubmit = async (action: 'draft' | 'published') => {
    if (!formData.title || !formData.content || !formData.slug) {
      toast.error('Title, slug, and content are required')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        status: action,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save article')
      }

      const data = await response.json()
      toast.success(`Article ${action === 'draft' ? 'saved as draft' : 'published'} successfully!`)

      // Redirect to article management or the article page
      if (action === 'published') {
        router.push(`/articles/${formData.slug}`)
      } else {
        router.push('/admin/articles')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save article')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-gray-600 mt-2">
            Write or upload content to publish on the AIM Framework website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title"
                    maxLength={120}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.title.length}/120 characters</p>
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="article-url-slug"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Auto-generated from title. URL: /articles/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Research, Framework"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="motivation, neuroscience, economics"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <label htmlFor="file-upload">
                      <Button type="button" variant="outline" size="sm" as="span">
                        Upload File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.md,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div 
                    className="prose max-w-none p-4 border rounded-lg bg-white min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400">No content to preview</p>' }}
                  />
                ) : (
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your article content here... (HTML and Markdown supported)"
                    rows={20}
                    className="font-mono text-sm"
                    required
                  />
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Supports HTML and Markdown. Upload .txt, .md, or .docx files.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SEO Card */}
            <Card>
              <CardHeader>
                <CardTitle>SEO & Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    placeholder="SEO description (150-160 characters)"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info('SEO optimization coming soon!')}
                >
                  Optimize SEO with AI
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="linkedinMessage">LinkedIn Message</Label>
                  <Textarea
                    id="linkedinMessage"
                    value={formData.linkedinMessage}
                    onChange={handleChange}
                    placeholder="Custom message for LinkedIn (optional)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="facebookMessage">Facebook Message</Label>
                  <Textarea
                    id="facebookMessage"
                    value={formData.facebookMessage}
                    onChange={handleChange}
                    placeholder="Custom message for Facebook (optional)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="xMessage">X (Twitter) Message</Label>
                  <Textarea
                    id="xMessage"
                    value={formData.xMessage}
                    onChange={handleChange}
                    placeholder="Custom message for X (optional)"
                    rows={2}
                    maxLength={280}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.xMessage.length}/280</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSubmit('draft')}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full"
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSubmit('published')}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push('/admin/articles')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

