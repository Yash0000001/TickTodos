// "use client"
import { dark } from "@clerk/themes";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";
// import dynamic from "next/dynamic";
import Head from "next/head";
// const PwaUpdater = dynamic(() => import(`./PwaUpdater`), { ssr: false });




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        
        <title>TickTodos</title>
        <meta name="description" content="Manage your todos" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />

        {/* Apple Web App Settings */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TickTodos" />
      </Head>
      {/* <PwaUpdater/> */}
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
