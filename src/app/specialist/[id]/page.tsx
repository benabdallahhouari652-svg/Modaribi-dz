import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MapPin, Star, Globe, Phone, Mail, Award, CheckCircle, MessageCircle, User, Heart, Briefcase, FileText, GraduationCap, BookOpen, Trophy, Globe2, Sparkles, Pencil, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/dal'

const maritalStatusLabels: Record<string, string> = {
  SINGLE: 'أعزب',
  MARRIED: 'متزوج',
  DIVORCED: 'مطلق',
  WIDOWED: 'أرمل',
}

const genderLabels: Record<string, string> = {
  MALE: 'ذكر',
  FEMALE: 'أنثى',
}

const certificationTypeLabels: Record<string, string> = {
  COACHING: 'شهادة تدريب',
  ACADEMIC: 'شهادة جامعية',
  PROFESSIONAL: 'شهادة مهنية',
  INTERNATIONAL: 'شهادة دولية',
  TRAINING: 'دورة تكوينية',
  OTHER: 'أخرى',
}

const certificationTypeIcons: Record<string, any> = {
  COACHING: Trophy,
  ACADEMIC: GraduationCap,
  PROFESSIONAL: BookOpen,
  INTERNATIONAL: Globe2,
  TRAINING: Sparkles,
  OTHER: Award,
}

type PageParams = Promise<{ id: string }>

