// src/pages/config/utils/url.js
export const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:") || url.startsWith("blob:"))
    return url;
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
};

export const isValidUrl = (url) => {
  if (!url) return false;
  if (url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("data:") || url.startsWith("blob:"))
    return true;
  try {
    new URL(normalizeUrl(url));
    return true;
  } catch {
    return false;
  }
};