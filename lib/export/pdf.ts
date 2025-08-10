import jsPDF from 'jspdf';
import type { RecordT } from '../validators';

export function exportMonthlyPDF(records: RecordT[]) {
  const byMonth = new Map<string, number>();
  for (const r of records) {
    const dStr = r.refType === 'WO' ? r.date : r.endDate;
    if (!dStr) continue;
    const d = new Date(dStr);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    byMonth.set(key, (byMonth.get(key) || 0) + 1);
  }
  const doc = new jsPDF({ unit: 'pt', compress: true });
  doc.setFontSize(16);
  doc.text('Monthly Summary', 40, 40);
  doc.setFontSize(11);
  let y = 70;
  [...byMonth.entries()].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([m,c])=>{
    doc.text(`${m}: ${c} completed`, 40, y);
    y += 18;
  });
  doc.save('monthly-summary.pdf');
}
