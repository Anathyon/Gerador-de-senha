const cache_name = 'gerador-senhas-v1'
const urls_cache = [
  '/',
  '/index.html',
  '/CSS/index.css',
  '/script_js/index.js',
  '/Imagens/icon-192.svg',
  '/Imagens/icon-512.svg'
]

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(cache_name).then(cache => {
      return cache.addAll(urls_cache)
    })
  )
})

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
});