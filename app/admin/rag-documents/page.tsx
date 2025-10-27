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

export default function RAGDocumentsPage() {
  const [uploadMode, setUploadMode] = useState<'quick-add' | 'batch'>(
    'quick-add'
  )
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metadata: '{}'
  })
  const [batchFiles, setBatchFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number
    total: number
  }>({ completed: 0, total: 0 })
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Fetch documents on page load
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/admin/documents?type=rag')
        if (response.ok) {
          const data = await response.json()
          setDocuments(data.documents || [])
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

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
        // Download as text file
        const blob = new Blob([document.content], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${document.title}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Document downloaded successfully!')
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
        `/api/admin/documents?id=${documentId}&type=rag`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        toast.success('Document deleted successfully!')
        // Refresh the documents list
        const refreshResponse = await fetch('/api/admin/documents?type=rag')
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

  const handleProcessAllDocuments = async () => {
    if (!confirm('This will process all RAG documents for embeddings. This may take a few minutes. Continue?')) {
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/process-all-rag-documents', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Successfully processed ${data.processed} out of ${data.total} documents!`)
        
        if (data.errors && data.errors.length > 0) {
          console.error('Processing errors:', data.errors)
          toast.error(`${data.errors.length} documents failed to process. Check console for details.`)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to process documents')
      }
    } catch (error) {
      toast.error('Failed to process documents')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReprocessAllDocuments = async () => {
    if (!confirm('This will reprocess ALL RAG documents for embeddings, including those already processed. This may take several minutes. Continue?')) {
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/process-all-rag-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reprocess: true })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Successfully reprocessed ${data.processed} out of ${data.total} documents!`)
        
        if (data.errors && data.errors.length > 0) {
          console.error('Processing errors:', data.errors)
          toast.error(`${data.errors.length} documents failed to process. Check console for details.`)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to reprocess documents')
      }
    } catch (error) {
      toast.error('Failed to reprocess documents')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDebugRAG = async () => {
    try {
      const response = await fetch('/api/admin/debug-rag')
      if (response.ok) {
        const data = await response.json()
        setDebugInfo(data)
        console.log('RAG Debug Info:', data)
        toast.success('Debug info loaded - check console for details')
      } else {
        toast.error('Failed to get debug info')
      }
    } catch (error) {
      toast.error('Failed to get debug info')
    }
  }

  const handleTestSearch = async () => {
    try {
      const response = await fetch('/api/admin/test-rag-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: 'What is the AIM Framework?' })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Search Test Results:', data)
        toast.success(`Search test completed - found ${data.resultCount} results. Check console for details.`)
      } else {
        toast.error('Search test failed')
      }
    } catch (error) {
      toast.error('Search test failed')
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const content = await file.text()
        setFormData({ ...formData, content })
        toast.success('File content loaded successfully!')
      } catch (error) {
        toast.error('Error reading file')
      }
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
      if (uploadMode === 'quick-add') {
        // Quick Add mode - single text document
        const formDataToSend = new FormData()
        formDataToSend.append('type', 'rag')
        formDataToSend.append('title', formData.title)
        formDataToSend.append('content', formData.content)
        formDataToSend.append('metadata', formData.metadata)

        const response = await fetch('/api/admin/documents', {
          method: 'POST',
          body: formDataToSend
        })

        if (response.ok) {
          const { document } = await response.json()
          toast.success('Document uploaded successfully!')
          
          // Automatically process document for embeddings
          try {
            await fetch('/api/admin/process-document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                documentId: document.id,
                documentType: 'rag'
              })
            })
            toast.success('Document uploaded and processed successfully!')
          } catch (processError) {
            console.error('Error processing document:', processError)
            toast.error('Document uploaded but processing failed. Please try processing manually.')
          }
          
          setFormData({ title: '', content: '', metadata: '{}' })
          // Reset file input
          const fileInput = document.getElementById('file') as HTMLInputElement
          if (fileInput) fileInput.value = ''
          // Refresh the documents list
          const refreshResponse = await fetch('/api/admin/documents?type=rag')
          if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            setDocuments(data.documents || [])
          }
        } else {
          const error = await response.json()
          toast.error(error.error || 'Upload failed')
        }
      } else {
        // Batch mode - multiple files
        if (!batchFiles || batchFiles.length === 0) {
          toast.error('Please select files to upload')
          return
        }

        setUploadProgress({ completed: 0, total: batchFiles.length })
        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < batchFiles.length; i++) {
          const file = batchFiles[i]
          try {
            // Check if file is text-based
            if (!file.type.startsWith('text/') && !file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
              console.warn(`Skipping non-text file: ${file.name}`)
              errorCount++
              toast.error(`Skipped ${file.name}: Only text files are supported`)
              continue
            }

            const content = await file.text()
            
            // Check if content is empty
            if (!content.trim()) {
              console.warn(`Skipping empty file: ${file.name}`)
              errorCount++
              toast.error(`Skipped ${file.name}: File is empty`)
              continue
            }

            const formDataToSend = new FormData()
            formDataToSend.append('type', 'rag')
            formDataToSend.append('title', file.name.replace(/\.[^/.]+$/, '')) // Remove extension
            formDataToSend.append('content', content)
            formDataToSend.append('metadata', '{}')

            const response = await fetch('/api/admin/documents', {
              method: 'POST',
              body: formDataToSend
            })

            if (response.ok) {
              const { document } = await response.json()
              successCount++
              
              // Automatically process document for embeddings
              try {
                await fetch('/api/admin/process-document', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    documentId: document.id,
                    documentType: 'rag'
                  })
                })
              } catch (processError) {
                console.error(`Error processing ${file.name}:`, processError)
              }
            } else {
              errorCount++
              const errorData = await response.json()
              console.error(`Failed to upload ${file.name}:`, errorData)
              toast.error(`Failed to upload ${file.name}: ${errorData.error}`)
            }
          } catch (error) {
            errorCount++
            console.error(`Error processing ${file.name}:`, error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            toast.error(`Error processing ${file.name}: ${errorMessage}`)
          }

          setUploadProgress({ completed: i + 1, total: batchFiles.length })
        }

        if (successCount > 0) {
          toast.success(
            `Batch upload completed: ${successCount} files uploaded successfully`
          )
          // Refresh the documents list
          const refreshResponse = await fetch('/api/admin/documents?type=rag')
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
                RAG Documents
              </h1>
              <p className="mt-2 text-gray-600">
                Manage documents used by the AI chatbot&apos;s knowledge base
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
                <CardDescription>
                  Add documents to the RAG system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Mode Tabs */}
                <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode('quick-add')}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      uploadMode === 'quick-add'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Quick Add Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('batch')}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      uploadMode === 'batch'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Batch Upload Files
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {uploadMode === 'quick-add' ? (
                    <>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={e =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="Enter document title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="file">Upload File (Optional)</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".txt,.md,.docx"
                          onChange={handleFileChange}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Supported formats: TXT, MD, DOCX
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              content: e.target.value
                            })
                          }
                          placeholder="Paste or type document content here..."
                          rows={8}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="metadata">Metadata (JSON)</Label>
                        <Textarea
                          id="metadata"
                          name="metadata"
                          value={formData.metadata}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              metadata: e.target.value
                            })
                          }
                          placeholder='{"tags": ["research"], "category": "framework"}'
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="batch-files">Select Files</Label>
                        <Input
                          id="batch-files"
                          type="file"
                          multiple
                          accept=".txt,.md,.docx"
                          onChange={handleBatchFileChange}
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Select multiple files. Supported formats: TXT, MD,
                          DOCX
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
                    </>
                  )}

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
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading
                      ? uploadMode === 'batch'
                        ? `Uploading... ${uploadProgress.completed}/${uploadProgress.total}`
                        : 'Uploading...'
                      : uploadMode === 'batch'
                      ? 'Upload Files'
                      : 'Upload Document'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>RAG Documents</CardTitle>
                    <CardDescription>
                      Documents processed for the AI chatbot
                    </CardDescription>
                  </div>
                  {documents.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleProcessAllDocuments}
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                      >
                        {isProcessing ? 'Processing...' : 'Process All for RAG'}
                      </Button>
                      <Button
                        onClick={handleReprocessAllDocuments}
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                      >
                        {isProcessing ? 'Processing...' : 'Reprocess All'}
                      </Button>
                      <Button
                        onClick={handleDebugRAG}
                        variant="secondary"
                        size="sm"
                      >
                        Debug RAG
                      </Button>
                      <Button
                        onClick={handleTestSearch}
                        variant="secondary"
                        size="sm"
                      >
                        Test Search
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="py-8 text-center text-gray-500">
                      <p>Loading documents...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <p>No RAG documents uploaded yet.</p>
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
                                {doc.content?.substring(0, 150)}...
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
                                {doc.metadata &&
                                  Object.keys(doc.metadata).length > 0 && (
                                    <span>
                                      Tags:{' '}
                                      {Object.keys(doc.metadata).join(', ')}
                                    </span>
                                  )}
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(doc)}
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
