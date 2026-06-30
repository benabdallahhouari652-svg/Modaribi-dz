import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'

import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ThemeProvider } from '@/components/theme/theme-provider'

export const metadata: Metadata = {
  title: 'مدربي DZ - منصة الكفاءات الرياضية الجزائرية',
  description: 'منصة تجمع الكفاءات الرياضية والتربوية والعلمية في الجزائر. تواصل، فرص عمل، تبادل خبرات.',
  keywords: ['رياضة', 'مدربين', 'الجزائر', 'كفاءات رياضية', 'تدريب', 'منصة رياضية'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans antialiased transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
