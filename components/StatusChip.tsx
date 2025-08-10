import React from 'react';

export default function StatusChip({ status, semantic=true }: { status: string; semantic?: boolean }){
  const color = semantic ? ({
    Open:'#2563eb', WaitForApproval:'#d97706', Approved:'#059669', Completed:'#16a34a'
  } as Record<string,string>)[status] : '#0B5ED7';
  return (
    <span className="chip" aria-label={`status ${status}`}>
      <span className="chip-dot" style={{background: color}}/>
      <span style={{fontWeight:600}}>{status}</span>
    </span>
  );
}
