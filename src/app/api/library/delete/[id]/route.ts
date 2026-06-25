import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  try {
    const book = await prisma.libraryResource.findUnique({ where: { id } })
    if (!book) {
      return NextResponse.redirect(new URL('/library', req.url))
    }
    if (book.authorId !== session.userId && session.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/library', req.url))
    }

    await prisma.libraryResource.delete({ where: { id } })
    return NextResponse.redirect(new URL('/library', req.url))
  } catch {
    return NextResponse.redirect(new URL('/library', req.url))
  }
}
