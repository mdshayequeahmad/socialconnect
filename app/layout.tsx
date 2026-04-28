import './globals.css'
import Navbar from '@/components/ui/Navbar'

export const metadata = {
  title: 'SocialConnect',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}