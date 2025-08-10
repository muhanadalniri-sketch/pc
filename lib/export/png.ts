import * as htmlToImage from 'html-to-image';

export async function exportPNG(el: HTMLElement) {
  const dataUrl = await htmlToImage.toPng(el, { pixelRatio: 2 });
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'dashboard.png';
  a.click();
}
