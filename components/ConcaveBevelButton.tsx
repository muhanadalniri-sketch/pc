'use client';
import React from 'react';
import { prefersReducedMotion } from '../lib/motion';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };
export default function ConcaveBevelButton({ children, ...rest }: Props){
  return (
    <button
      {...rest}
      className={'concave-btn ' + (rest.className || '')}
      onPointerMove={e=>{
        if (prefersReducedMotion()) return;
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx)/rect.width, dy = (e.clientY - cy)/rect.height;
        el.style.transform = `perspective(600px) rotateX(${dy * -2}deg) rotateY(${dx * 4}deg) scale(.99)`;
      }}
      onPointerLeave={e=>{
        const el = e.currentTarget as HTMLElement;
        el.style.transform = '';
      }}
    >{children}</button>
  );
}
