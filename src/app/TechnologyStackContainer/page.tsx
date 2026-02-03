'use client';
// technology stack page
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Navigation from 'src/components/common/Navigation';
import { envFetch } from '@/utils/HelperUtils';
import { technologies } from '../../data/prefillData';

type TechCategory = typeof technologies[number];
type TechItem = TechCategory['children'][number];
function ChildItemCard({ category }: { category: TechCategory }) {
  if (category.children?.length > 0) {
    return (
      <div className={styles.childItemsDropdown}>
        <div className={styles.dropdownArrow}></div>
        <div className={styles.childItemsGrid}>
          {category.children.map((item: TechItem) => (
            <Navigation key={item.id} className={styles.childItemCard} path={`/TechnologyStackContainer/${category.id}/${item.id}`}>
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
    )
  }
}
export default function TechnologyStackContainer() {
  const [techStack, setTechStack] = useState<TechCategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    // Fetch technology stack data from API
    const fetchTechStack = async () => {
      try {
        const response = await envFetch('/api/tech-stack');
        const data = await response.json();
        setTechStack(data);
      } catch (error) {
        console.error('Error fetching technology stack:', error);
        // Fallback to prefill data
        setTechStack(technologies);
      }
    };

    fetchTechStack();
  }, []);

  // Handle mouse enter/leave events for category cards
  const handleMouseEnter = (categoryId: string) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <div className={styles.techStackContainer}>
      <div className={styles.techStackContent}>
        <h2 className={styles.sectionTitle}>Technology Stack</h2>
        <p className={styles.description}>Technologies and tools I use to build amazing applications</p>

        {techStack.length > 0 ? (
          <div className={styles.categoriesContainer}>
            {techStack.map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryCard} ${hoveredCategory === category.id ? styles.categoryCardHovered : ''}`}
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    <span className={styles.categoryInitial}>{category.name.charAt(0)}</span>
                  </div>
                  <div className={styles.categoryInfo}>
                    <h3 className={styles.categoryName}>{category.name}</h3>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                {/* Child items dropdown */}
                (hoveredCategory === category.id && <ChildItemCard category={category} />)
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
            <span className={styles.buttonArrow}>←</span> Home
          </button>
        </Navigation>
        <Navigation path="/Blog">
          <button className={styles.navButton}>
            Blog <span className={styles.buttonArrow}>→</span>
          </button>
        </Navigation>
      </div>
    </div>
  );
}