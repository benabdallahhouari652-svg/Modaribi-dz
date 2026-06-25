import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowRight, Eye, Heart, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PageParams = Promise<{ slug: string }>

export default async function ArticlePage(props: { params: PageParams }) {
  const { slug } = await props.params

  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: { select: { name: true, nameArabic: true } },
      category: { select: { nameArabic: true, name: true } },
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/magazine"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المجلة
      </Link>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={article.coverImage}
            alt={article.titleArabic || article.title}
            className="h-full w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {article.category && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {article.category.nameArabic || article.category.name}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {new Intl.DateTimeFormat('ar', {
              year: 'numeric', month: 'long', day: 'numeric',
            }).format(new Date(article.createdAt))}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {article.titleArabic || article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{article.excerpt}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author.nameArabic || article.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {article.views} مشاهدة
          </span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            {article.likes} إعجاب
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg prose-emerald max-w-none border-t border-gray-200 pt-8">
        <div
          className="text-gray-700 leading-relaxed space-y-4"
          dir="rtl"
        >
          {article.content.split('\n').map((paragraph, i) => (
            paragraph.trim() ? (
              <p key={i} className="text-lg leading-8">{paragraph}</p>
            ) : null
          ))}
        </div>
      </div>

      {/* Tags */}
      {article.tags && (
        <div className="mt-8 flex flex-wrap gap-2">
          {JSON.parse(article.tags).map((tag: string, i: number) => (
            <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-8 text-center text-white">
        <h2 className="text-xl font-bold">هل أعجبك المقال؟</h2>
        <p className="mt-2 text-emerald-100">شاركه مع زملائك وساهم في نشر المعرفة الرياضية</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/magazine">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
              المزيد من المقالات
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              انضم إلى المنصة
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
