import './globals.css'

export const metadata = {
  title: 'Salman Khan — Full Stack Developer',
  description: 'Premium portfolio of Salman Khan — Full Stack Developer. React, TypeScript, Django, Flask, PostgreSQL, Docker, Machine Learning.',
  keywords: ['Salman Khan', 'Full Stack Developer', 'React', 'Django', 'Next.js', 'Portfolio', 'Kerala', 'MSc Computer Science'],
  authors: [{ name: 'Salman Khan' }],
  openGraph: {
    title: 'Salman Khan — Full Stack Developer',
    description: 'Crafting premium digital experiences with modern web technologies.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#F2F2F2',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#F2F2F2] text-[#111] antialiased">{children}</body>
    </html>
  )
}
