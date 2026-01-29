'use client';
// technology stack page
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Navigation from 'src/components/common/Navigation';
import { envFetch } from '@/utils/HelperUtils';

interface TechCategory {
  id: string;
  name: string;
  description: string;
  children: TechItem[];
}

interface TechItem {
  id: string;
  name: string;
  description: string;
}

export default function TechnologyStackContainer() {
  const [techStack, setTechStack] = useState<TechCategory[]>([]);

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

  // Extract all tech items from all categories
  const getAllTechItems = (): TechItem[] => {
    return techStack.flatMap(category => 
      category.children as TechItem[] || []
    );
  };

  const allTechItems = getAllTechItems();

  return (
    <div className={styles.techStackContainer}>
      <div className={styles.techStackContent}>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <p className={styles.description}>Technologies and tools I use to build amazing applications</p>
        
        {allTechItems.length > 0 ? (
          <div className={styles.techGrid}>
            {allTechItems.map((tech, index) => (
              <div key={`${tech.id}-${index}`} className={styles.techCard}>
                <div className={styles.techIcon}>
                  <span className={styles.techInitial}>{tech.name.charAt(0)}</span>
                </div>
                <div className={styles.techInfo}>
                  <h3 className={styles.techName}>{tech.name}</h3>
                  <p className={styles.techDescription}>{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.loadingText}>Loading technologies...</p>
        )}
      </div>
      
      <div className={styles.navigationSection}>
        <Navigation path="/">
          <button className={styles.navButton}>
            Home <span className={styles.buttonArrow}>←</span>
          </button>
        </Navigation>
        <Navigation path="https://github.com/upinggo/profile">
          <button className={styles.navButton}>
            Repository <span className={styles.buttonArrow}>→</span>
          </button>
        </Navigation>
      </div>
    </div>
  );
}