'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { TechnologyCategory, TechnologyItem } from '@/types';
import { API_ENDPOINTS } from '@/constants';
import styles from './page.module.css';
import Navigation from '@/components/common/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ChildItemCardProps {
  category: TechnologyCategory;
  onItemClick?: (item: TechnologyItem) => void;
}

function ChildItemCard({ category, onItemClick }: ChildItemCardProps) {
  if (!category.children?.length) return null;

  return (
    <div className={styles.childItemsDropdown}>
      <div className={styles.dropdownArrow}></div>
      <div className={styles.childItemsGrid}>
        {category.children.map((item) => (
          <Navigation 
            key={item.id} 
            className={styles.childItemCard} 
            path={`/TechnologyStackContainer/${category.id}/${item.id}`}
            aria-label={`View details for ${item.name}`}
            onClick={() => onItemClick?.(item)}
          >
            <div className={styles.childItemIcon}>
              <span className={styles.childItemInitial}>{item.name.charAt(0)}</span>
            </div>
            <div className={styles.childItemInfo}>
              <h4 className={styles.childItemName}>{item.name}</h4>
              <p className={styles.childItemDescription}>{item.description}</p>
            </div>
          </Navigation>
        ))}
      </div>
    </div>
  );
}

function TechnologyStackContent() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { data: techStack, loading, error, refetch } = useApi<TechnologyCategory[]>(API_ENDPOINTS.TECH_STACK);

  const handleMouseEnter = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleItemClick = (item: TechnologyItem) => {
    console.log('Technology item clicked:', item);
    // Could implement analytics tracking here
  };

  if (loading) {
    return (
      <div className={styles.techStackContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonDescription}></div>
          <div className={styles.skeletonCategories}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={styles.skeletonCategory}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.techStackContainer}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Technology Stack</h2>
          <p>{error.message}</p>
          <button onClick={refetch} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const categories = techStack || [];

  return (
    <div className={styles.techStackContainer}>
      <div className={styles.techStackContent}>
        <header className={styles.header}>
          <h2 className={styles.sectionTitle}>Technology Stack</h2>
          <p className={styles.description}>
            Technologies and tools I use to build amazing applications
          </p>
        </header>

        {categories.length > 0 ? (
          <div className={styles.categoriesContainer}>
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryCard} ${
                  hoveredCategory === category.id ? styles.categoryCardHovered : ''
                }`}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
                aria-expanded={hoveredCategory === category.id}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon} aria-hidden="true">
                    <span className={styles.categoryInitial}>{category.name.charAt(0)}</span>
                  </div>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryName}>{category.name}</h3>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                {hoveredCategory === category.id && (
                  <ChildItemCard 
                    category={category} 
                    onItemClick={handleItemClick}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No technologies found</p>
          </div>
        )}
      </div>

      <nav className={styles.navigationSection} aria-label="Page Navigation">
        <Navigation path="/" className={styles.navButton}>
          <span className={styles.buttonArrow}>←</span> Home
        </Navigation>
        <Navigation 
          path="/Blog" 
          className={styles.navButton}
          aria-label="Navigate to Blog"
        >
          Blog <span className={styles.buttonArrow}>→</span>
        </Navigation>
      </nav>
    </div>
  );
}

export default function TechnologyStackContainer() {
  return (
    <ErrorBoundary>
      <TechnologyStackContent />
    </ErrorBoundary>
  );
}