export default async function SpecialistProfilePage(props: { params: PageParams }) {
  const { id } = await props.params
  const currentUser = await getCurrentUser()
  const isOwner = currentUser?.id === id

  const specialist = await prisma.user.findUnique({
    where: { id },
    include: {
      competencies: {
        include: {
          category: true,
          specialty: true,
        },
      },
      certifications: {
        orderBy: { year: 'desc' },
      },
      reviewsReceived: {
        include: {
          reviewer: {
            select: { id: true, name: true, nameArabic: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!specialist || !specialist.isActive) {
    notFound()
  }

  const displayName = specialist.nameArabic || `${specialist.surname ? specialist.surname + ' ' : ''}${specialist.name}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            {/* Avatar */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700 border-2 border-emerald-200">
              {specialist.avatar ? (
                <img src={specialist.avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                displayName.charAt(0)
              )}
            </div>

            <h1 className="mt-4 text-xl font-bold text-gray-900">{displayName}</h1>
            {specialist.title && (
              <p className="mt-1 text-gray-600">{specialist.title}</p>
            )}

            {/* Rating */}
            {specialist.ratingCount > 0 && (
              <div className="mt-3 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-amber-700">{specialist.ratingAvg.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({specialist.ratingCount} تقييم)</span>
              </div>
            )}

            {/* Availability */}
            <div className="mt-4">
              <Badge
                variant={specialist.availability === 'AVAILABLE' ? 'default' : 'warning'}
                className="text-sm px-4 py-1"
              >
                {specialist.availability === 'AVAILABLE' ? '🟢 متاح للعمل' : '🟡 مشغول'}
              </Badge>
            </div>

            <div className="mt-6 space-y-3 text-right">
              {specialist.email && (
                <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                  <Mail className="h-4 w-4 shrink-0" />
                  {specialist.email}
                </p>
              )}
              {specialist.wilaya && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {specialist.wilaya}{specialist.municipality ? ` - ${specialist.municipality}` : ''}
                </p>
              )}
              {specialist.phone && (
                <p className="flex items-center gap-2 text-sm text-gray-600" dir="ltr">
                  <Phone className="h-4 w-4 shrink-0" />
                  {specialist.phone}
                </p>
              )}
              {specialist.experienceYears && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 shrink-0" />
                  {specialist.experienceYears} سنة خبرة
                </p>
              )}
              {specialist.maritalStatus && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="h-4 w-4 shrink-0" />
                  {maritalStatusLabels[specialist.maritalStatus] || specialist.maritalStatus}
                </p>
              )}
              {specialist.gender && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 shrink-0" />
                  {genderLabels[specialist.gender] || specialist.gender}
                </p>
              )}
            </div>

            {/* Contract & Availability Status */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Badge variant={specialist.isContracted ? 'warning' : 'default'} className="text-xs">
                  {specialist.isContracted ? '📋 مرتبط بعقد' : '✅ غير مرتبط بعقد'}
                </Badge>
              </div>
              {specialist.trainingType && (
                <div className="text-center text-xs text-gray-500">
                  {specialist.trainingType === 'INDIVIDUAL' ? '🧑 يقدم حصص فردية' :
                   specialist.trainingType === 'GROUP' ? '👥 يقدم حصص جماعية' :
                   specialist.trainingType === 'BOTH' ? '🧑‍🤝‍🧑 يقدم حصص فردية وجماعية' : ''}
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {specialist.acceptsTravel && (
                  <Badge variant="info" className="text-[10px]">🚗 يتنقل خارج الولاية</Badge>
                )}
                {specialist.acceptsWorkOutside && (
                  <Badge variant="info" className="text-[10px]">✈️ يعمل خارج الوطن</Badge>
                )}
                {specialist.acceptsRemoteWork && (
                  <Badge variant="info" className="text-[10px]">💻 عمل عن بعد</Badge>
                )}
              </div>
            </div>

            {/* Owner: Edit Profile Button */}
            {isOwner ? (
              <div className="mt-6 space-y-3">
                <Link href="/profile/edit">
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Pencil className="h-4 w-4" />
                    ✏️ تعديل الملف الشخصي
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    عرض بروفايلي
                  </Button>
                </Link>
              </div>
            ) : (
              /* Contact Buttons */
              <div className="mt-6 space-y-3">
                <Link href={`/messages/compose?to=${specialist.id}`}>
                  <Button className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    أرسل رسالة
                  </Button>
                </Link>
                {specialist.whatsapp && (
                  <a
                    href={`https://wa.me/${specialist.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      واتساب
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">نبذة تعريفية</h2>
              {isOwner && (
                <Link href="/profile/edit" className="flex items-center gap-1 rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors" title="تعديل">
                  <Pencil className="h-4 w-4" />
                </Link>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {specialist.bio || 'لم يتم إضافة نبذة تعريفية بعد'}
            </p>
          </div>

          {/* Full CV */}
          {specialist.cv && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  السيرة الذاتية
                </h2>
                {isOwner && (
                  <Link href="/profile/edit" className="flex items-center gap-1 rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors" title="تعديل">
                    <Pencil className="h-4 w-4" />
                  </Link>
                )}
              </div>
              {specialist.cv.startsWith('/') || specialist.cv.startsWith('http') ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <FileText className="h-16 w-16 text-emerald-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">ملف السيرة الذاتية (PDF)</p>
                  <a href={specialist.cv} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      تحميل السيرة الذاتية
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {specialist.cv}
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {specialist.certifications && specialist.certifications.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  الشهادات والدورات التكوينية
                </h2>
                {isOwner && (
                  <Link href="/profile/edit" className="flex items-center gap-1 rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors" title="إضافة">
                    <Plus className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {specialist.certifications.map((cert) => {
                  const Icon = certificationTypeIcons[cert.type] || Award
                  return (
                    <div
                      key={cert.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-emerald-200 hover:shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900">{cert.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
                            {certificationTypeLabels[cert.type] || cert.type}
                          </span>
                          {cert.issuer && <span>{cert.issuer}</span>}
                          {cert.year && <span>{cert.year}</span>}
                        </div>
                        {cert.description && (
                          <p className="mt-1 text-xs text-gray-600">{cert.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Competencies */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">الاختصاصات والمجالات</h2>
              {isOwner && (
                <Link href="/profile/edit" className="flex items-center gap-1 rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 transition-colors" title="إضافة">
                  <Plus className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid gap-4">
              {specialist.competencies.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <CheckCircle className={`h-5 w-5 shrink-0 ${comp.isVerified ? 'text-emerald-500' : 'text-gray-300'}`} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {comp.specialty?.nameArabic || comp.specialty?.name}
                    </p>
                    {comp.category && (
                      <p className="text-xs text-gray-500">
                        {comp.category.nameArabic || comp.category.name}
                      </p>
                    )}
                  </div>
                  {comp.isMain && (
                    <Badge variant="default" className="mr-auto">رئيسي</Badge>
                  )}
                </div>
              ))}
            </div>
            {specialist.competencies.length === 0 && (
              <p className="text-sm text-gray-500">لم يتم إضافة اختصاصات بعد</p>
            )}
          </div>

          {/* Languages */}
          {specialist.languages && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">اللغات</h2>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(specialist.languages).map((lang: string, i: number) => (
                  <Badge key={i} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              التقييمات ({specialist.ratingCount})
            </h2>
            {specialist.reviewsReceived.length > 0 ? (
              <div className="space-y-4">
                {specialist.reviewsReceived.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                        {(review.reviewer.nameArabic || review.reviewer.name).charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.reviewer.nameArabic || review.reviewer.name}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">لا توجد تقييمات بعد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
