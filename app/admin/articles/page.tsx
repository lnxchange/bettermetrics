'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {  Badge } from '@/components/ui/badge'

interface Article {
  id: string
  title: string
  slug: string
  status: 'draft' | 'scheduled' | 'published'
  author: string | null
  category: string | null
  created_at: string
  published_at: string | null
  seo_optimized_at: string | null
}

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')

  useEffect(() => {
    fetchArticles()
  }, [filter])

  const fetchArticles = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/articles' 
        : `/api/articles?status=${filter}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch articles')
      
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const handleOptimizeSEO = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/optimize-seo`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('SEO optimization failed')

      toast.success('SEO optimization completed!')
      fetchArticles()
    } catch (error) {
      console.error('SEO optimization error:', error)
      toast.error('Failed to optimize SEO')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      draft: 'secondary',
      published: 'default',
      scheduled: 'outline'
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading articles...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
            <p className="text-gray-600 mt-2">Manage your published articles and drafts</p>
          </div>
          <Link href="/admin/new-article">
            <Button>Create New Article</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Articles
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Published
          </Button>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <p className="text-lg">No articles found</p>
                <p className="text-sm mt-2">Create your first article to get started</p>
                <Link href="/admin/new-article">
                  <Button className="mt-4">Create Article</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {article.title}
                        </h3>
                        {getStatusBadge(article.status)}
                        {article.seo_optimized_at && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            SEO Optimized
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {article.author && (
                          <span>By {article.author}</span>
                        )}
                        {article.category && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {article.category}
                          </span>
                        )}
                        <span>
                          Created: {new Date(article.created_at).toLocaleDateString()}
                        </span>
                        {article.published_at && (
                          <span>
                            Published: {new Date(article.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        <code className="bg-gray-100 px-2 py-1 rounded">/articles/{article.slug}</code>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {article.status === 'published' && (
                        <Link href={`/articles/${article.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      )}
                      
                      {!article.seo_optimized_at && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptimizeSEO(article.id)}
                        >
                          Optimize SEO
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

