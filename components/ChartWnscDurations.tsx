'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ChartWnscDurations({bins, counts}:{bins:string[], counts:number[]}){
  const data = { labels: bins, datasets: [{ label:'Days', data: counts, backgroundColor:'#D70B21' }]};
  return <div className="panel"><Bar data={data} options={{responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}}/></div>;
}
