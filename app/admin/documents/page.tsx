'use client'

import { useState } from 'react'
import { HiUpload, HiTrash, HiPencil, HiDocumentText } from 'react-icons/hi'

interface Document {
  id: string
  title: string
  description: string
  filename: string
  fileSize: number
  publishedDate: string
  downloadCount: number
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    setIsUploading(true)
    try {
      const res = await fetch('/api/admin/documents/upload', {
        method: 'POST',
        body: formData
      })
      if (res.ok) {
        const doc = await res.json()
        setDocuments([...documents, doc])
      }
    } finally {
      setIsUploading(false)
    }
  }
  
  async function handleDelete(id: string) {
    if (!confirm('Delete this document?')) return
    
    const res = await fetch(`/api/admin/documents/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      setDocuments(documents.filter(d => d.id !== id))
    }
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Management</h1>
        <label className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700">
          <HiUpload className="mr-2" />
          {isUploading ? 'Uploading...' : 'Upload PDF'}
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      
      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <HiDocumentText className="text-3xl text-primary-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{doc.downloadCount} downloads</span>
                    <span>Published: {doc.publishedDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-primary-600">
                  <HiPencil />
                </button>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <HiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
