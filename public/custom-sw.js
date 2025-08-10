if (!self.define) {
  let e,
    s = {}
  const i = (i, a) => (
    (i = new URL(i + '.js', a).href),
    s[i] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;((e.src = i), (e.onload = s), document.head.appendChild(e))
        } else ((e = i), importScripts(i), s())
      }).then(() => {
        let e = s[i]
        if (!e) throw new Error(`Module ${i} didn’t register its module`)
        return e
      })
  )
  self.define = (a, c) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href
    if (s[n]) return
    let t = {}
    const r = (e) => i(e, n),
      u = { module: { uri: n }, exports: t, require: r }
    s[n] = Promise.all(a.map((e) => u[e] || r(e))).then((e) => (c(...e), t))
  }
}
define(['./workbox-e5ef0007'], function (e) {
  'use strict'
  ;(importScripts('fallback-jWZWyGLzY_i2DGuzN0Y57.js'),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/static/chunks/1144-d01e7643c612262e.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1247-091e43bbdf092c1f.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1321-ef8a326252a36f2a.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1492-baffe9a51eaefd0f.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1594-04eda8dc80c2e4ce.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1597-c17e878a97aae38c.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/164f4fb6.0a8cf1651537b860.js', revision: '0a8cf1651537b860' },
        { url: '/_next/static/chunks/1684-5daf046ace6952dd.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/1937-69fa1efef5754c51.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/2010-3aa5901bf7234bd3.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/2121.192ca3d1fff3cc4d.js', revision: '192ca3d1fff3cc4d' },
        {
          url: '/_next/static/chunks/2170a4aa-8be2e1de3df20b60.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        { url: '/_next/static/chunks/2971-4a20f3ed307f1970.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/3056-195f056b75082f2f.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/3455-9ff74c866981df11.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        {
          url: '/_next/static/chunks/4bd1b696-8aa9867a6426446f.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        { url: '/_next/static/chunks/519-f9877b680e9df61b.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/6118.394f5f75294d49ad.js', revision: '394f5f75294d49ad' },
        { url: '/_next/static/chunks/66-0f9ea2ba174169b4.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/6946-fa098dc2f3535f17.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/6977-76c3a5ecde5968d0.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/7790-caee91af5aa480c0.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/7983-2b4b0c0d3c8d95be.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/822.d1eebe7df2d8fc0a.js', revision: 'd1eebe7df2d8fc0a' },
        { url: '/_next/static/chunks/8543-fd35b82c4b698550.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/913.fb6bec3e460ba7b8.js', revision: 'fb6bec3e460ba7b8' },
        { url: '/_next/static/chunks/967-b1d2af69f260ca38.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/9756-f906c229ead9f265.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/9771-cfb1c6ce3fad7c92.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/_next/static/chunks/ad2866b8.1fc071285e350c45.js', revision: '1fc071285e350c45' },
        {
          url: '/_next/static/chunks/app/(auth)/signin/page-2b7568311bddbc61.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(auth)/signup/page-4767671cf2c5d28a.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/dashboard/page-0e00fb94f87f1d49.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/intervention/page-56ac95c74945ce39.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/messages/page-b2384c859a3206f2.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/notifications/page-107683398c6735bf.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/reports/page-938be39595946da0.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/settings/page-a7413301c1922eec.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/student/layout-151dba9fe6e000e0.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/student/messages/page-9a48966306a79e2f.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/student/page-dc50f8ca7b6e5fd9.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/student/privacy/page-8daadc2b8358b63b.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/student/sessions/page-3cdbac08bd3ec16d.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/(dashbaord)/students/page-7def889da3a02e00.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-dd675a313545ee69.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/auth/session/route-b52e8682fae84fa6.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/auth/signin/route-8d045260b615bd03.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/auth/signout/route-6512eb289d3dc898.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/auth/signup/route-6ebcabd8564460db.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/messages/route-607a1694e7d64128.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/notifications/%5Bid%5D/read/route-d17bae9c49021ac5.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/notifications/route-1c680656c42b9a46.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/sessions/route-94eb40da7d70d912.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/students/route-2754e70c16126eae.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/api/users/route-681e280ecbe24b92.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/layout-556dd547ef64db29.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/page-c0cd8c1bbd8f8dbc.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/app/student-table/page-c422eb6454c4e1cd.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        { url: '/_next/static/chunks/bc98253f.a20b3a3cf1b114d6.js', revision: 'a20b3a3cf1b114d6' },
        {
          url: '/_next/static/chunks/framework-82b67a6346ddd02b.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        { url: '/_next/static/chunks/main-1940583763ce3aa4.js', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        {
          url: '/_next/static/chunks/main-app-bc2df4e2f4941729.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/pages/_app-5d1abe03d322390c.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/pages/_error-3b2a1d523de49635.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-8deea4b6783afd9d.js',
          revision: 'jWZWyGLzY_i2DGuzN0Y57',
        },
        { url: '/_next/static/css/0ba209f381cb539b.css', revision: '0ba209f381cb539b' },
        { url: '/_next/static/css/42fdfff71f22b421.css', revision: '42fdfff71f22b421' },
        { url: '/_next/static/css/88554d6d76590b32.css', revision: '88554d6d76590b32' },
        { url: '/_next/static/css/c3d5158d8f0cbbba.css', revision: 'c3d5158d8f0cbbba' },
        { url: '/_next/static/css/cd11edec7f76121b.css', revision: 'cd11edec7f76121b' },
        { url: '/_next/static/css/e28bb54f58d00b64.css', revision: 'e28bb54f58d00b64' },
        {
          url: '/_next/static/jWZWyGLzY_i2DGuzN0Y57/_buildManifest.js',
          revision: '2c1b014121927ef9b738e26993a9c9d1',
        },
        {
          url: '/_next/static/jWZWyGLzY_i2DGuzN0Y57/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/11540fc693bd1a25-s.p.ttf',
          revision: 'c77560a8441d664af3e65dd57026dff9',
        },
        {
          url: '/_next/static/media/37089f52ccd73e0c-s.p.ttf',
          revision: 'e48c1217adab2a0e44f8df400d33c325',
        },
        {
          url: '/_next/static/media/5b8409335a5b011c-s.p.ttf',
          revision: '8b04b3bd9435341377d7f4b4d68b6ecc',
        },
        {
          url: '/_next/static/media/a3210dc3e70d67b6-s.p.ttf',
          revision: '6610bc1e35f982d2cf44f52335b5793b',
        },
        {
          url: '/_next/static/media/defbff1c3961a844-s.p.ttf',
          revision: '8ca1a84037fdb644723129315c390ad9',
        },
        {
          url: '/_next/static/media/f53ddc1e29b5dc42-s.p.ttf',
          revision: '4591e900425d177e6ba268d165bf12e8',
        },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/images/header-default-profile.svg', revision: '67a8973a115d72d3790fbcd00db9f582' },
        { url: '/images/offline-fallback.png', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/images/onboarding.png', revision: 'e9f81b6e2e3ba8fcc54676231b7d905f' },
        { url: '/images/profile-img.png', revision: '0b8bfcb8eea6df36b7090a09f484a76f' },
        { url: '/manifest.json', revision: '58e7f834533ba38327402c92d5bf222f' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/offline', revision: 'jWZWyGLzY_i2DGuzN0Y57' },
        { url: '/robots.txt', revision: 'e85909f63920e5452dee586f4b20df78' },
        { url: '/svg/all-notification.svg', revision: '2394357eaa7fed4b2a5365d2561b3738' },
        { url: '/svg/bulb.svg', revision: '2a260ac37c4b8bfdc1903a1ad4e5f944' },
        { url: '/svg/calendar.svg', revision: '5c35b1157ee62c375ec78434d14e1386' },
        { url: '/svg/chat.svg', revision: '9e2110081cfcdf80f5aff00f5446715c' },
        { url: '/svg/check-in.svg', revision: '7f41268685885a60aa4eb8a8d8e98baa' },
        { url: '/svg/check-session.svg', revision: 'c11df1e0f3a4a0dbe9ca1e46ae54f8f3' },
        { url: '/svg/confirm.svg', revision: 'cc9da0e547a1d6fb9a0a11912412d8a6' },
        { url: '/svg/distress.svg', revision: '9bd7132cad4a0084fad7141180909953' },
        { url: '/svg/download.svg', revision: '8b392d49a0d9c1bb289686268439f6bc' },
        { url: '/svg/facebook.svg', revision: 'dbe0225750ad70b38396f33f07399d62' },
        { url: '/svg/flag.svg', revision: '1f7be0412d74d8ff4565973c217c218d' },
        { url: '/svg/flagged-post.svg', revision: '9556b9530733320e4986779697dcaf3f' },
        { url: '/svg/home-screen.svg', revision: 'fe472ab4309e2abba68aa028609683f8' },
        { url: '/svg/increased-screen.svg', revision: 'cd7cd9048ae00a9373717bba5a4e209a' },
        { url: '/svg/insta.svg', revision: '6cc73156b5e9f2515dcbae2dad8ac4a2' },
        { url: '/svg/mail.svg', revision: '9b8a5aac719c242f9a3d6cd5c1fd5ff8' },
        { url: '/svg/missed.svg', revision: '6db57a87e07974e7e197656d81c3c0f2' },
        { url: '/svg/note.svg', revision: '01731ddb95a23d6f99996d23eff8ce82' },
        { url: '/svg/notification.svg', revision: '9fef4a1b6cef1004b215bd2d07f3d7fd' },
        { url: '/svg/notify-card.svg', revision: '1ac094f612dba754a4a96f2094cfd5c6' },
        { url: '/svg/prompt.svg', revision: '8090db54244cf226144a1a6b05ceba5f' },
        { url: '/svg/screen-time.svg', revision: 'd335bb75bc976e7272631bbebcfd1f9f' },
        { url: '/svg/search-icon.svg', revision: 'c9a1bd8b39fbbc3bb7483c9c6e481e7e' },
        { url: '/svg/settings.svg', revision: 'ae825b2c8e23ef727469f11406071557' },
        { url: '/svg/social-distress.svg', revision: '7c84b10e42c189122524d57b555e8eab' },
        { url: '/svg/telegram.svg', revision: 'db64ac98e33e36525674a8a759512ab5' },
        { url: '/svg/tiktok.svg', revision: '3bf285eb654df541022de54f409e63fd' },
        { url: '/svg/tweeter.svg', revision: '57656f9efb4c214a295734d6c0e32783' },
        { url: '/svg/youtube.svg', revision: 'ac579b7921cd64678a911acd866f92c2' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: i, state: a }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^.*\/api\/.*$/,
      new e.NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 300 }),
          new e.CacheableResponsePlugin({ statuses: [0, 200] }),
          new e.BackgroundSyncPlugin('api-background-sync', { maxRetentionTime: 1440 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
      new e.CacheFirst({
        cacheName: 'images-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592e3 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:woff|woff2|eot|ttf|otf)$/,
      new e.CacheFirst({
        cacheName: 'fonts-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 31536e3 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|js)$/,
      new e.StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 604800 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https?:\/\/localhost:3000\/.*$/,
      new e.NetworkFirst({
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 3,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/,
      new e.CacheFirst({
        cacheName: 'google-fonts-cache',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 31536e3 }),
          { handlerDidError: async ({ request: e }) => self.fallback(e) },
        ],
      }),
      'GET',
    ))
})
