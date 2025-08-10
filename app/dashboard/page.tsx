'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAllRecords } from '../../lib/db/dexie';
import KpiCard from '../../components/KpiCard';
import ChartCompletedOverTime from '../../components/ChartCompletedOverTime';
import ChartStatusBreakdown from '../../components/ChartStatusBreakdown';
import ChartWnscDurations from '../../components/ChartWnscDurations';
import { averageWnscDuration, completedOverTime, statusBreakdownWO } from '../../lib/chart-helpers';
import { exportCSV } from '../../lib/export/csv';
import { exportPNG } from '../../lib/export/png';
import { exportMonthlyPDF } from '../../lib/export/pdf';

export default function Dashboard(){
  const [records, setRecords] = useState<any[]>([]);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [bins, setBins] = useState<number>(10);
  const [semantic, setSemantic] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{ (async()=>{ setRecords(await getAllRecords()); })(); },[]);

  const filtered = useMemo(()=>{
    return records.filter(r => {
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
  },[records, from, to]);

  const kpi = useMemo(()=>{
    const total = filtered.length;
    const woCompleted = filtered.filter(r => r.refType==='WO' && r.status==='Completed').length;
    const wnscCompleted = filtered.filter(r => r.refType==='WNSC' && r.endDate).length;
    const avg = averageWnscDuration(filtered);
    return { total, woCompleted, wnscCompleted, avg };
  },[filtered]);

  const range = useMemo(()=>{
    const now = new Date();
    const start = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = to ? new Date(to) : now;
    return {start, end};
  },[from,to]);

  const completed = useMemo(()=>completedOverTime(filtered, range),[filtered, range]);
  const statusWO = useMemo(()=>statusBreakdownWO(filtered),[filtered]);
  const wnscHist = useMemo(()=>{
    const fn = require('../../lib/chart-helpers');
    return fn.wnscDurations(filtered, bins);
  },[filtered,bins]);

  return (
    <div className="container" ref={ref}>
      <div className="row">
        <div className="col"><h1 className="title" style={{color:'#fff'}}>Summary Dashboard</h1></div>
        <div className="col" style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button className="concave-btn" onClick={()=>ref.current && exportPNG(ref.current)}>Export PNG</button>
          <button className="concave-btn" onClick={()=>exportCSV(filtered)}>Export CSV</button>
          <button className="concave-btn" onClick={()=>exportMonthlyPDF(filtered)}>Monthly PDF</button>
        </div>
      </div>
      <div className="panel">
        <div className="toolbar">
          <label>From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)}/>
          <label>To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)}/>
          <label><input type="checkbox" checked={semantic} onChange={e=>setSemantic(e.target.checked)}/> Semantic status colors</label>
          <label>Bins</label>
          <input type="number" min={4} max={30} value={bins} onChange={e=>setBins(parseInt(e.target.value||'10')||10)} />
        </div>
        <div className="row" style={{marginTop:12}}>
          <div className="col"><KpiCard label="Total records" value={kpi.total}/></div>
          <div className="col"><KpiCard label="WO completed" value={kpi.woCompleted}/></div>
          <div className="col"><KpiCard label="WNSC completed" value={kpi.wnscCompleted}/></div>
          <div className="col"><KpiCard label="Avg WNSC duration (days)" value={kpi.avg}/></div>
        </div>
      </div>

      <div className="row" style={{marginTop:12}}>
        <div className="col"><ChartCompletedOverTime labels={completed.labels} omanOil={completed.series.omanOil} nama={completed.series.nama}/></div>
      </div>

      <div className="row" style={{marginTop:12}}>
        <div className="col"><ChartStatusBreakdown counts={statusWO}/></div>
        <div className="col"><ChartWnscDurations bins={wnscHist.bins} counts={wnscHist.counts}/></div>
      </div>

      <div className="footer">Timezone: Asia/Muscat • Bucketing: {completed.bucket}</div>
    </div>
  );
}
