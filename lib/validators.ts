import { z } from 'zod';

export const Company = z.enum(['OMAN_OIL','NAMA']);
export const RefType = z.enum(['WO','WNSC']);
export const WOStatus = z.enum(['Open','WaitForApproval','Approved','Completed']);

export const BaseRecord = z.object({
  id: z.string(),
  company: Company,
  refType: RefType,
  refNumber: z.string().min(1),
  status: z.string().optional(), // WO only
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  date: z.string().optional(),
  durationDays: z.number().optional(),
  photosBefore: z.array(z.string()).optional(),
  photosAfter: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RecordT = z.infer<typeof BaseRecord>;

export function validateRecord(rec: RecordT): { ok: boolean; error?: string } {
  try {
    if (!rec.refNumber || rec.refNumber.trim() === '') return { ok: false, error: 'refNumber is required' };
    if (rec.refType === 'WO') {
      if (!rec.date) return { ok: false, error: 'WO requires date' };
      if (!rec.status || !WOStatus.options.includes(rec.status as any)) return { ok: false, error: 'Invalid WO status' };
    } else {
      if (!rec.startDate) return { ok: false, error: 'WNSC requires startDate' };
      if (rec.endDate && new Date(rec.endDate) < new Date(rec.startDate)) return { ok: false, error: 'endDate must be >= startDate' };
    }
    return { ok: true };
  } catch (e:any) {
    return { ok:false, error: e?.message || 'Invalid record' };
  }
}
