'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartStatusBreakdown({counts}:{counts:Record<string,number>}){
  const labels = ['Open','WaitForApproval','Approved','Completed'];
  const data = {
    labels,
    datasets: [
      { label:'Count', data: labels.map(l=>counts[l]||0), backgroundColor:['#2563eb','#d97706','#059669','#16a34a'] }
    ]
  };
  return <div className="panel"><Bar data={data} options={{responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}}/></div>;
}
