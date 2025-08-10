import React from 'react';
export default function KpiCard({label, value}:{label:string, value:number|string}){
  return (
    <div className="panel kpi" role="status" aria-live="polite">
      <div className="num">{value}</div>
      <div className="subtitle">{label}</div>
    </div>
  );
}
