'use client';
import React, { useState } from 'react';
import { addRecord } from '../lib/db/dexie';
import type { RecordT } from '../lib/validators';
import { validateRecord } from '../lib/validators';
import { compressImageToDataURL } from '../lib/photos';

export default function RecordForm({type}:{type:'WO'|'WNSC'}){
  const [form, setForm] = useState<any>({ refType: type, company: type==='WO' ? 'OMAN_OIL' : 'NAMA', status: 'Open' });
  const [err, setErr] = useState<string|undefined>();

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    const now = new Date().toISOString();
    const rec: RecordT = {
      id: crypto.randomUUID(),
      company: form.company,
      refType: form.refType,
      refNumber: form.refNumber || '',
      status: form.refType==='WO' ? form.status : undefined,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      date: form.date,
      durationDays: form.refType==='WNSC' && form.endDate && form.startDate ? Math.ceil((new Date(form.endDate).getTime()-new Date(form.startDate).getTime())/86400000) : undefined,
      photosBefore: form.photosBefore || [],
      photosAfter: form.photosAfter || [],
      tags: form.tags || [],
      createdAt: now,
      updatedAt: now
    };
    const v = validateRecord(rec);
    if (!v.ok) { setErr(v.error); return; }
    await addRecord(rec);
    setForm({ refType: type, company: type==='WO' ? 'OMAN_OIL' : 'NAMA', status: 'Open' });
    alert('Saved');
  }

  async function handlePhotos(e: React.ChangeEvent<HTMLInputElement>, key: 'photosBefore'|'photosAfter'){
    const files = e.target.files ? Array.from(e.target.files) : [];
    const imgs = await Promise.all(files.map(f => compressImageToDataURL(f)));
    setForm((s:any)=>({ ...s, [key]: [ ...(s[key]||[]), ...imgs ] }));
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="row">
        <div className="col">
          <label>Company</label><br/>
          <select value={form.company||''} onChange={e=>setForm((s:any)=>({...s, company:e.target.value}))}>
            <option value="OMAN_OIL">Oman Oil</option>
            <option value="NAMA">NAMA</option>
          </select>
        </div>
        <div className="col">
          <label>Ref Type</label><br/>
          <select value={form.refType||''} onChange={e=>setForm((s:any)=>({...s, refType:e.target.value}))}>
            <option value="WO">WO</option>
            <option value="WNSC">WNSC</option>
          </select>
        </div>
        <div className="col">
          <label>Ref Number *</label><br/>
          <input value={form.refNumber||''} onChange={e=>setForm((s:any)=>({...s, refNumber:e.target.value}))}/>
        </div>
        {form.refType==='WO' && (
          <div className="col">
            <label>WO Status</label><br/>
            <select value={form.status||'Open'} onChange={e=>setForm((s:any)=>({...s, status:e.target.value}))}>
              <option>Open</option>
              <option>WaitForApproval</option>
              <option>Approved</option>
              <option>Completed</option>
            </select>
          </div>
        )}
      </div>

      {form.refType==='WO' ? (
        <div className="row">
          <div className="col">
            <label>Date *</label><br/>
            <input type="date" value={form.date||''} onChange={e=>setForm((s:any)=>({...s, date:e.target.value}))}/>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col">
            <label>Start Date *</label><br/>
            <input type="date" value={form.startDate||''} onChange={e=>setForm((s:any)=>({...s, startDate:e.target.value}))}/>
          </div>
          <div className="col">
            <label>End Date</label><br/>
            <input type="date" value={form.endDate||''} onChange={e=>setForm((s:any)=>({...s, endDate:e.target.value}))}/>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col">
          <label>Description</label><br/>
          <textarea value={form.description||''} onChange={e=>setForm((s:any)=>({...s, description:e.target.value}))}/>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <label>Photos Before</label><br/>
          <input type="file" multiple accept="image/*" onChange={e=>handlePhotos(e,'photosBefore')}/>
        </div>
        <div className="col">
          <label>Photos After</label><br/>
          <input type="file" multiple accept="image/*" onChange={e=>handlePhotos(e,'photosAfter')}/>
        </div>
      </div>

      {err && <div style={{color:'#b91c1c'}}>{err}</div>}
      <div style={{display:'flex',gap:8,marginTop:10}}>
        <button className="concave-btn" type="submit">Save</button>
        <button className="concave-btn" type="button" onClick={()=>setForm({ refType: type, company: type==='WO' ? 'OMAN_OIL' : 'NAMA', status: 'Open' })}>Reset</button>
      </div>
    </form>
  )
}
