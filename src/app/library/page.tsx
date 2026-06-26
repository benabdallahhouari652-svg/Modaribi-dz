import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/dal'
import { BookOpen, Download, FileText, Plus, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LibraryUploadForm } from '@/components/library/upload-form'

export const dynamic = 'force-dynamic'

async function getBooks() {
  return await prisma.libraryResource.findMany({
    where: { isPublished: true, type: 'BOOK' },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      authorUser: { select: { id: true, name: true, nameArabic: true } },
    },
  })
}

export default async function LibraryPage() {
  const [books, currentUser] = await Promise.all([
    getBooks(),
    getCurrentUser(),
  ])

  const isLoggedIn = !!currentUser
  const canUpload = !!currentUser
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN'
  const canDelete = currentUser?.role === 'SUPER_ADMIN'

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">المكتبة الرقمية</h1>
            <p className="mt-3 text-lg text-emerald-100">
              كتب ومراجع رياضية بصيغة PDF من المختصين للمختصين
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Button for logged-in users */}
        {canUpload && (
          <div className="mb-8">
            <LibraryUploadForm />
          </div>
        )}

        {books.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <BookOpen className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">المكتبة قيد التجهيز</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">
              سيتم إضافة الكتب والمراجع الرياضية قريباً.
              يمكن للمختصين المسجلين إضافة كتب PDF للمكتبة.
            </p>
            {!isLoggedIn && (
              <Link href="/auth/login">
                <Button className="mt-6 gap-2">
                  سجل دخول لإضافة كتاب
                </Button>
              </Link>
            )}
          </div>
        ) : (
          /* Books Grid */
          <>
            <div className="mb-4 text-sm text-gray-500">
              📚 {books.length} كتاب متاح
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="group rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md hover:border-emerald-200 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-l from-emerald-500 to-emerald-600" />
                  <div className="p-6 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        📄 PDF
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {book.titleArabic || book.title}
                    </h3>

                    {book.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">{book.description}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        {book.authorUser?.nameArabic || book.authorUser?.name || book.author}
                      </div>
                      <div className="flex gap-2">
                        {book.fileUrl && (
                          <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" download>
                            <Button size="sm" className="gap-1 text-xs h-8">
                              <Download className="h-3 w-3" />
                              تحميل
                            </Button>
                          </a>
                        )}
                        {(canDelete || book.authorId === currentUser?.id) && (
                          <form action="">
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs h-8 text-red-500 border-red-200 hover:bg-red-50"
                              formAction={`/api/library/delete/${book.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
