/** ImageKit transforms must not be appended to local or third-party posters. */
export function displayThumbnail(url?: string, imageKitTransform?: string) {
  if (!url) return "/demo/avatar.svg";
  if (!imageKitTransform || !url.includes("ik.imagekit.io")) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}tr=${imageKitTransform}`;
}
