import { dark } from "@clerk/themes";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <ClerkProvider appearance={{ baseTheme: dark }}>
        <body>
          <ClerkLoading>Loading...</ClerkLoading>
          <ClerkLoaded>
            <div className="max-w-full mx-auto">
              <Navbar />
              <div>{children}</div>
            </div>
          </ClerkLoaded>
        </body>
      </ClerkProvider>
    </html>
  );
}
