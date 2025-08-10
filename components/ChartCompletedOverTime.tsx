'use client';
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function ChartCompletedOverTime({labels, omanOil, nama}:{labels:string[], omanOil:number[], nama:number[]}){
  const ref = useRef<any>(null);
  const data = (canvas: any) => {
    const ctx = canvas.getContext('2d');
    const gradBlue = ctx.createLinearGradient(0,0,0,240);
    gradBlue.addColorStop(0,'rgba(11,94,215,0.35)');
    gradBlue.addColorStop(1,'rgba(11,94,215,0.02)');
    const gradRed = ctx.createLinearGradient(0,0,0,240);
    gradRed.addColorStop(0,'rgba(215,11,33,0.35)');
    gradRed.addColorStop(1,'rgba(215,11,33,0.02)');

    return {
      labels,
      datasets: [
        { label:'Oman Oil', data: omanOil, borderColor:'#0B5ED7', backgroundColor: gradBlue, tension:.25, fill:true, pointRadius:2, pointHoverRadius:4 },
        { label:'NAMA', data: nama, borderColor:'#D70B21', backgroundColor: gradRed, tension:.25, fill:true, pointRadius:2, pointHoverRadius:4 }
      ]
    };
  };
  return <div className="panel"><Line ref={ref} data={data as any} options={{responsive:true, plugins:{legend:{display:true}}, scales:{y:{beginAtZero:true}}}}/></div>;
}
