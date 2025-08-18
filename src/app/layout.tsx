import '@/styles/globals.css'
import { Metadata } from 'next'
import QueryProvider from '@/shared/components/query-provider'
import { ViewProvider } from '@/context/view-context'
import { DashboardSettingsProvider } from '@/shared/contexts/dashboard-settings-context'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { siteConfig } from '@/shared/config/site'

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
  // themeColor: siteConfig.meta.themeColor,
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="pb-[7.43vh]">
        <QueryProvider>
          <ViewProvider>
            <DashboardSettingsProvider>{children}</DashboardSettingsProvider>
          </ViewProvider>
        </QueryProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
