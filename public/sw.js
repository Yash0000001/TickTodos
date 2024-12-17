importScripts('workbox-v6.5.4/workbox-sw.js');

workbox.precaching.addRoute();

// Cache static assets
workbox.routing.registerRoute(
  /\.(?:js|css|png|jpg|jpeg|svg)$/,
  new workbox.strategies.StaleWhileRevalidate()
)