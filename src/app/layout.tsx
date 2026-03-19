import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestAI - AI orqali testlar platformasi",
  description: "Zamonaviy AI testlar platformasi. Testlarni tez va oson yarating, boshqaring va tahlil qiling.",
  keywords: ["TestAI", "AI", "Test", "EduTech", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  authors: [{ name: "TestAI Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TestAI - AI Test Platform",
    description: "AI orqali testlar platformasi",
    siteName: "TestAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TestAI - AI Test Platform",
    description: "AI orqali testlar platformasi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
