import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { ServerOfflineModal } from "@/components/ui/server-offline-modal";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { themeScript } from "@/components/theme/theme-script";
import { siteConfig } from "@/lib/config/site";
import { websiteSchema } from "@/lib/seo/schema";
import { getMenu } from "@/lib/api/menu";
import type { MenuItem } from "@/lib/domain/types";
import "./globals.css";

const FALLBACK_MENU: MenuItem[] = siteConfig.nav.map((item, i) => ({
  id: i,
  group: "public" as const,
  parentId: null,
  section: "",
  label: item.label,
  path: item.href,
  icon: "",
  sortOrder: i * 10,
  isVisible: true,
  createdAt: "",
  updatedAt: "",
}));

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menu = await getMenu().catch(() => FALLBACK_MENU);

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={websiteSchema()} />
        <Header menu={menu} />
        <main className="flex-1">
          <Container>{children}</Container>
        </main>
        <Footer />
        <ServerOfflineModal />
        <PageViewTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
