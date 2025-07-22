import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Head from 'next/head'
import { siteConfig } from '@/shared/config/site'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.meta.title.default,
    template: siteConfig.meta.title.template,
  },
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords,
  authors: siteConfig.meta.authors,
  creator: siteConfig.meta.creator,
  applicationName: siteConfig.meta.openGraph.siteName,
  openGraph: {
    type: 'website',
    locale: siteConfig.meta.openGraph.locale,
    url: siteConfig.meta.openGraph.url,
    title: siteConfig.meta.openGraph.title,
    description: siteConfig.meta.openGraph.description,
    siteName: siteConfig.meta.openGraph.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.meta.twitter.title,
    description: siteConfig.meta.twitter.description,
    creator: siteConfig.meta.twitter.creator,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
