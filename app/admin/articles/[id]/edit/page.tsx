'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HiArrowLeft, HiEye, HiPhotograph, HiX } from 'react-icons/hi'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  author: string | null
  category: string | null
  tags: string | null
  featured_image_url: string | null
  meta_title: string | null
  meta_description: string | null
  status: 'draft' | 'scheduled' | 'published'
  structured_data: any
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [article, setArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: 'Yule Guttenbeil',
    category: '',
    tags: '',
    featured_image_url: '',
    meta_title: '',
    meta_description: '',
    linkedin_message: '',
    facebook_message: '',
    x_message: ''
  })

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      if (!response.ok) throw new Error('Failed to fetch article')

      const data = await response.json()
      setArticle(data.article)

      // Populate form
      const socialMessages = data.article.structured_data?.social_messages || {}
      setFormData({
        title: data.article.title || '',
        slug: data.article.slug || '',
        content: data.article.content || '',
        author: data.article.author || 'Yule Guttenbeil',
        category: data.article.category || '',
        tags: data.article.tags || '',
        featured_image_url: data.article.featured_image_url || '',
        meta_title: data.article.meta_title || data.article.title || '',
        meta_description: data.article.meta_description || '',
        linkedin_message: socialMessages.linkedin || '',
        facebook_message: socialMessages.facebook || '',
        x_message: socialMessages.x || ''
      })
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, featured_image_url: data.url }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, featured_image_url: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Save failed')
      }

      toast.success('Draft saved successfully!')
      fetchArticle() // Refresh
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    // Validate required fields
    if (!formData.featured_image_url) {
      toast.error('Featured image is required before publishing')
      return
    }

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required')
      return
    }

    // Confirm if social messages are empty
    if (!formData.linkedin_message && !formData.facebook_message && !formData.x_message) {
      const confirmed = window.confirm(
        'No social media messages provided. The article will be published but not shared to social media. Continue?'
      )
      if (!confirmed) return
    }

    setPublishing(true)
    try {
      // First save any changes
      await handleSaveDraft()

      // Then publish
      const response = await fetch(`/api/articles/${articleId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinMessage: formData.linkedin_message,
          facebookMessage: formData.facebook_message,
          xMessage: formData.x_message
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Publish failed')
      }

      const result = await response.json()
      toast.success('Article published successfully!')

      // Show social media results
      if (result.socialResults && result.socialResults.length > 0) {
        result.socialResults.forEach((sr: any) => {
          if (sr.success) {
            toast.success(`Posted to ${sr.platform}!`)
          } else {
            toast.error(`${sr.platform}: ${sr.error}`)
          }
        })
      }

      if (result.warning) {
        toast(result.warning, { duration: 5000, icon: '⚠️' })
      }

      // Redirect to published article
      setTimeout(() => {
        router.push(`/articles/${formData.slug}`)
      }, 2000)
    } catch (error) {
      console.error('Publish error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to publish article')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Loading article...</div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-600">Article not found</div>
          <Link href="/admin/articles">
            <Button>Back to Articles</Button>
          </Link>
        </div>
      </div>
    )
  }

  const xCharCount = formData.x_message.length
  const xCharLimit = 280

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/articles">
              <Button variant="outline" size="sm">
                <HiArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
              <p className="mt-1 text-sm text-gray-500">
                Status: <span className="font-semibold capitalize">{article.status}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/articles/${formData.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <HiEye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL: /articles/{formData.slug}
                </p>
              </div>

              {/* Category & Tags */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select category...</option>
                    <option value="Research">Research</option>
                    <option value="Economics">Economics</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Neuroscience">Neuroscience</option>
                    <option value="Applications">Applications</option>
                    <option value="Case Studies">Case Studies</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Comma-separated</p>
                </div>
              </div>

              {/* Featured Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Featured Image *
                </label>
                
                {formData.featured_image_url ? (
                  <div className="relative inline-block">
                    <Image
                      src={formData.featured_image_url}
                      alt="Featured image preview"
                      width={400}
                      height={225}
                      className="rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <HiX className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer">
                      <HiPhotograph className="mr-2 h-5 w-5" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      Max 5MB • JPEG, PNG, GIF, WebP
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                  Content * (Markdown)
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={20}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Description (SEO)
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={3}
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines (150-160 characters recommended)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.meta_description.length} characters
                </p>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Social Media Messages
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  These messages will be posted automatically when you publish (if API credentials are configured).
                </p>
              </div>

              {/* LinkedIn Message */}
              <div>
                <label htmlFor="linkedin_message" className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn Post
                </label>
                <textarea
                  id="linkedin_message"
                  name="linkedin_message"
                  rows={4}
                  value={formData.linkedin_message}
                  onChange={handleChange}
                  placeholder="Professional tone, 300 characters recommended..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.linkedin_message.length} characters
                </p>
              </div>

              {/* Facebook Message */}
              <div>
                <label htmlFor="facebook_message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Facebook Post
                </label>
                <textarea
                  id="facebook_message"
                  name="facebook_message"
                  rows={4}
                  value={formData.facebook_message}
                  onChange={handleChange}
                  placeholder="Engaging tone, up to 500 characters..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.facebook_message.length} characters
                </p>
              </div>

              {/* X/Twitter Message */}
              <div>
                <label htmlFor="x_message" className="block text-sm font-semibold text-gray-700 mb-2">
                  X/Twitter Post
                </label>
                <textarea
                  id="x_message"
                  name="x_message"
                  rows={3}
                  value={formData.x_message}
                  onChange={handleChange}
                  placeholder="Concise message, max 280 characters..."
                  maxLength={xCharLimit}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    xCharCount > xCharLimit ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className={`mt-1 text-xs ${xCharCount > xCharLimit ? 'text-red-600' : 'text-gray-500'}`}>
                  {xCharCount} / {xCharLimit} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
                <Link href="/admin/articles">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saving || publishing}
                    variant="outline"
                  >
                    {saving ? 'Saving...' : 'Save Draft'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={saving || publishing || !formData.featured_image_url}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {publishing ? 'Publishing...' : '🚀 Publish & Share'}
                  </Button>
                </div>
              </div>

              {!formData.featured_image_url && (
                <p className="text-sm text-amber-600 text-center">
                  ⚠️ Featured image required before publishing
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

