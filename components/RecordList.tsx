'use client';
import React, { useEffect, useState } from 'react';
import { db, deleteRecord, getAllRecords } from '../lib/db/dexie';
import StatusChip from './StatusChip';

export default function RecordList(){
  const [records, setRecords] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [company, setCompany] = useState<'ALL'|'OMAN_OIL'|'NAMA'>('ALL');
  const [status, setStatus] = useState<'ALL'|'Open'|'WaitForApproval'|'Approved'|'Completed'>('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(()=>{
    const sub = db.records.hook('creating', ()=>{}); // placeholder to keep Dexie hooks tree-shaken in
    load();
    return () => { sub.unsubscribe(); };
  },[]);

  async function load(){
    const all = await getAllRecords();
    setRecords(all.sort((a,b)=> (b.updatedAt||'').localeCompare(a.updatedAt||'')));
  }

  const filtered = records.filter(r => {
    if (company!=='ALL' && r.company !== company) return false;
    if (status!=='ALL' && r.status !== status) return false;
    if (q && !JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) return false;
    if (from){
      const d = r.refType==='WO' ? r.date : r.startDate;
      if (d && d < from) return false;
    }
    if (to){
      const d = r.refType==='WO' ? r.date : r.endDate || r.startDate;
      if (d && d > to) return false;
    }
    return true;
  });

  return (
    <div className="panel">
      <div className="toolbar">
        <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/>
        <select value={company} onChange={e=>setCompany(e.target.value as any)}>
          <option value="ALL">All Companies</option>
          <option value="OMAN_OIL">Oman Oil</option>
          <option value="NAMA">NAMA</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="ALL">All Statuses (WO)</option>
          <option>Open</option>
          <option>WaitForApproval</option>
          <option>Approved</option>
          <option>Completed</option>
        </select>
        <label>From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/>
        <label>To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)}/>
        <button className="concave-btn" onClick={load}>Refresh</button>
      </div>
      <div className="grid" style={{marginTop:12}}>
        {filtered.map(r => (
          <div key={r.id} className="panel" style={{boxShadow:'var(--shadow-outer)'}}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div style={{fontWeight:700}}>{r.refType} #{r.refNumber}</div>
              <div>{r.refType==='WO' && r.status ? <StatusChip status={r.status}/> : null}</div>
            </div>
            <div style={{fontSize:12,opacity:.75,margin:'6px 0 8px'}}>
              {r.company} • {r.refType==='WO' ? (r.date || '-') : (r.startDate + (r.endDate ? ' → '+r.endDate : ''))}
              {typeof r.durationDays==='number' ? ` • ${r.durationDays}d` : ''}
            </div>
            {r.description && <div style={{marginBottom:8}}>{r.description}</div>}
            <div className="row">
              {(r.photosBefore||[]).slice(0,2).map((p:string,i:number)=>(
                <img key={i} src={p} alt="before" style={{width:96,height:72,objectFit:'cover',borderRadius:8}}/>
              ))}
              {(r.photosAfter||[]).slice(0,2).map((p:string,i:number)=>(
                <img key={i} src={p} alt="after" style={{width:96,height:72,objectFit:'cover',borderRadius:8, border:'2px solid #16a34a'}}/>
              ))}
            </div>
            <div className="row" style={{marginTop:10}}>
              <button className="concave-btn" onClick={async()=>{ await deleteRecord(r.id); await load(); }}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{opacity:.7}}>No records found.</div>}
      </div>
    </div>
  );
}
