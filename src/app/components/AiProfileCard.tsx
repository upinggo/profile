import { useState } from 'react';
import styles from '../styles/page.module.css';

interface AiProfileProps {
  id: string;
  name: string;
  description: string;
  capabilities?: string[];
}

export default function AiProfileCard({ 
  id, 
  name, 
  description, 
  capabilities = [] 
}: AiProfileProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={styles.profileCard} 
      onClick={() => setExpanded(!expanded)}
      style={{ cursor: 'pointer' }}
    >
      <h4>{name}</h4>
      <p>{description}</p>
      
      {expanded && capabilities.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h5>Capabilities:</h5>
          <ul style={{ textAlign: 'left', fontSize: '0.9rem' }}>
            {capabilities.map((cap, index) => (
              <li key={`${id}-${index}`}>{cap}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}