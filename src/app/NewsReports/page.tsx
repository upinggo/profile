'use client';

import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/common/Navigation';
import { getGHPagesAssetURL, isDevelopment } from '@/utils/HelperUtils';
import styles from './page.module.css';

type Snapshot = { time: string; path: string };
type DateGroup = { date: string; snapshots: Snapshot[] };
type Manifest = { latest: string | null; dates: DateGroup[] };

const LATEST_KEY = '__latest__';

export default function NewsReports() {
  const [base, setBase] = useState<string>('');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(LATEST_KEY);
  const [openDates, setOpenDates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // In dev, use a relative URL so the local dev server serves the files.
    // In production (static export / GH Pages), prefix with the asset base.
    const assetBase = isDevelopment ? '' : getGHPagesAssetURL();
    setBase(assetBase);

    fetch(`${assetBase}/news-reports/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Manifest>;
      })
      .then((m) => {
        setManifest(m);
        if (m.dates.length > 0) {
          setOpenDates({ [m.dates[0].date]: true });
        }
      })
      .catch((e) => setError(`Failed to load manifest: ${e.message}`));
  }, []);

  const iframeSrc = useMemo(() => {
    if (!manifest) return '';
    if (selected === LATEST_KEY) {
      return manifest.latest ? `${base}/news-reports/${manifest.latest}` : '';
    }
    return `${base}/news-reports/${selected}`;
  }, [manifest, selected, base]);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Navigation path="/">
          <button className={styles.backButton}>← Back to Home</button>
        </Navigation>
        <h1 className={styles.title}>News Reports</h1>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="News history">
          {error && <p className={styles.error}>{error}</p>}
          {!manifest && !error && <p className={styles.muted}>Loading history…</p>}
          {manifest && (
            <ul className={styles.dateList}>
              {manifest.latest && (
                <li>
                  <button
                    className={`${styles.latestButton} ${selected === LATEST_KEY ? styles.active : ''}`}
                    onClick={() => setSelected(LATEST_KEY)}
                  >
                    ● Latest
                  </button>
                </li>
              )}
              {manifest.dates.map((group) => {
                const isOpen = !!openDates[group.date];
                return (
                  <li key={group.date} className={styles.dateGroup}>
                    <button
                      className={styles.dateToggle}
                      onClick={() => toggleDate(group.date)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.caret}>{isOpen ? '▾' : '▸'}</span>
                      {group.date}
                      <span className={styles.count}>{group.snapshots.length}</span>
                    </button>
                    {isOpen && (
                      <ul className={styles.timeList}>
                        {group.snapshots.map((snap) => (
                          <li key={snap.path}>
                            <button
                              className={`${styles.timeButton} ${selected === snap.path ? styles.active : ''}`}
                              onClick={() => setSelected(snap.path)}
                            >
                              {snap.time}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              {manifest.dates.length === 0 && !manifest.latest && (
                <li className={styles.muted}>No snapshots available.</li>
              )}
            </ul>
          )}
        </aside>

        <div className={styles.frameWrapper}>
          {iframeSrc ? (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              title="News Report"
              className={styles.frame}
              loading="lazy"
            />
          ) : (
            <p className={styles.muted}>Select a snapshot to view.</p>
          )}
        </div>
      </div>
    </div>
  );
}
