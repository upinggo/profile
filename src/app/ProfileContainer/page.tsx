'use client';

import { useApi } from '@/hooks/useApi';
import { ProfileData } from '@/types';
import styles from '@/app/styles/page.module.css';
import AiProfileCard from '@/components/AiProfileCard';
import Navigation from '@/components/common/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';

const DEFAULT_PROFILE_DATA: ProfileData = {
  id: 'default',
  name: 'Loading...',
  role: 'Developer',
  bio: 'Loading profile data...',
  avatar: '',
  aiProfiles: []
};

function ProfileContent() {
  const { data: profileData, loading, error, refetch } = useApi<ProfileData>('/api/profile');

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonTextShort}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Profile</h2>
          <p>{error.message}</p>
          <button onClick={refetch} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = profileData || DEFAULT_PROFILE_DATA;

  return (
    <div className={styles.profileContainer}>
      <Navigation 
        path="https://github.com/upinggo"
        aria-label={`Visit ${data.name}'s GitHub profile`}
      >
        <img 
          src={data.avatar} 
          alt={`${data.name}'s avatar`} 
          className={styles.avatar}
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png'; // Fallback avatar
          }}
        />
      </Navigation>
      
      <h1 className={styles.title}>{data.name}</h1>
      <h2 className={styles.role}>{data.role}</h2>
      <p className={styles.bio}>{data.bio}</p>
      
      <section className={styles.aiProfiles} aria-labelledby="ai-profiles-heading">
        <h3 id="ai-profiles-heading">Your AI Profiles</h3>
        <div className={styles.profileList}>
          {data.aiProfiles.map(aiProfile => (
            <AiProfileCard 
              key={aiProfile.id}
              id={aiProfile.id}
              name={aiProfile.name}
              description={aiProfile.description}
              capabilities={aiProfile.capabilities || []}
            />
          ))}
        </div>
      </section>

      <nav className={styles.navigationLinks} aria-label="Additional Resources">
        <Navigation path="/TechnologyStackContainer" className={styles.navLink}>
          View Technology Stack
        </Navigation>
        <Navigation 
          path="https://leetcode.com/u/uping_s/" 
          className={styles.navLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to the "LeetCode" Challenges
        </Navigation>
        <Navigation 
          path="https://leetcode.cn/u/wo-shi-dou-bi-ni-xin-ma/"
          className={styles.navLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to the "力扣" Challenges
        </Navigation>
      </nav>
    </div>
  );
}

export default function ProfileContainer() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}