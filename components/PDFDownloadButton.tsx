'use client'

import { HiDownload } from 'react-icons/hi'
import { Button } from '@/components/ui/button'

interface PDFDownloadButtonProps {
  slug: string
  title: string
}

export default function PDFDownloadButton({ slug, title }: PDFDownloadButtonProps) {
  const handleDownload = () => {
    // Trigger browser print dialog with PDF destination
    // The print.css will handle the formatting
    window.print()
  }

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="pdf-download-button flex items-center gap-2"
      aria-label={`Download ${title} as PDF`}
    >
      <HiDownload size={20} />
      Download as PDF
    </Button>
  )
}

