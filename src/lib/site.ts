const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredUrl ? configuredUrl.replace(/\/+$/, "") : null;

export const metadataBase = new URL(siteUrl ?? "http://localhost:3000");

export function absoluteUrl(path = "/"): string {
  return new URL(path, metadataBase).toString();
}

export function canonicalUrl(path = "/"): string | undefined {
  return siteUrl ? absoluteUrl(path) : undefined;
}
