import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null // 'image' or 'cv'

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    // Validate file type
    if (type === 'cv') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'الرجاء اختيار ملف PDF فقط' }, { status: 400 })
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'حجم الملف يجب أن يكون أقل من 10 ميغابايت' }, { status: 400 })
      }
    } else {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'الرجاء اختيار صورة فقط' }, { status: 400 })
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'حجم الصورة يجب أن يكون أقل من 5 ميغابايت' }, { status: 400 })
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    const ext = type === 'cv' ? 'pdf' : (file.name.split('.').pop() || 'png')
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    const url = `/uploads/${filename}`

    return NextResponse.json({ url, success: true })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
  }
}
