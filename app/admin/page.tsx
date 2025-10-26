import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Use Better Metrics',
  description: 'Admin panel for managing research documents and RAG system'
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage research documents and RAG system for the AIM Framework
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Research Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle>Research Documents</CardTitle>
              <CardDescription>
                Manage research documents that are publicly accessible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Upload and manage research documents, papers, and resources
                related to the AIM Framework. These documents are publicly
                accessible and can be referenced by researchers.
              </p>
              <div className="flex space-x-2">
                <Button asChild>
                  <Link href="/admin/research-documents">Manage Documents</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/research-documents?action=upload">
                    Upload New
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RAG Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle>RAG Documents</CardTitle>
              <CardDescription>
                Manage documents used by the AI chatbot&apos;s knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                Upload and manage documents that power the AI chatbot&apos;s
                responses. These documents are processed into embeddings for
                semantic search.
              </p>
              <div className="flex space-x-2">
                <Button asChild>
                  <Link href="/admin/rag-documents">Manage Documents</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/rag-documents?action=upload">
                    Upload New
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Quick Stats
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary-600">0</div>
                <p className="text-sm text-gray-600">Research Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary-600">0</div>
                <p className="text-sm text-gray-600">RAG Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary-600">0</div>
                <p className="text-sm text-gray-600">Total Embeddings</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/">← Back to Site</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
