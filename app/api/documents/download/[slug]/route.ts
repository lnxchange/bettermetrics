import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Get filename from database by slug
    const filename = `${params.slug}.pdf`
    const filepath = path.join(process.cwd(), 'public', 'docs', filename)

    const buffer = await readFile(filepath)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
