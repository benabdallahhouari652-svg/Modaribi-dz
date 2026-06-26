import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/dal'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ user: null })
    }
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
