'use client';
// technology stack page
import { useState, useEffect } from 'react';
import styles from '@/app/styles/page.module.css';
import Navigation from 'src/components/common/Navigation';
import { envFetch } from '@/utils/HelperUtils';

export default function TechnologyStackContainer() {
  const [techStack, setTechStack] = useState<string[]>([]);

  useEffect(() => {
    // Fetch technology stack data from API
    const fetchTechStack = async () => {
      try {
        const response = await envFetch('/api/tech-stack');
        const data = await response.json();
        setTechStack(data);
      } catch (error) {
        console.error('Error fetching technology stack:', error);
      }
    };

    fetchTechStack();
  }, []);

  return (
    <div className={styles.techStackContainer}>
      <h2 className={styles.sectionTitle}>Technology Stack</h2>
      <ul className={styles.techList}>
        {techStack.map((tech, index) => (
          <li key={index} className={styles.techItem}>{tech}</li>
        ))}
      </ul>
      <Navigation path="/">
        <button className={styles.backButton}>Back to Home</button>
      </Navigation>
    </div>
  );
}