import "./globals.css";
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 min-h-screen">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center gap-2"
            >
              🌱 30Plants
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/all-lists"
                className="text-gray-300 hover:text-white transition-colors"
              >
                All Lists
              </Link>
              <Link
                href="/collections"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Collections
              </Link>
            </nav>
          </div>
        </header>
        <div className="min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </body>
    </html>
  );
}
