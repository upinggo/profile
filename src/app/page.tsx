'use client';

import styles from '@/styles/page.module.css';
import CommonKnowledge from '@/components/CommonKnowledge';
import ProfileContainer from '@/pages/ProfileContainer';

export default function Home() {
  return (
    <main className={styles.main}>
      <ProfileContainer />
      <CommonKnowledge />
    </main>
  );
}