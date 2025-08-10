import { describe, it, expect } from 'vitest';
import { validateRecord } from '../../lib/validators';

describe('validators', () => {
  it('rejects WO without date', () => {
    const r:any = { id:'1', company:'OMAN_OIL', refType:'WO', refNumber:'A', status:'Open', createdAt:'', updatedAt:'' };
    const v = validateRecord(r);
    expect(v.ok).toBe(false);
  });
  it('accepts basic WO', () => {
    const r:any = { id:'1', company:'OMAN_OIL', refType:'WO', refNumber:'A', status:'Open', date:'2025-08-01', createdAt:'', updatedAt:'' };
    const v = validateRecord(r);
    expect(v.ok).toBe(true);
  });
  it('rejects WNSC with end < start', () => {
    const r:any = { id:'1', company:'NAMA', refType:'WNSC', refNumber:'B', startDate:'2025-08-10', endDate:'2025-08-09', createdAt:'', updatedAt:'' };
    const v = validateRecord(r);
    expect(v.ok).toBe(false);
  });
});
