import { prisma } from '@/lib/prisma'
import { Users, BookOpen, Lightbulb, Target, Eye, Heart } from 'lucide-react'

export default async function AboutPage() {
  const stats = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.specialty.count(),
    prisma.libraryResource.count({ where: { isPublished: true } }),
  ])

  const [usersCount, categoriesCount, specialtiesCount, resourcesCount] = stats

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white p-0.5">
              <img src="/logo.png" alt="مدربي DZ" className="h-full w-full object-contain rounded-full" />
            </div>
            <span className="text-3xl font-bold">مدربي</span>
            <span className="rounded-md bg-white px-2 py-0.5 text-lg font-bold text-emerald-700">DZ</span>
          </div>
          <h1 className="text-4xl font-bold">عن المنصة</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            منصة الكفاءات الرياضية والتربوية والعلمية في الجزائر
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'مختص رياضي', value: usersCount, icon: Users },
            { label: 'تصنيف رياضي', value: categoriesCount, icon: Target },
            { label: 'اختصاص', value: specialtiesCount, icon: BookOpen },
            { label: 'مورد مكتبي', value: resourcesCount, icon: Lightbulb },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-white p-6 text-center shadow-sm border border-gray-100">
              <stat.icon className="mx-auto h-6 w-6 text-emerald-600" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="prose prose-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">قصة المنصة</h2>
          <p className="text-gray-700 leading-relaxed">
            انطلاقًا من حاجة الأندية، الأكاديميات، اللاعبين، وأولياء الرياضيين إلى منصة موحدة تسهّل الوصول إلى
            المدربين والمختصين في مختلف المجالات الرياضية والتربوية، جاءت فكرة إنشاء منصة <strong>مدربي DZ</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            نظرًا لما يشهده الوسط الرياضي في الجزائر من حاجة متزايدة إلى مختلف الكفاءات الرياضية والتربوية،
            حيث تبحث العديد من الأندية والفرق الرياضية عن مدربين، محضرين بدنيين، مدربي حراس، محللي أداء،
            ومديرين فنيين في مختلف الاختصاصات، إضافة إلى حاجة اللاعبين إلى مدربين للتدريب الفردي،
            التحضير البدني، العلاج الفيزيائي، التغذية الصحية، ووكلاء الأعمال الرياضية.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            كذلك حاجة المخيمات الصيفية والتربصات إلى منشطين ومدراء ومؤطرين أكفاء،
            أصبح من الضروري إنشاء منصة رياضية وتربوية احترافية تجمع مختلف الكفاءات والخبرات
            داخل فضاء رقمي واحد.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الرسالة</h3>
              <p className="text-gray-700 leading-relaxed">
                تسهيل التواصل بين الكفاءات الرياضية والتربوية الجزائرية، وخلق فرص العمل وتبادل الخبرات،
                والمساهمة في تطوير الرياضة الجزائرية من خلال منصة رقمية احترافية.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الرؤية</h3>
              <p className="text-gray-700 leading-relaxed">
                أن نكون المنصة الرياضية الرقمية الأولى في الجزائر والعالم العربي،
                ومرجعًا رئيسيًا لكل الفاعلين في المجال الرياضي والتربوي والعلمي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">قيم المنصة</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🤝', title: 'التواصل', desc: 'ربط المختصين والأندية في فضاء واحد' },
            { icon: '💼', title: 'فرص العمل', desc: 'توفير فرص عمل وتعاون رياضي' },
            { icon: '📚', title: 'المعرفة', desc: 'نشر الثقافة والبحث العلمي الرياضي' },
            { icon: '🧠', title: 'الابتكار', desc: 'دعم الابتكار والمشاريع الرياضية' },
          ].map((v) => (
            <div key={v.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center hover:shadow-md transition-shadow">
              <span className="text-4xl">{v.icon}</span>
              <h3 className="mt-4 font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Owner */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/40 bg-white p-1 shadow-lg">
            <img
              src="/owner.jpg"
              alt="بن عبد الله الهواري"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">صاحب المشروع</h2>
          <p className="mt-2 text-xl">بن عبد الله الهواري</p>
          <p className="mt-2 text-emerald-100">
            مربي رياضي • محلل أداء • مدرب حراس مرمى • منشط مخيمات صيفية • مراسل صحفي رياضي
          </p>
          <p className="mt-4 text-emerald-100 max-w-xl mx-auto">
            صاحب فكرة ومؤسس مشروع مدربي DZ، منصة رياضية وتربوية رقمية تهدف إلى تطوير وربط مختلف
            الكفاءات الرياضية الجزائرية داخل منصة احترافية عصرية.
          </p>
        </div>
      </section>
    </div>
  )
}
