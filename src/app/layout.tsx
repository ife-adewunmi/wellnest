import "./globals.css";
import { Metadata } from 'next';
import QueryProvider from '@/shared/components/query-provider';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'WellNest',
  description: 'Student wellness tracking application',
  manifest: '/manifest.json',
  themeColor: '#317EFB',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
          <ToastContainer />
      </body>
    </html>
  )
}
