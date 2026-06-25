import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Modaribi DZ database...')

  // Clean existing data
  await prisma.article.deleteMany()
  await prisma.innovation.deleteMany()
  await prisma.libraryResource.deleteMany()
  await prisma.message.deleteMany()
  await prisma.review.deleteMany()
  await prisma.competency.deleteMany()
  await prisma.specialty.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleaned existing data')

  // ========== Create Admin User ==========
  const admin = await prisma.user.create({
    data: {
      name: 'Houari Benabdallah',
      surname: 'بن عبد الله',
      nameArabic: 'بن عبد الله الهواري',
      email: 'admin@modaribi.dz',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SUPER_ADMIN',
      isActive: true,
      title: 'مربي رياضي • محلل أداء • مدرب حراس مرمى',
      bio: 'مربي رياضي، محلل أداء، مدرب حراس مرمى، منشط مخيمات صيفية، مراسل صحفي رياضي. صاحب فكرة ومؤسس مشروع مدربي DZ.',
      cv: 'مربي رياضي معتمد، محلل أداء رياضي، مدرب حراس مرمى محترف.\nخبرة 10 سنوات في المجال الرياضي والتربوي.\nمنشط مخيمات صيفية ومراسل صحفي رياضي.\nصاحب فكرة ومؤسس مشروع مدربي DZ.',
      phone: '+213-XXX-XXX-XXX',
      wilaya: 'الجزائر',
      maritalStatus: 'MARRIED',
      gender: 'MALE',
      isContracted: false,
      acceptsRemoteWork: true,
      acceptsTravel: true,
      acceptsWorkOutside: true,
      experienceYears: 10,
      languages: JSON.stringify(['العربية', 'الإنجليزية', 'الفرنسية']),
      ratingAvg: 4.8,
      ratingCount: 15,
    },
  })
  console.log(`✅ Created admin: ${admin.name}`)

  // ========== Create Categories ==========
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Team Sports',
        nameArabic: 'الرياضات الجماعية',
        slug: 'team-sports',
        icon: '🏆',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Individual Sports',
        nameArabic: 'الرياضات الفردية',
        slug: 'individual-sports',
        icon: '🏊',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports Competencies',
        nameArabic: 'الكفاءات الرياضية',
        slug: 'sports-competencies',
        icon: '👨‍🏫',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Health & Physical',
        nameArabic: 'القسم الصحي والبدني',
        slug: 'health-physical',
        icon: '🩺',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Education & Animation',
        nameArabic: 'التنشيط والتأطير التربوي',
        slug: 'education-animation',
        icon: '🏕️',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Management',
        nameArabic: 'القسم الإداري والتسييري',
        slug: 'management',
        icon: '👔',
        order: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Scouting',
        nameArabic: 'الاستكشاف والانتدابات',
        slug: 'scouting',
        icon: '🔎',
        order: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Media',
        nameArabic: 'القسم الإعلامي والداعم',
        slug: 'media',
        icon: '🎥',
        order: 8,
      },
    }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // ========== Create Subcategories & Specialties ==========
  const teamSports = categories[0]
  const individualSports = categories[1]
  const competencies = categories[2]
  const health = categories[3]
  const education = categories[4]
  const management = categories[5]
  const scouting = categories[6]
  const media = categories[7]

  // Team Sports subcategories
  const football = await prisma.specialty.create({
    data: {
      name: 'Football',
      nameArabic: 'كرة القدم',
      slug: 'football',
      icon: '⚽',
      categoryId: teamSports.id,
    },
  })
  const handball = await prisma.specialty.create({
    data: {
      name: 'Handball',
      nameArabic: 'كرة اليد',
      slug: 'handball',
      icon: '🤾',
      categoryId: teamSports.id,
    },
  })
  const basketball = await prisma.specialty.create({
    data: {
      name: 'Basketball',
      nameArabic: 'كرة السلة',
      slug: 'basketball',
      icon: '🏀',
      categoryId: teamSports.id,
    },
  })
  const volleyball = await prisma.specialty.create({
    data: {
      name: 'Volleyball',
      nameArabic: 'الكرة الطائرة',
      slug: 'volleyball',
      icon: '🏐',
      categoryId: teamSports.id,
    },
  })

  // Individual Sports subcategories
  await prisma.specialty.create({
    data: {
      name: 'Swimming',
      nameArabic: 'السباحة',
      slug: 'swimming',
      icon: '🏊',
      categoryId: individualSports.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Athletics',
      nameArabic: 'ألعاب القوى',
      slug: 'athletics',
      icon: '🏃',
      categoryId: individualSports.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Bodybuilding',
      nameArabic: 'كمال الأجسام',
      slug: 'bodybuilding',
      icon: '💪',
      categoryId: individualSports.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Boxing',
      nameArabic: 'الملاكمة',
      slug: 'boxing',
      icon: '🥊',
      categoryId: individualSports.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Martial Arts',
      nameArabic: 'الفنون القتالية',
      slug: 'martial-arts',
      icon: '🥋',
      categoryId: individualSports.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Tennis',
      nameArabic: 'التنس',
      slug: 'tennis',
      icon: '🎾',
      categoryId: individualSports.id,
    },
  })

  // Sports Competencies subcategories
  await prisma.specialty.create({
    data: {
      name: 'Team Coach',
      nameArabic: 'مدرب فرق رياضية',
      slug: 'team-coach',
      categoryId: competencies.id,
    },
  })
  const gkCoach = await prisma.specialty.create({
    data: {
      name: 'Goalkeeper Coach',
      nameArabic: 'مدرب حراس مرمى',
      slug: 'gk-coach',
      icon: '🧤',
      categoryId: competencies.id,
    },
  })
  const fitnessCoach = await prisma.specialty.create({
    data: {
      name: 'Fitness Coach',
      nameArabic: 'محضر بدني',
      slug: 'fitness-coach',
      icon: '🏃',
      categoryId: competencies.id,
    },
  })
  const analyst = await prisma.specialty.create({
    data: {
      name: 'Performance Analyst',
      nameArabic: 'محلل أداء رياضي',
      slug: 'performance-analyst',
      icon: '📊',
      categoryId: competencies.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Technical Director',
      nameArabic: 'مدير فني رياضي',
      slug: 'technical-director',
      categoryId: competencies.id,
    },
  })

  // Health subcategories
  await prisma.specialty.create({
    data: {
      name: 'Sports Massage',
      nameArabic: 'مدلك رياضي',
      slug: 'sports-massage',
      icon: '💆',
      categoryId: health.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Physiotherapy',
      nameArabic: 'أخصائي علاج فيزيائي',
      slug: 'physiotherapy',
      icon: '🩺',
      categoryId: health.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Sports Nutrition',
      nameArabic: 'أخصائي تغذية رياضية',
      slug: 'sports-nutrition',
      icon: '🥗',
      categoryId: health.id,
    },
  })

  // Education subcategories
  await prisma.specialty.create({
    data: {
      name: 'Camp Leader',
      nameArabic: 'منشط مخيمات صيفية',
      slug: 'camp-leader',
      categoryId: education.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Camp Director',
      nameArabic: 'مدير مخيمات صيفية',
      slug: 'camp-director',
      categoryId: education.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Training Camp Supervisor',
      nameArabic: 'مؤطر تربصات رياضية',
      slug: 'training-camp-supervisor',
      categoryId: education.id,
    },
  })

  // Management subcategories
  await prisma.specialty.create({
    data: {
      name: 'Sports Manager',
      nameArabic: 'مناجير رياضي',
      slug: 'sports-manager',
      categoryId: management.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Player Agent',
      nameArabic: 'وكيل لاعبين',
      slug: 'player-agent',
      categoryId: management.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Club Director',
      nameArabic: 'مسير فريق رياضي',
      slug: 'club-director',
      categoryId: management.id,
    },
  })

  // Scouting subcategories
  await prisma.specialty.create({
    data: {
      name: 'Talent Scout',
      nameArabic: 'كشاف رياضي',
      slug: 'talent-scout',
      categoryId: scouting.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Talent Discoverer',
      nameArabic: 'مكتشف مواهب',
      slug: 'talent-discoverer',
      categoryId: scouting.id,
    },
  })

  // Media subcategories
  await prisma.specialty.create({
    data: {
      name: 'Sports Journalist',
      nameArabic: 'صحفي رياضي',
      slug: 'sports-journalist',
      categoryId: media.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Sports Photographer',
      nameArabic: 'مصور رياضي',
      slug: 'sports-photographer',
      categoryId: media.id,
    },
  })
  await prisma.specialty.create({
    data: {
      name: 'Content Creator',
      nameArabic: 'صانع محتوى رياضي',
      slug: 'content-creator',
      categoryId: media.id,
    },
  })

  console.log('✅ Created all specialties')

  // ========== Create Sample Users ==========
  const sampleUsers = [
    {
      name: 'Ahmed Mansour',
      surname: 'منصور',
      nameArabic: 'أحمد منصور',
      email: 'ahmed@example.com',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SPECIALIST' as const,
      title: 'مدرب كرة قدم معتمد',
      bio: 'مدرب كرة قدم معتمد من الفاف. خبرة 15 سنة في تدريب الفئات الشبابية والأكاديميات.',
      cv: 'مدرب كرة قدم معتمد من الاتحادية الجزائرية لكرة القدم.\nخبرة 15 سنة في تدريب الفئات الشبابية والأكاديميات.\nحاصل على شهادة التدريب الدولية.',
      phone: '+213-555-111-222',
      wilaya: 'وهران',
      experienceYears: 15,
      languages: JSON.stringify(['العربية', 'الفرنسية']),
      availability: 'AVAILABLE' as const,
      maritalStatus: 'MARRIED' as const,
      gender: 'MALE' as const,
      isContracted: true,
      acceptsRemoteWork: false,
      acceptsTravel: true,
      acceptsWorkOutside: false,
      ratingAvg: 4.5,
      ratingCount: 8,
    },
    {
      name: 'Fatima Zahra',
      surname: 'الزهراء',
      nameArabic: 'فاطمة الزهراء',
      email: 'fatima@example.com',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SPECIALIST' as const,
      title: 'محضرة بدنية',
      bio: 'محضرة بدنية متخصصة في الإعداد البدني للرياضيين. خبرة في العمل مع الأندية المحترفة.',
      cv: 'محضرة بدنية محترفة.\nخبرة 8 سنوات في الإعداد البدني للرياضيين.\nعملت مع عدة أندية محترفة في الجزائر.',
      phone: '+213-555-333-444',
      wilaya: 'الجزائر',
      experienceYears: 8,
      languages: JSON.stringify(['العربية', 'الإنجليزية', 'الفرنسية']),
      availability: 'AVAILABLE' as const,
      maritalStatus: 'SINGLE' as const,
      gender: 'FEMALE' as const,
      isContracted: true,
      acceptsRemoteWork: true,
      acceptsTravel: true,
      acceptsWorkOutside: true,
      ratingAvg: 4.7,
      ratingCount: 12,
    },
    {
      name: 'Karim Hadj',
      surname: 'حاج',
      nameArabic: 'كريم حاج',
      email: 'karim@example.com',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SPECIALIST' as const,
      title: 'مدرب حراس مرمى',
      bio: 'مدرب حراس مرمى محترف. عملت مع عدة أندية في الرابطة الأولى والثانية.',
      cv: 'مدرب حراس مرمى محترف.\nخبرة 12 سنة في تدريب حراس المرمى.\nعملت مع أندية الرابطة الأولى والثانية الجزائرية.\nأقدم برامج تدريبية فردية وجماعية.',
      phone: '+213-555-555-666',
      wilaya: 'قسنطينة',
      experienceYears: 12,
      languages: JSON.stringify(['العربية', 'الفرنسية']),
      availability: 'AVAILABLE' as const,
      maritalStatus: 'MARRIED' as const,
      gender: 'MALE' as const,
      isContracted: false,
      acceptsRemoteWork: false,
      acceptsTravel: true,
      acceptsWorkOutside: false,
      ratingAvg: 4.9,
      ratingCount: 20,
    },
    {
      name: 'Sofia Boumediene',
      surname: 'بومدين',
      nameArabic: 'صوفيا بومدين',
      email: 'sofia@example.com',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SPECIALIST' as const,
      title: 'أخصائية تغذية رياضية',
      bio: 'أخصائية تغذية رياضية. أساعد الرياضيين على تحسين أدائهم من خلال التغذية السليمة.',
      cv: 'أخصائية تغذية رياضية معتمدة.\nخبرة 6 سنوات في مجال التغذية الرياضية.\nأساعد الرياضيين على تحسين أدائهم من خلال برامج غذائية مخصصة.',
      phone: '+213-555-777-888',
      wilaya: 'عنابة',
      experienceYears: 6,
      languages: JSON.stringify(['العربية', 'الإنجليزية', 'الفرنسية']),
      availability: 'AVAILABLE' as const,
      maritalStatus: 'SINGLE' as const,
      gender: 'FEMALE' as const,
      isContracted: false,
      acceptsRemoteWork: true,
      acceptsTravel: true,
      acceptsWorkOutside: false,
      ratingAvg: 4.6,
      ratingCount: 10,
    },
    {
      name: 'Mohamed Lamine',
      surname: 'الأمين',
      nameArabic: 'محمد الأمين',
      email: 'mohamed@example.com',
      passwordHash: '$2b$10$x9H4ofxu48GYMzflsi.K/eKmYcix20VrkWQfYLTa/0CxsYwjPVjrG',
      role: 'SPECIALIST' as const,
      title: 'محلل أداء رياضي',
      bio: 'محلل أداء رياضي باستخدام أحدث التقنيات. متخصص في تحليل المباريات والأداء الفردي.',
      cv: 'محلل أداء رياضي متخصص.\nخبرة 7 سنوات في تحليل المباريات والأداء الفردي.\nأستخدم أحدث التقنيات والبرامج التحليلية.\nأقدم حصصاً فردية لتحليل الأداء.',
      phone: '+213-555-999-000',
      wilaya: 'البليدة',
      experienceYears: 7,
      languages: JSON.stringify(['العربية', 'الإنجليزية', 'الفرنسية']),
      availability: 'AVAILABLE' as const,
      maritalStatus: 'MARRIED' as const,
      gender: 'MALE' as const,
      isContracted: true,
      acceptsRemoteWork: true,
      acceptsTravel: true,
      acceptsWorkOutside: true,
      ratingAvg: 4.4,
      ratingCount: 6,
    },
  ]

  const createdUsers = []
  for (const userData of sampleUsers) {
    const user = await prisma.user.create({ data: userData })
    createdUsers.push(user)
  }
  console.log(`✅ Created ${createdUsers.length} sample users`)

  // ========== Create Competencies ==========
  const competencyData = [
    { userId: createdUsers[0].id, specialtyId: football.id, categoryId: teamSports.id, isMain: true, isVerified: true },
    { userId: createdUsers[0].id, specialtyId: gkCoach.id, categoryId: competencies.id, isMain: false, isVerified: true },
    { userId: createdUsers[1].id, specialtyId: fitnessCoach.id, categoryId: competencies.id, isMain: true, isVerified: true },
    { userId: createdUsers[2].id, specialtyId: gkCoach.id, categoryId: competencies.id, isMain: true, isVerified: true },
    { userId: createdUsers[2].id, specialtyId: football.id, categoryId: teamSports.id, isMain: false, isVerified: true },
    { userId: createdUsers[3].id, specialtyId: (await prisma.specialty.findFirst({ where: { slug: 'sports-nutrition' } }))!.id, categoryId: health.id, isMain: true, isVerified: true },
    { userId: createdUsers[4].id, specialtyId: analyst.id, categoryId: competencies.id, isMain: true, isVerified: true },
    { userId: createdUsers[4].id, specialtyId: fitnessCoach.id, categoryId: competencies.id, isMain: false, isVerified: false },
  ]

  for (const comp of competencyData) {
    await prisma.competency.create({ data: comp })
  }
  console.log('✅ Created competencies')

  // ========== Create Sample Certifications ==========
  const certifications = [
    { userId: admin.id, title: 'مدرب حراس مرمى معتمد', type: 'COACHING' as const, issuer: 'الفاف', year: 2018 },
    { userId: admin.id, title: 'شهادة الليسانس في التربية البدنية', type: 'ACADEMIC' as const, issuer: 'جامعة الجزائر', year: 2015, description: 'تخصص تربية بدنية ورياضية' },
    { userId: admin.id, title: 'دورة تحليل الأداء الرياضي', type: 'TRAINING' as const, issuer: 'منصة كورا الدولية', year: 2022 },
    { userId: admin.id, title: 'الماجستير في تحليل الأداء', type: 'ACADEMIC' as const, issuer: 'جامعة الجزائر', year: 2017 },
    { userId: admin.id, title: 'شهادة التدريب الدولية', type: 'INTERNATIONAL' as const, issuer: 'CAF', year: 2020 },
    { userId: createdUsers[0].id, title: 'شهادة تدريب كرة قدم', type: 'COACHING' as const, issuer: 'الفاف', year: 2015 },
    { userId: createdUsers[0].id, title: 'شهادة الليسانس', type: 'ACADEMIC' as const, issuer: 'جامعة وهران', year: 2012 },
    { userId: createdUsers[2].id, title: 'شهادة تدريب حراس مرمى', type: 'COACHING' as const, issuer: 'الفاف', year: 2016 },
    { userId: createdUsers[2].id, title: 'دورة حراس المرمى المتقدمة', type: 'INTERNATIONAL' as const, issuer: 'الاتحاد الأوروبي', year: 2019 },
    { userId: createdUsers[1].id, title: 'شهادة الإعداد البدني', type: 'PROFESSIONAL' as const, issuer: 'المعهد العالي للرياضة', year: 2018 },
  ]

  for (const cert of certifications) {
    await prisma.certification.create({ data: cert })
  }
  console.log('✅ Created certifications')

  // ========== Create Sample Reviews ==========
  const reviews = [
    { rating: 5, comment: 'مدرب ممتاز جداً، تعاملت معه وكان احترافياً في عمله.', reviewerId: admin.id, targetId: createdUsers[2].id },
    { rating: 4, comment: 'مختصة محترفة، ساعدتني في تحسين لياقتي البدنية.', reviewerId: admin.id, targetId: createdUsers[1].id },
    { rating: 5, comment: 'مختص ممتاز في تحليل الأداء، أنصح به.', reviewerId: createdUsers[0].id, targetId: createdUsers[4].id },
  ]

  for (const review of reviews) {
    await prisma.review.create({ data: review })
  }
  console.log('✅ Created reviews')

  // ========== Create Sample Library Resources ==========
  const libraryResources = [
    {
      title: 'Modern Goalkeeping Techniques',
      titleArabic: 'تقنيات الحراسة الحديثة',
      description: 'كتاب شامل عن أحدث تقنيات تدريب حراس المرمى',
      type: 'BOOK' as const,
      author: 'Houari Benabdallah',
      authorId: admin.id,
      categoryId: teamSports.id,
      tags: JSON.stringify(['حراس مرمى', 'تدريب', 'تقنيات']),
      isPublished: true,
      views: 234,
      downloads: 56,
    },
    {
      title: 'Periodization in Football',
      titleArabic: 'التخطيط الموسمي في كرة القدم',
      description: 'دراسة علمية حول التخطيط الموسمي للفرق الرياضية',
      type: 'RESEARCH' as const,
      author: 'Dr. Ahmed Mansour',
      authorId: createdUsers[0].id,
      categoryId: competencies.id,
      tags: JSON.stringify(['تخطيط', 'كرة قدم', 'موسمي']),
      isPublished: true,
      views: 189,
      downloads: 34,
    },
    {
      title: 'Youth Training Programs',
      titleArabic: 'برامج تدريب الفئات الشبابية',
      description: 'برامج تدريبية متكاملة للفئات العمرية الصغرى',
      type: 'TRAINING_PROGRAM' as const,
      author: 'Houari Benabdallah',
      authorId: admin.id,
      categoryId: competencies.id,
      tags: JSON.stringify(['شباب', 'تدريب', 'برامج']),
      isPublished: true,
      views: 312,
      downloads: 89,
    },
  ]

  for (const resource of libraryResources) {
    await prisma.libraryResource.create({ data: resource })
  }
  console.log('✅ Created library resources')

  // ========== Create Sample Articles ==========
  const articles = [
    {
      title: 'Modern Goalkeeper Training Methods',
      titleArabic: 'أحدث أساليب تدريب حراس المرمى',
      slug: 'modern-gk-training-methods',
      excerpt: 'تعرف على أحدث الأساليب والتقنيات المستخدمة في تدريب حراس المرمى حول العالم',
      content: 'يشهد عالم كرة القدم تطوراً مستمراً في أساليب تدريب حراس المرمى، حيث لم يعد الحارس مجرد لاعب يرتدي قفازات، بل أصبح عنصراً حاسماً في بناء الهجمات وقراءة المباراة.\n\nمن أهم الأساليب الحديثة:\n\n1. التدريب على القراءة المبكرة للمباراة: تعتمد على تحليل تحركات المهاجمين وتوقع اتجاه التسديد.\n\n2. التمرير تحت الضغط: أصبح الحارس جزءاً من بناء الهجمات، ويتطلب ذلك تدريباً مكثفاً على التمرير بدقة تحت الضغط.\n\n3. التحليل بالفيديو: استخدام التكنولوجيا لتحليل أداء الحراس وتحديد نقاط القوة والضعف.\n\n4. التدريب الذهني: التركيز على الجانب النفسي والذهني للحارس لتحسين التركيز واتخاذ القرارات السريعة.\n\n5. التغذية الرياضية: برامج غذائية مخصصة لحراس المرمى لتحسين الأداء البدني.\n\nلم يعد التدريب التقليدي كافياً لإعداد حارس مرمى محترف، بل يجب الجمع بين الجوانب البدنية والفنية والذهنية.',
      coverImage: null,
      authorId: admin.id,
      categoryId: teamSports.id,
      tags: JSON.stringify(['حراس مرمى', 'تدريب', 'تقنيات حديثة', 'كرة قدم']),
      isPublished: true,
      views: 342,
      likes: 28,
    },
    {
      title: 'Sports Nutrition: A Comprehensive Guide',
      titleArabic: 'التغذية الرياضية: دليل شامل',
      slug: 'sports-nutrition-guide',
      excerpt: 'دليل شامل لأهم المبادئ الغذائية التي يجب على كل رياضي اتباعها لتحسين الأداء',
      content: 'التغذية السليمة هي أساس الأداء الرياضي المتميز. سواء كنت لاعباً محترفاً أو هاوياً، فإن ما تتناوله من طعام يؤثر بشكل مباشر على أدائك.\n\nالمبادئ الأساسية للتغذية الرياضية:\n\n1. الكربوهيدرات: مصدر الطاقة الرئيسي للرياضي. يجب تناول كميات كافية قبل التمرين وبعده.\n\n2. البروتينات: ضرورية لبناء وإصلاح العضلات. يوصى بتناول 1.6-2.2 غرام لكل كيلوغرام من وزن الجسم.\n\n3. الدهون الصحية: مصدر مهم للطاقة في التمارين الطويلة. تشمل الأفوكادو والمكسرات وزيت الزيتون.\n\n4. الفيتامينات والمعادن: ضرورية لوظائف الجسم الحيوية وتعزيز المناعة.\n\n5. الترطيب: شرب الماء بانتظام قبل وأثناء وبعد التمرين.\n\n6. توقيت الوجبات: تنظيم مواعيد الوجبات قبل وبعد التمرين لتحقيق أقصى استفادة.\n\nتذكر أن كل رياضي له احتياجاته الغذائية الخاصة، لذا يفضل استشارة أخصائي تغذية رياضية.',
      coverImage: null,
      authorId: admin.id,
      categoryId: health.id,
      tags: JSON.stringify(['تغذية', 'صحة', 'رياضة', 'دليل']),
      isPublished: true,
      views: 567,
      likes: 45,
    },
    {
      title: 'Performance Analysis in Modern Football',
      titleArabic: 'تحليل الأداء في كرة القدم الحديثة',
      slug: 'performance-analysis-football',
      excerpt: 'كيف يساعد تحليل الأداء في تطوير اللاعبين والفرق، وأهم الأدوات المستخدمة',
      content: 'أصبح تحليل الأداء جزءاً لا يتجزأ من كرة القدم الحديثة. لم يعد المدرب يعتمد فقط على حدسه، بل يستخدم البيانات والإحصائيات لاتخاذ القرارات.\n\nأهم مجالات تحليل الأداء:\n\n1. تحليل المباريات: دراسة أداء الفريق ككل والخصم لتحديد نقاط القوة والضعف.\n\n2. تحليل الأداء الفردي: متابعة أداء كل لاعب على حدة وتحديد مجالات التحسين.\n\n3. التحليل التكتيكي: دراسة الخطط والتشكيلات والتحركات التكتيكية.\n\n4. التحليل البدني: قياس المسافات المقطوعة والسرعة والتسارع والإجهاد.\n\nالأدوات المستخدمة:\n- برامج تحليل الفيديو (مثل Hudl و Catapult)\n- أنظمة تتبع اللاعبين (GPS)\n- لوحات البيانات (Dashboards)\n- الذكاء الاصطناعي لتحليل الأنماط\n\nتحليل الأداء ليس مجرد رفاهية، بل ضرورة لأي فريق يسعى للمنافسة على أعلى المستويات.',
      coverImage: null,
      authorId: admin.id,
      categoryId: competencies.id,
      tags: JSON.stringify(['تحليل أداء', 'تكتيك', 'تكنولوجيا', 'كرة قدم']),
      isPublished: true,
      views: 234,
      likes: 19,
    },
  ]

  for (const article of articles) {
    await prisma.article.create({ data: article })
  }
  console.log('✅ Created articles')

  // ========== Create Sample Innovations ==========
  const innovations = [
    {
      title: 'Smart Goalkeeper Gloves',
      titleArabic: 'قفازات حارس ذكية',
      description: 'قفازات حارس مرمى مزودة بحساسات لقياس قوة التصويبات ودقة التمرير وتحليل أداء الحارس',
      content: 'مشروع قفازات حارس مرمى ذكية تحتوي على حساسات ضغط وحركة لتحليل أداء الحارس وتقديم إحصائيات دقيقة عن التصويبات والتمرير والتحكم بالكرة.',
      userId: admin.id,
      categoryId: teamSports.id,
      tags: JSON.stringify(['حراس مرمى', 'تكنولوجيا', 'ابتكار', 'ذكاء اصطناعي']),
      isApproved: true,
      likes: 45,
    },
    {
      title: 'AI Training Assistant App',
      titleArabic: 'تطبيق مساعد تدريب بالذكاء الاصطناعي',
      description: 'تطبيق يستخدم الذكاء الاصطناعي لإنشاء برامج تدريبية مخصصة لكل لاعب حسب مستواه وأهدافه',
      content: 'منصة رقمية تستخدم تقنيات الذكاء الاصطناعي لتحليل أداء اللاعبين وإنشاء برامج تدريبية مخصصة تناسب احتياجات كل لاعب.',
      userId: admin.id,
      categoryId: competencies.id,
      tags: JSON.stringify(['ذكاء اصطناعي', 'تدريب', 'تطبيق', 'تكنولوجيا']),
      isApproved: true,
      likes: 32,
    },
  ]

  for (const innovation of innovations) {
    await prisma.innovation.create({ data: innovation })
  }
  console.log('✅ Created innovations')

  console.log('\n🎉 Seed completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - ${categories.length} categories`)
  console.log(`   - Specialties in all 8 sections`)
  console.log(`   - ${createdUsers.length + 1} users`)
  console.log(`   - ${competencyData.length} competencies`)
  console.log(`   - ${reviews.length} reviews`)
  console.log(`   - ${certifications.length} certifications`)
  console.log(`   - ${libraryResources.length} library resources`)
  console.log(`   - ${articles.length} articles`)
  console.log(`   - ${innovations.length} innovations`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
