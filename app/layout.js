import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PlayQRIS',
  description: 'Effortlessly manage and interact with QRIS Indonesia Payment data on our platform. Easily read, modify, and update transaction details in a secure and user-friendly interface, streamlining your digital payment experience.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
