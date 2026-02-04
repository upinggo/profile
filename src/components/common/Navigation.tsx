'use client';
import { useRouter } from 'next/navigation';

export default function Navigation({
  children,
  path,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  path: string;
  className?: string;
  [key: string]: any;
}) {
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <a 
      {...props} 
      href={path}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}