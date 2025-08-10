import { describe, it, expect } from 'vitest';

function calc(start: string, end: string){
  return Math.ceil((new Date(end).getTime()-new Date(start).getTime())/86400000);
}
describe('duration',()=>{
  it('calendar days, ceil',()=>{
    expect(calc('2025-08-01','2025-08-01')).toBe(0);
    expect(calc('2025-08-01','2025-08-02')).toBe(1);
  });
});
