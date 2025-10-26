import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Save to public/docs directory
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const docsDir = path.join(process.cwd(), 'public', 'docs')
    await mkdir(docsDir, { recursive: true })

    const filename = `${nanoid()}-${file.name}`
    const filepath = path.join(docsDir, filename)

    await writeFile(filepath, buffer)

    // TODO: Save metadata to database
    const doc = {
      id: nanoid(),
      title: file.name.replace('.pdf', ''),
      description: '',
      filename,
      fileSize: file.size,
      publishedDate: new Date().toISOString().split('T')[0],
      downloadCount: 0
    }

    return NextResponse.json(doc)
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
