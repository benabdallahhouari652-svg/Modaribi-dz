export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">سياسة الخصوصية</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            خصوصية بياناتك هي أولويتنا
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">المقدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              نحن في منصة مدربي DZ نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع
              واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام منصتنا.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">المعلومات التي نجمعها</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>معلومات التسجيل: الاسم، البريد الإلكتروني، رقم الهاتف</li>
              <li>المعلومات المهنية: المؤهلات، الشهادات، الخبرات</li>
              <li>محتوى الملف الشخصي: الصور، السيرة الذاتية، التخصصات</li>
              <li>بيانات الاستخدام: الصفحات التي تزورها، المدة التي تقضيها في المنصة</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">كيف نستخدم معلوماتك</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>لتقديم وتحسين خدمات المنصة</li>
              <li>لربطك بالمختصين والأندية الرياضية</li>
              <li>لإرسال إشعارات هامة متعلقة بحسابك</li>
              <li>لتحسين تجربة المستخدم وتطوير المنصة</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">حماية البيانات</h2>
            <p className="text-gray-700 leading-relaxed">
              نستخدم إجراءات أمنية متقدمة لحماية معلوماتك الشخصية من الوصول غير المصرح به،
              التعديل، الإفشاء، أو الإتلاف. جميع البيانات مشفرة ومخزنة بشكل آمن.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">مشاركة المعلومات</h2>
            <p className="text-gray-700 leading-relaxed">
              لا نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك الصريحة، إلا في الحالات
              التي يتطلبها القانون.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">حقوقك</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>حق الوصول إلى بياناتك الشخصية</li>
              <li>حق تعديل أو تحديث بياناتك</li>
              <li>حق حذف حسابك وبياناتك</li>
              <li>حق الاعتراض على معالجة بياناتك</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">اتصل بنا</h2>
            <p className="text-gray-700 leading-relaxed">
              إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر
              صفحة &quot;اتصل بنا&quot; أو عبر البريد الإلكتروني.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              آخر تحديث: 23 جوان 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
