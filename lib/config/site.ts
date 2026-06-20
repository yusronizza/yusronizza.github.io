/**
 * Single source of truth for site-wide identity, navigation and social links.
 * Edit this file to rebrand the site without touching page/component code.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusronizza.com";

export const siteConfig = {
  name: "Yusron Izza Faradisa",
  shortName: "Yusron Izza",
  url: rawSiteUrl.replace(/\/+$/, ""),
  titleTemplate: "%s | Yusron Izza Faradisa",
  defaultTitle: "Yusron Izza Faradisa — Embedded Systems & Digital Systems Engineer",
  description:
    "Portfolio of Yusron Izza Faradisa, an embedded systems and digital systems engineer.",
  locale: "en_US",
  themeColor: "#090907",
  author: {
    name: "Yusron Izza Faradisa",
    email: "yusronizzafaradisa@gmail.com",
  },
  social: {
    github: "https://github.com/yusronizza",
    linkedin: "https://www.linkedin.com/in/yusronizza",
    email: "mailto:yusronizzafaradisa@gmail.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "CV", href: "/cv" },
    { label: "Projects", href: "/projects" },
    { label: "Tools", href: "/tools" },
    { label: "Blog", href: "/blog" },
  ],
} as const;
