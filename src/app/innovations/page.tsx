import { Lightbulb, Sparkles } from 'lucide-react'

export default function InnovationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-amber-700 to-amber-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">فضاء الابتكار الرياضي</h1>
            <p className="mt-3 text-lg text-amber-100">
              منصة لعرض الابتكارات، المشاريع، والأفكار الرياضية الجديدة
            </p>
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">قريباً</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            يتم الآن تجهيز فضاء الابتكار الرياضي.
            قريباً سنستقبل ابتكاراتكم ومشاريعكم الرياضية المميزة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['💡', '🚀', '🧠', '⚡', '🏆', '🎯'].map((emoji, i) => (
              <span key={i} className="text-3xl">{emoji}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
