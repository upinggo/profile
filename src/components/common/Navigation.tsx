'use client';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Navigation({
  children,
  path,
  ...props
}: {
  children: React.ReactNode;
  path: string;
  [key: string]: any;
}) {
      const router = useRouter();
    
  return (
    <a {...props} onClick={()=>router.push(path)} style={{ cursor: 'pointer' }}>
    {children}
    </a>
  );
}