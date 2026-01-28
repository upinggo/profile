'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/page.module.css';
import AiProfileCard from '../components/AiProfileCard';
import { envFetch } from '../../utils/HelperUtils';

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

export default function ProfileContainer() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Loading...',
    role: 'AI Developer',
    bio: 'Loading profile data...',
    avatar: '',
    aiProfiles: []
  });

  const router = useRouter();

  const handleAvatarClick = () => {
    router.push('/pages');
  };

  useEffect(() => {
    // Fetch profile data from API
    const fetchProfileData = async () => {
      try {
        const response = await envFetch('/api/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
      <div className={styles.profileContainer}>
        <img 
          src={profileData.avatar} 
          alt={`${profileData.name}'s avatar`} 
          className={styles.avatar}
          onClick={handleAvatarClick}
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
  );
}