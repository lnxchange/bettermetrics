'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ResearchDocumentsPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [batchFiles, setBatchFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number
    total: number
  }>({ completed: 0, total: 0 })
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  // Track when component has mounted (after hydration)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Fetch documents on page load (only after mount)
  useEffect(() => {
    if (!hasMounted) return

    const fetchDocuments = async () => {
      try {
        // Add a small delay to ensure server is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        const response = await fetch('/api/admin/documents?type=research')
        if (response.ok) {
          const data = await response.json()
          setDocuments(data.documents || [])
        } else {
          console.error(
            'Response not ok:',
            response.status,
            response.statusText
          )
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [hasMounted])

  const handleDownload = async (document: any) => {
    try {
      if (document.file_url) {
        // Download the file
        const response = await fetch(document.file_url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = document.title || 'document'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Document downloaded successfully!')
      } else {
        toast.error('No file available for download')
      }
    } catch (error) {
      toast.error('Failed to download document')
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/documents?id=${documentId}&type=research`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        toast.success('Document deleted successfully!')
        // Refresh the documents list
        const refreshResponse = await fetch(
          '/api/admin/documents?type=research'
        )
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          setDocuments(data.documents || [])
        }
      } else {
        toast.error('Failed to delete document')
      }
    } catch (error) {
      toast.error('Failed to delete document')
    }
  }

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setBatchFiles(files)
      toast.success(`${files.length} files selected for batch upload`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      if (batchFiles && batchFiles.length > 0) {
        // Batch mode - multiple files
        setUploadProgress({ completed: 0, total: batchFiles.length })
        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < batchFiles.length; i++) {
          const file = batchFiles[i]
          try {
            const formDataToSend = new FormData()
            formDataToSend.append('type', 'research')
            formDataToSend.append('title', file.name.replace(/\.[^/.]+$/, '')) // Remove extension
            formDataToSend.append('description', `Uploaded file: ${file.name}`)
            formDataToSend.append('file', file)

            const response = await fetch('/api/admin/documents', {
              method: 'POST',
              body: formDataToSend
            })

            if (response.ok) {
              successCount++
            } else {
              errorCount++
              console.error(`Failed to upload ${file.name}`)
            }
          } catch (error) {
            errorCount++
            console.error(`Error processing ${file.name}:`, error)
          }

          setUploadProgress({ completed: i + 1, total: batchFiles.length })
        }

        if (successCount > 0) {
          toast.success(
            `Batch upload completed: ${successCount} files uploaded successfully`
          )
          // Refresh the documents list
          const refreshResponse = await fetch(
            '/api/admin/documents?type=research'
          )
          if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            setDocuments(data.documents || [])
          }
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} files failed to upload`)
        }

        // Reset batch files
        setBatchFiles(null)
        const batchFileInput = document.getElementById(
          'batch-files'
        ) as HTMLInputElement
        if (batchFileInput) batchFileInput.value = ''
      } else {
        // Single file mode
        const formDataToSend = new FormData()
        formDataToSend.append('type', 'research')
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)

        const fileInput = document.getElementById('file') as HTMLInputElement
        if (fileInput.files?.[0]) {
          formDataToSend.append('file', fileInput.files[0])
        }

        const response = await fetch('/api/admin/documents', {
          method: 'POST',
          body: formDataToSend
        })

        if (response.ok) {
          toast.success('Document uploaded successfully!')
          setFormData({ title: '', description: '' })
          fileInput.value = ''
          // Refresh the documents list
          const refreshResponse = await fetch(
            '/api/admin/documents?type=research'
          )
          if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            setDocuments(data.documents || [])
          }
        } else {
          const error = await response.json()
          toast.error(error.error || 'Upload failed')
        }
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress({ completed: 0, total: 0 })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Research Documents
              </h1>
              <p className="mt-2 text-gray-600">
                Manage research documents that are publicly accessible
              </p>
            </div>
            <Button asChild>
              <Link href="/admin">← Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Add research documents</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Single File Upload */}
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Document title"
                      value={formData.title}
                      onChange={e =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief description of the document"
                      rows={3}
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">Single File</Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf,.txt,.md,.docx"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a single file
                    </p>
                  </div>

                  {/* Batch File Upload */}
                  <div className="border-t pt-4">
                    <Label htmlFor="batch-files">Batch Upload Files</Label>
                    <Input
                      id="batch-files"
                      type="file"
                      multiple
                      accept=".pdf,.txt,.md,.docx"
                      onChange={handleBatchFileChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Select multiple files for batch upload (titles will be
                      auto-generated from filenames)
                    </p>
                    {batchFiles && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">
                          Selected {batchFiles.length} files:
                        </p>
                        <ul className="mt-1 max-h-32 overflow-y-auto text-sm text-gray-600">
                          {Array.from(batchFiles).map((file, index) => (
                            <li key={index} className="truncate">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress.total > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>
                          {uploadProgress.completed}/{uploadProgress.total}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                          style={{
                            width: `${
                              (uploadProgress.completed /
                                uploadProgress.total) *
                              100
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading
                      ? uploadProgress.total > 0
                        ? `Uploading... ${uploadProgress.completed}/${uploadProgress.total}`
                        : 'Uploading...'
                      : 'Upload Document(s)'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Manage existing research documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!hasMounted || isLoading ? (
                    <div className="py-8 text-center text-gray-500">
                      <p>Loading documents...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <p>No documents uploaded yet.</p>
                      <p className="text-sm">
                        Upload your first document using the form on the left.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map(doc => (
                        <div key={doc.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {doc.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">
                                {doc.description}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                <span>
                                  Uploaded:{' '}
                                  {new Date(
                                    doc.created_at
                                  ).toLocaleDateString()}
                                </span>
                                {doc.file_type && (
                                  <span>Type: {doc.file_type}</span>
                                )}
                                {doc.file_size && (
                                  <span>
                                    Size: {(doc.file_size / 1024).toFixed(1)} KB
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(doc)}
                                disabled={!doc.file_url}
                              >
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(doc.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
