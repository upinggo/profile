import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Navigation({
  children,
  path
}: {
  children: React.ReactNode;
  path: string;
}) {
      const router = useRouter();
    
  return (
    <a onClick={()=>router.push(path)} style={{ cursor: 'pointer' }}>
    {children}
    </a>
  );
}