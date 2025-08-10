import { describe, it, expect } from 'vitest';
import { pickBucket } from '../../lib/chart-helpers';

describe('bucketing', ()=>{
  it('day for <=31d', ()=>{
    const s = new Date('2025-01-01'); const e = new Date('2025-01-31');
    expect(pickBucket(s,e)).toBe('day');
  });
  it('week for <=120d', ()=>{
    const s = new Date('2025-01-01'); const e = new Date('2025-04-30');
    expect(pickBucket(s,e)).toBe('week');
  });
  it('month for >120d', ()=>{
    const s = new Date('2025-01-01'); const e = new Date('2025-06-01');
    expect(pickBucket(s,e)).toBe('month');
  });
});
