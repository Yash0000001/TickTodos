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
