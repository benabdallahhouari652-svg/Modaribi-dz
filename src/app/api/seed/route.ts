import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// ========== Categories ==========
const CATEGORIES = [
  { name: 'Team Sports', nameArabic: 'الرياضات الجماعية', slug: 'team-sports', icon: '🏆', order: 1 },
  { name: 'Individual Sports', nameArabic: 'الرياضات الفردية', slug: 'individual-sports', icon: '🏊', order: 2 },
  { name: 'Sports Competencies', nameArabic: 'الكفاءات الرياضية', slug: 'sports-competencies', icon: '👨‍🏫', order: 3 },
  { name: 'Health & Physical', nameArabic: 'القسم الصحي والبدني', slug: 'health-physical', icon: '🩺', order: 4 },
  { name: 'Education & Animation', nameArabic: 'التنشيط والتأطير التربوي', slug: 'education-animation', icon: '🏕️', order: 5 },
  { name: 'Management', nameArabic: 'القسم الإداري والتسييري', slug: 'management', icon: '👔', order: 6 },
  { name: 'Scouting', nameArabic: 'الاستكشاف والانتدابات', slug: 'scouting', icon: '🔎', order: 7 },
  { name: 'Media', nameArabic: 'القسم الإعلامي والداعم', slug: 'media', icon: '🎥', order: 8 },
]

const SPECIALTIES = [
  // Team Sports
  { name: 'Football', nameArabic: 'كرة القدم', slug: 'football', icon: '⚽', categorySlug: 'team-sports' },
  { name: 'Handball', nameArabic: 'كرة اليد', slug: 'handball', icon: '🤾', categorySlug: 'team-sports' },
  { name: 'Basketball', nameArabic: 'كرة السلة', slug: 'basketball', icon: '🏀', categorySlug: 'team-sports' },
  { name: 'Volleyball', nameArabic: 'الكرة الطائرة', slug: 'volleyball', icon: '🏐', categorySlug: 'team-sports' },
  // Individual Sports
  { name: 'Swimming', nameArabic: 'السباحة', slug: 'swimming', icon: '🏊', categorySlug: 'individual-sports' },
  { name: 'Athletics', nameArabic: 'ألعاب القوى', slug: 'athletics', icon: '🏃', categorySlug: 'individual-sports' },
  { name: 'Bodybuilding', nameArabic: 'كمال الأجسام', slug: 'bodybuilding', icon: '💪', categorySlug: 'individual-sports' },
  { name: 'Boxing', nameArabic: 'الملاكمة', slug: 'boxing', icon: '🥊', categorySlug: 'individual-sports' },
  { name: 'Martial Arts', nameArabic: 'الفنون القتالية', slug: 'martial-arts', icon: '🥋', categorySlug: 'individual-sports' },
  { name: 'Tennis', nameArabic: 'التنس', slug: 'tennis', icon: '🎾', categorySlug: 'individual-sports' },
  // Sports Competencies
  { name: 'Team Coach', nameArabic: 'مدرب فرق رياضية', slug: 'team-coach', categorySlug: 'sports-competencies' },
  { name: 'Goalkeeper Coach', nameArabic: 'مدرب حراس مرمى', slug: 'gk-coach', icon: '🧤', categorySlug: 'sports-competencies' },
  { name: 'Fitness Coach', nameArabic: 'محضر بدني', slug: 'fitness-coach', icon: '🏃', categorySlug: 'sports-competencies' },
  { name: 'Performance Analyst', nameArabic: 'محلل أداء رياضي', slug: 'performance-analyst', icon: '📊', categorySlug: 'sports-competencies' },
  { name: 'Technical Director', nameArabic: 'مدير فني رياضي', slug: 'technical-director', categorySlug: 'sports-competencies' },
  // Health
  { name: 'Sports Massage', nameArabic: 'مدلك رياضي', slug: 'sports-massage', icon: '💆', categorySlug: 'health-physical' },
  { name: 'Physiotherapy', nameArabic: 'أخصائي علاج فيزيائي', slug: 'physiotherapy', icon: '🩺', categorySlug: 'health-physical' },
  { name: 'Sports Nutrition', nameArabic: 'أخصائي تغذية رياضية', slug: 'sports-nutrition', icon: '🥗', categorySlug: 'health-physical' },
  // Education
  { name: 'Camp Leader', nameArabic: 'منشط مخيمات صيفية', slug: 'camp-leader', categorySlug: 'education-animation' },
  { name: 'Camp Director', nameArabic: 'مدير مخيمات صيفية', slug: 'camp-director', categorySlug: 'education-animation' },
  { name: 'Training Camp Supervisor', nameArabic: 'مؤطر تربصات رياضية', slug: 'training-camp-supervisor', categorySlug: 'education-animation' },
  // Management
  { name: 'Sports Manager', nameArabic: 'مناجير رياضي', slug: 'sports-manager', categorySlug: 'management' },
  { name: 'Player Agent', nameArabic: 'وكيل لاعبين', slug: 'player-agent', categorySlug: 'management' },
  { name: 'Club Director', nameArabic: 'مسير فريق رياضي', slug: 'club-director', categorySlug: 'management' },
  // Scouting
  { name: 'Talent Scout', nameArabic: 'كشاف رياضي', slug: 'talent-scout', categorySlug: 'scouting' },
  { name: 'Talent Discoverer', nameArabic: 'مكتشف مواهب', slug: 'talent-discoverer', categorySlug: 'scouting' },
  // Media
  { name: 'Sports Journalist', nameArabic: 'صحفي رياضي', slug: 'sports-journalist', categorySlug: 'media' },
  { name: 'Sports Photographer', nameArabic: 'مصور رياضي', slug: 'sports-photographer', categorySlug: 'media' },
  { name: 'Content Creator', nameArabic: 'صانع محتوى رياضي', slug: 'content-creator', categorySlug: 'media' },
]

export async function GET() {
  try {
    const prisma = new PrismaClient()

    const results: string[] = []

    // 1. Create categories
    for (const cat of CATEGORIES) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      })
    }
    results.push(`✅ ${CATEGORIES.length} categories`)

    // 2. Create specialties
    for (const spec of SPECIALTIES) {
      const category = await prisma.category.findUnique({ where: { slug: spec.categorySlug } })
      if (category) {
        const { categorySlug, ...specData } = spec
        await prisma.specialty.upsert({
          where: { slug: spec.slug },
          update: { ...specData, categoryId: category.id },
          create: { ...specData, categoryId: category.id },
        })
      }
    }
    results.push(`✅ ${SPECIALTIES.length} specialties`)

    await prisma.$disconnect()

    return NextResponse.json({ success: true, message: results.join('\n') })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
