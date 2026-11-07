import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";
import { getPost } from "@/lib/api/posts";
import { isValidLang, type Lang } from "@/lib/i18n";
import { formatDate } from "@/lib/utils/format";

// A title card per post, shared when the post is linked (used when the post
// has no cover image of its own).
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post";

// The built-in font has no CJK glyphs. For Japanese titles, fetch a Noto
// Sans JP subset containing just the characters needed.
async function japaneseFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@600&text=${encodeURIComponent(text)}`, {
        signal: AbortSignal.timeout(5000),
      })
    ).text();
    const url = css.match(/src: url\((.+?)\) format/)?.[1];
    if (!url) return null;
    return await (await fetch(url, { signal: AbortSignal.timeout(5000) })).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: rawLang, slug } = await params;
  const lang: Lang = isValidLang(rawLang) ? rawLang : "en";

  let title: string = siteConfig.name;
  let meta = "";
  let font: ArrayBuffer | null = null;
  try {
    let post = await getPost(slug, lang);
    if (lang === "ja") {
      // Every character drawn on the card, so nothing falls back mid-word.
      const date = formatDate(post.publishedAt, "ja");
      font = await japaneseFont(`${post.title}${post.tags.join(" · ")}${siteConfig.name}${date} · 0123456789`);
      // No font, no Japanese: use the English title rather than empty boxes.
      if (!font) post = await getPost(slug, "en");
    }
    title = post.title;
    meta = `${formatDate(post.publishedAt, font ? "ja" : lang === "ja" ? "en" : lang)} · ${post.tags.slice(0, 3).join(" · ")}`;
  } catch {
    // Unknown post: a plain site card.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: siteConfig.themeColor,
          color: "#eeeeee",
          fontFamily: font ? "Noto Sans JP" : "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, color: "#ff3344", letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace" }}>
          {"// blog"}
        </div>
        <div style={{ fontSize: title.length > 60 ? 54 : 66, fontWeight: 600, lineHeight: 1.15, display: "flex" }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#888888" }}>
          <span>{siteConfig.name}</span>
          <span>{meta}</span>
        </div>
      </div>
    ),
    { ...size, ...(font ? { fonts: [{ name: "Noto Sans JP", data: font, weight: 600 as const, style: "normal" as const }] } : {}) }
  );
}
