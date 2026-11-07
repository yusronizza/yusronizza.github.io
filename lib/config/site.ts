/**
 * Single source of truth for site-wide identity, navigation and social links.
 * Edit this file to rebrand the site without touching page/component code.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusronizza.com";
const AUTHOR_NAME = "Yusron Izza Faradisa";
const AUTHOR_EMAIL = "yusronizzafaradisa@gmail.com";

export const siteConfig = {
  name: AUTHOR_NAME,
  shortName: "Yusron Izza",
  url: rawSiteUrl.replace(/\/+$/, ""),
  tagline: "Embedded Systems & Digital Systems Engineer",
  titleTemplate: `%s | ${AUTHOR_NAME}`,
  defaultTitle: `${AUTHOR_NAME} — Embedded Systems & Digital Systems Engineer`,
  description:
    `Portfolio of ${AUTHOR_NAME}, an embedded systems and digital systems engineer.`,
  locale: "en_US",
  themeColor: "#0d0d0d",
  cvPdfPath: "/files/Yusron_Izza_Faradisa_CV.pdf",
  author: {
    name: AUTHOR_NAME,
    email: AUTHOR_EMAIL,
  },
  social: {
    github: "https://github.com/yusronizza",
    linkedin: "https://www.linkedin.com/in/yusronizza",
    email: `mailto:${AUTHOR_EMAIL}`,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "CV", href: "/cv" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
