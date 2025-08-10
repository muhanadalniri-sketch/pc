'use client';
import React, { useEffect, useState } from 'react';

export default function SettingsPage(){
  const [theme, setTheme] = useState<'oman-oil'|'nama'>('oman-oil');

  useEffect(()=>{
    const body = document.body;
    body.classList.remove('theme-oman-oil','theme-nama');
    body.classList.add(theme==='oman-oil' ? 'theme-oman-oil' : 'theme-nama');
  },[theme]);

  return (
    <div className="container">
      <div className="panel">
        <h1 className="title">Settings</h1>
        <div className="row">
          <div className="col">
            <label>Theme</label><br/>
            <select value={theme} onChange={e=>setTheme(e.target.value as any)}>
              <option value="oman-oil">Oman Oil</option>
              <option value="nama">NAMA</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
