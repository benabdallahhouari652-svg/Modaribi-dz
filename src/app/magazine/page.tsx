import { Newspaper, Sparkles } from 'lucide-react'

export default function MagazinePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Newspaper className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">مجلة مدربي DZ</h1>
            <p className="mt-3 text-lg text-purple-100">
              آخر المقالات، الأخبار، والتحاليل الرياضية
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100">
            <Sparkles className="h-12 w-12 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">قريباً</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            يتم الآن تجهيز مجلة مدربي DZ.
            قريباً سننشر المقالات والأخبار والتحاليل الرياضية
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['📰', '✍️', '📊', '🎯', '🏆', '⚽'].map((emoji, i) => (
              <span key={i} className="text-3xl">{emoji}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
