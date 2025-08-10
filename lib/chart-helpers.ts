import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfDay, startOfWeek, startOfMonth, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import type { RecordT } from './validators';

const TZ = 'Asia/Muscat';

export type Bucket = 'day'|'week'|'month';
export function pickBucket(start: Date, end: Date): Bucket {
  const diffDays = Math.ceil((end.getTime() - start.getTime())/86400000);
  if (diffDays <= 31) return 'day';
  if (diffDays <= 120) return 'week';
  return 'month';
}

function normalizeToTZ(d: Date){ return utcToZonedTime(d, TZ); }

export function completedOverTime(records: RecordT[], range: {start: Date, end: Date}){
  const bucket = pickBucket(range.start, range.end);
  const dates: Date[] = bucket === 'day' ?
    eachDayOfInterval(range) :
    bucket === 'week' ? eachWeekOfInterval(range) : eachMonthOfInterval(range);

  const keys = dates.map(d => {
    const nd = normalizeToTZ(d);
    if (bucket === 'day') return format(nd, 'yyyy-MM-dd');
    if (bucket === 'week') return format(startOfWeek(nd, {weekStartsOn: 6}), 'yyyy-ww'); // Week starting Saturday (GCC)
    return format(startOfMonth(nd), 'yyyy-MM');
  });

  const series = {
    omanOil: new Array(keys.length).fill(0),
    nama: new Array(keys.length).fill(0)
  };

  const within = (ts: number) => ts >= range.start.getTime() && ts <= range.end.getTime();

  for (const r of records) {
    let completedAt: string | undefined;
    if (r.refType === 'WO' && r.status === 'Completed' && r.date) completedAt = r.date;
    if (r.refType === 'WNSC' && r.endDate) completedAt = r.endDate;
    if (!completedAt) continue;
    const dt = new Date(completedAt);
    if (!within(dt.getTime())) continue;
    const nd = normalizeToTZ(dt);
    const key = ((): string => {
      if (bucket === 'day') return format(startOfDay(nd), 'yyyy-MM-dd');
      if (bucket === 'week') return format(startOfWeek(nd, {weekStartsOn: 6}), 'yyyy-ww');
      return format(startOfMonth(nd), 'yyyy-MM');
    })();
    const idx = keys.indexOf(key);
    if (idx >= 0) {
      if (r.company === 'OMAN_OIL') series.omanOil[idx]++;
      else series.nama[idx]++;
    }
  }
  return { bucket, labels: keys, series };
}

export function statusBreakdownWO(records: RecordT[]){
  const counts = { Open:0, WaitForApproval:0, Approved:0, Completed:0 };
  for (const r of records) {
    if (r.refType === 'WO' && r.status && (r.status in counts)) counts[r.status as keyof typeof counts]++;
  }
  return counts;
}

export function wnscDurations(records: RecordT[], binCount = 10){
  const durs = records.filter(r => r.refType==='WNSC' && typeof r.durationDays === 'number').map(r => r.durationDays as number);
  if (durs.length === 0) return { bins: [], counts: [] };
  const min = Math.min(...durs);
  const max = Math.max(...durs);
  const range = max - min || 1;
  const step = range / binCount;
  const bins: string[] = [];
  const counts = new Array(binCount).fill(0);
  for (let i=0;i<binCount;i++){
    const bStart = min + i*step;
    const bEnd = i === binCount-1 ? max : bStart + step;
    bins.push(`${Math.round(bStart)}–${Math.round(bEnd)}`);
  }
  for (const v of durs){
    let idx = Math.min(binCount-1, Math.floor((v - min) / step));
    if (!Number.isFinite(idx)) idx = 0;
    counts[idx]++;
  }
  return { bins, counts };
}

export function averageWnscDuration(records: RecordT[]){
  const d = records.filter(r => r.refType==='WNSC' && typeof r.durationDays === 'number').map(r => r.durationDays as number);
  if (d.length===0) return 0;
  return Math.round(d.reduce((a,b)=>a+b,0)/d.length);
}
