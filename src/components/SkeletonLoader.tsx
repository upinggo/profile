import styles from '@/app/styles/page.module.css';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}: SkeletonProps) {
  const baseClass = styles[`skeleton${variant.charAt(0).toUpperCase() + variant.slice(1)}`];
  
  return (
    <div 
      className={`${baseClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className={styles.profileSkeleton}>
      <Skeleton variant="circular" width="120px" height="120px" className={styles.skeletonAvatar} />
      <Skeleton variant="text" width="200px" className={styles.skeletonText} />
      <Skeleton variant="text" width="150px" className={styles.skeletonTextShort} />
      <Skeleton variant="text" width="100%" className={styles.skeletonText} />
      <Skeleton variant="text" width="100%" className={styles.skeletonText} />
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className={styles.categorySkeleton}>
      <div className={styles.categoryHeaderSkeleton}>
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className={styles.categoryInfoSkeleton}>
          <Skeleton variant="text" width="120px" />
          <Skeleton variant="text" width="200px" />
        </div>
      </div>
    </div>
  );
}