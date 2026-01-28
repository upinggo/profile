'use client';

import { useState, useEffect } from 'react';
import styles from './styles/page.module.css';
import AiProfileCard from './components/AiProfileCard';
import { profileData as serverProfileData } from './lib/profileData';
import { isDevelopment } from './utils/HelperUtils';

interface ProfileData {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  aiProfiles: Array<{
    id: string;
    name: string;
    description: string;
    capabilities?: string[];
  }>;
}

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Loading...',
    role: 'AI Developer',
    bio: 'Loading profile data...',
    avatar: '',
    aiProfiles: []
  });

  useEffect(() => {
    // Fetch profile data from API
    const fetchProfileData = async () => {
      if(isDevelopment) {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }}else{
        setProfileData(serverProfileData);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.profileContainer}>
        <img 
          src={profileData.avatar} 
          alt={`${profileData.name}'s avatar`} 
          className={styles.avatar}
        />
        <h1 className={styles.title}>{profileData.name}</h1>
        <h2 className={styles.role}>{profileData.role}</h2>
        <p className={styles.bio}>{profileData.bio}</p>
        
        <div className={styles.aiProfiles}>
          <h3>Your AI Profiles</h3>
          <div className={styles.profileList}>
            {profileData.aiProfiles.map(aiProfile => (
              <AiProfileCard 
                key={aiProfile.id}
                id={aiProfile.id}
                name={aiProfile.name}
                description={aiProfile.description}
                capabilities={aiProfile.capabilities || []}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}