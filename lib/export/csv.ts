import type { RecordT } from '../validators';

export function exportCSV(records: RecordT[]) {
  const headers = ['id','company','refType','refNumber','status','description','startDate','endDate','date','durationDays','tags'];
  const rows = records.map(r => [
    r.id, r.company, r.refType, r.refNumber, r.status || '',
    (r.description || '').replaceAll('\n',' '),
    r.startDate || '', r.endDate || '', r.date || '',
    r.durationDays ?? '', (r.tags || []).join('|')
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'records.csv'; a.click();
  URL.revokeObjectURL(url);
}
