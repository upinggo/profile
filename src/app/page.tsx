'use client';

import styles from '@/styles/page.module.css';
import CommonKnowledge from '@/app/CommonKnowledge';
import ProfileContainer from '@/app/ProfileContainer/page';

export default function Home() {
  return (
    <main className={styles.main}>
      <ProfileContainer />
      <CommonKnowledge />
    </main>
  );
}