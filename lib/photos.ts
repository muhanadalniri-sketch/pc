// Simple client-side image compression using canvas. Returns a data URL.
export async function compressImageToDataURL(file: File, maxW = 1600, quality = 0.82): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const o = new Image();
    o.onload = () => res(o);
    o.onerror = rej;
    o.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}
