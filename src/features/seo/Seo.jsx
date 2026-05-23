import { Helmet } from "react-helmet-async";
import useSiteSettings from "../site-settings/hooks/useSiteSettings";

function getBaseUrl(siteUrl) {
  if (siteUrl) {
    return siteUrl.replace(/\/+$/, "");
  }

  return typeof window !== "undefined" ? window.location.origin : "";
}

function getAbsoluteUrl(value, siteUrl) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  const origin = getBaseUrl(siteUrl);
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;

  return `${origin}${normalizedPath}`;
}

export default function Seo({
  title,
  description,
  image,
  canonical,
  noindex = false,
  type = "website",
}) {
  const { settings } = useSiteSettings();
  const siteName = settings.site_name || "IASD San Nicolás Centro";
  const fallbackDescription =
    settings.site_subtitle || "Iglesia Adventista del Séptimo Día";
  const metaTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || fallbackDescription;
  const metaImage = getAbsoluteUrl(image || settings.logo_url, settings.site_url);
  const canonicalUrl = getAbsoluteUrl(canonical, settings.site_url);

  return (
    <Helmet>
      <title>{metaTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      <meta property="og:title" content={metaTitle} />
      {metaDescription && (
        <meta property="og:description" content={metaDescription} />
      )}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      <meta name="twitter:card" content={metaImage ? "summary_large_image" : "summary"} />
      {metaImage && <meta name="twitter:image" content={metaImage} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
