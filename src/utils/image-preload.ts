/**
 * Preload an image URL into browser cache
 */
export function preloadImage(src: string): Promise<void> {
  if (!src || typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve anyway so questions don't hang
  });
}

/**
 * Preload batch of images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map((src) => preloadImage(src)));
}
