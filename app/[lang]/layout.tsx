import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header, type NavItem } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { themeScript } from "@/components/theme/theme-script";
import { siteConfig } from "@/lib/config/site";
import { websiteSchema } from "@/lib/seo/schema";
import { getMenu } from "@/lib/api/menu";
import { getDictionary, HREFLANG, OG_LOCALE, SUPPORTED_LANGS, isValidLang, localePath, type Dictionary, type Lang } from "@/lib/i18n";
import type { MenuItem } from "@/lib/domain/types";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// One static build per language. Other first segments are rejected by the
// notFound() below rather than dynamicParams = false, which child segments
// would inherit (blocking on-demand post and project pages).
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = isValidLang(lang) ? lang : "en";
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.defaultTitle, template: siteConfig.titleTemplate },
    description: siteConfig.description,
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[l],
      url: `${siteConfig.url}${localePath(l, "/")}`,
      siteName: siteConfig.name,
      title: siteConfig.defaultTitle,
      description: siteConfig.description,
    },
    twitter: { card: "summary_large_image", title: siteConfig.defaultTitle, description: siteConfig.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

// Known site paths get their label from the dictionary, so the navigation is
// translated even though menu items (from the API) carry one label each.
const NAV_KEYS: Record<string, keyof Dictionary["nav"]> = {
  "/": "home",
  "/about": "about",
  "/cv": "cv",
  "/projects": "projects",
  "/blog": "blog",
  "/contact": "contact",
};

function toNav(items: MenuItem[], lang: Lang, dict: Dictionary): NavItem[] {
  return items
    .filter((item) => item.isVisible)
    .map((item) => {
      const internal = item.path.startsWith("/");
      const key = NAV_KEYS[item.path];
      return {
        id: item.id,
        label: key ? dict.nav[key] : item.label,
        path: item.path,
        href: internal ? localePath(lang, item.path) : item.path,
        external: !internal,
        children: item.children ? toNav(item.children, lang, dict) : undefined,
      };
    });
}

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

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const dict = getDictionary(lang);
  const menu = await getMenu().catch(() => FALLBACK_MENU);

  return (
    <html lang={HREFLANG[lang]} className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          {dict.common.skipToContent}
        </a>
        <JsonLd data={websiteSchema()} />
        <Header nav={toNav(menu, lang, dict)} lang={lang} labels={{ toggleMenu: dict.common.toggleMenu, toggleTheme: dict.common.toggleTheme, language: dict.common.language }} />
        <main id="main" className="flex-1">
          <Container>{children}</Container>
        </main>
        <Footer lang={lang} rssLabel={dict.common.rssFeed} />
        <PageViewTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
