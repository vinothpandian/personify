export const getImageOrFallback = (path: string, fallback: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = encodeURI(path);
    img.onload = () => resolve(encodeURI(path));
    img.onerror = () => resolve(fallback);
  });
};
