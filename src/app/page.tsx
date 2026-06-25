import Link from 'next/link'
import { Search, Users, BookOpen, Lightbulb, Newspaper, ArrowLeft, MapPin, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

async function getFeaturedSpecialists() {
  const users = await prisma.user.findMany({
    where: { isActive: true, role: 'SPECIALIST' },
    select: {
      id: true,
      name: true,
      surname: true,
      nameArabic: true,
      avatar: true,
      title: true,
      wilaya: true,
      ratingAvg: true,
      ratingCount: true,
      bio: true,
      competencies: {
        include: {
          specialty: { select: { name: true, nameArabic: true } },
          category: { select: { name: true, nameArabic: true } },
        },
        take: 2,
      },
    },
    orderBy: { ratingAvg: 'desc' },
    take: 6,
  })
  return users
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
    take: 8,
  })
  return categories
}

export default async function HomePage() {
  const [specialists, categories] = await Promise.all([
    getFeaturedSpecialists(),
    getCategories(),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo */}
            <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 shadow-lg bg-white p-1.5">
              <img
                src="/logo.png"
                alt="مدربي DZ"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              كل الكفاءات الرياضية في مكان واحد
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-100">
              منصة الكفاءات الرياضية والتربوية والعلمية في الجزائر.
              نواصل، نتعاون، نطور الرياضة الجزائرية.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/search">
                <Button size="lg" className="w-full gap-2 bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto">
                  <Search className="h-5 w-5" />
                  ابحث عن مختص
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="w-full gap-2 border-white/30 text-white hover:bg-white/10 sm:w-auto">
                  انضم إلى المنصة
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              { label: 'مختص رياضي', value: specialists.length, icon: Users },
              { label: 'ولاية', value: '58', icon: MapPin },
              { label: 'تصنيف رياضي', value: categories.length + 20, icon: Star },
              { label: 'فرصة عمل', value: 'متاحة', icon: Search },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <stat.icon className="mx-auto h-6 w-6 text-emerald-300" />
                <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-emerald-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التصنيفات الرياضية</h2>
            <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-emerald-200 hover:shadow-md dark:border-gray-600 dark:bg-slate-800"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl group-hover:bg-emerald-200">
                  {cat.icon || '🏅'}
                </div>
                <h3 className="mt-3 font-medium text-gray-900 dark:text-white group-hover:text-emerald-700">
                  {cat.nameArabic || cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Specialists */}
      {specialists.length > 0 && (
        <section className="bg-white py-16 dark:bg-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">أبرز المختصين</h2>
              <Link href="/search" className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                عرض الكل
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.map((specialist) => (
                <Link
                  key={specialist.id}
                  href={`/specialist/${specialist.id}`}
                  className="group block rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                      {specialist.nameArabic?.charAt(0) || specialist.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 transition-colors">
                        {specialist.nameArabic || specialist.name}
                      </h3>
                      {specialist.title && (
                        <p className="mt-0.5 text-sm text-gray-600">{specialist.title}</p>
                      )}
                      {specialist.wilaya && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {specialist.wilaya}
                        </p>
                      )}
                    </div>
                    {specialist.ratingCount > 0 && (
                      <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-amber-700">{specialist.ratingAvg.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {specialist.bio && (
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600">{specialist.bio}</p>
                  )}
                  {specialist.competencies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {specialist.competencies.map((comp, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          {comp.specialty?.nameArabic || comp.category?.nameArabic || comp.specialty?.name || comp.category?.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          ماذا تقدم المنصة؟
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Users,
              title: 'التواصل',
              desc: 'تواصل مع المختصين الرياضيين والأندية بسهولة',
              color: 'text-blue-600 bg-blue-100',
            },
            {
              icon: BookOpen,
              title: 'المكتبة الرقمية',
              desc: 'اطلع على الكتب والبحوث والدراسات الرياضية',
              color: 'text-emerald-600 bg-emerald-100',
            },
            {
              icon: Lightbulb,
              title: 'فضاء الابتكار',
              desc: 'اعرض ابتكاراتك ومشاريعك الرياضية',
              color: 'text-amber-600 bg-amber-100',
            },
            {
              icon: Newspaper,
              title: 'مجلة مدربي DZ',
              desc: 'تابع آخر الأخبار والمقالات الرياضية',
              color: 'text-purple-600 bg-purple-100',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:shadow-md dark:border-gray-600 dark:bg-slate-800">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            انضم إلى مجتمع الرياضة الجزائرية
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            سواء كنت مدرباً، مختصاً، أو نادياً رياضياً، منصة مدربي DZ تفتح لك أبواب التواصل والتعاون.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                سجل الآن مجاناً
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                استعرض المختصين
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-white py-12 border-t border-gray-100 dark:bg-slate-800 dark:border-gray-700">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-200 bg-white p-0.5">
            <img
              src="/logo.png"
              alt="مدربي DZ"
              className="h-full w-full object-contain rounded-full"
            />
          </div>
          <p className="text-sm text-gray-500">المؤسس والمطور</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900">المربي الرياضي بن عبد الله الهواري</h3>
          <p className="mt-1 text-sm text-gray-600">
            مربي رياضي • محلل أداء • مدرب حراس مرمى • منشط مخيمات صيفية • مراسل صحفي رياضي
          </p>
          <p className="mt-3 text-xs text-gray-400">
            🇩🇿 معاً من أجل الرياضة الجزائرية
          </p>
        </div>
      </section>
    </>
  )
}
