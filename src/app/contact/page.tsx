'use client'

import { useActionState } from 'react'
import { submitContact } from '@/lib/actions/contact'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [state, action, pending] = useActionState(submitContact, undefined)

  if (state?.success) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">اتصل بنا</h1>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">تم إرسال رسالتك!</h3>
            <p className="mt-2 text-gray-600">{state.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-6">
              إرسال رسالة أخرى
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-600 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">اتصل بنا</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            تواصل معنا لأي استفسار أو اقتراح
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">معلومات التواصل</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-600" dir="ltr">benabdallahhouari652@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">الهاتف</h3>
                  <p className="text-sm text-gray-600" dir="ltr">0776 10 29 44</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">واتساب</h3>
                  <a href="https://wa.me/213662752087" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:text-emerald-700 underline" dir="ltr">+213 662 75 20 87</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">الموقع</h3>
                  <p className="text-sm text-gray-600">وهران، الجزائر</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">ساعات العمل</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>السبت - الخميس: 09:00 - 18:00</p>
                <p>الجمعة: مغلق</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <form action={action} className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">أرسل لنا رسالة</h2>

                {state?.message && !state?.success && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {state.message}
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">الاسم الكامل</label>
                    <Input id="name" name="name" placeholder="الاسم والنسب" required />
                    {state?.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <Input id="email" name="email" type="email" placeholder="example@email.com" required dir="ltr" />
                    {state?.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700">الموضوع</label>
                  <Input id="subject" name="subject" placeholder="موضوع الرسالة" required />
                  {state?.errors?.subject && <p className="mt-1 text-xs text-red-600">{state.errors.subject[0]}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="اكتب رسالتك هنا..."
                    required
                    className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                  />
                  {state?.errors?.message && <p className="mt-1 text-xs text-red-600">{state.errors.message[0]}</p>}
                </div>

                <Button type="submit" disabled={pending} className="w-full gap-2 sm:w-auto">
                  <Send className="h-4 w-4" />
                  {pending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
