import React, { useState } from 'react'
import styles from './InlineVsPost.module.css'

export default function InlineVsPost() {
  const [active, setActive] = useState('inline')

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>03 / DEDUPLICATION TIMING</span>
          <h2 className={styles.heading}>Inline vs Post-Process</h2>
          <p className={styles.sub}>
            Deduplication can happen at write time (inline) or after data lands on disk.
            Toggle deduplication at the Storage Domain level in Cohesity.
          </p>
        </div>

        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${active === 'inline' ? styles.active : ''}`}
            onClick={() => setActive('inline')}
          >
            Inline (Default)
          </button>
          <button
            className={`${styles.toggleBtn} ${active === 'post' ? styles.activePost : ''}`}
            onClick={() => setActive('post')}
          >
            Post-Process
          </button>
        </div>

        <div className={styles.content}>
          {active === 'inline' ? (
            <div className={styles.panel}>
              <div className={styles.flow}>
                {['Incoming Data', 'RABIN Chunking', 'SHA-1 Hash', 'Dedup Lookup', 'Write Unique\nto Storage Tier'].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`${styles.flowStep} ${styles.flowGreen}`}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span className={styles.stepLabel}>{step}</span>
                    </div>
                    {i < 4 && <div className={styles.arrow}>→</div>}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.detail}>
                <h3 className={styles.detailTitle}>⚡ Inline Deduplication = ON</h3>
                <ul className={styles.detailList}>
                  <li>Deduplication occurs <strong>before</strong> data is written to any storage tier in the cluster.</li>
                  <li>Reduces the amount of data that ever touches flash or HDD — saving I/O and capacity from the start.</li>
                  <li>Slight CPU overhead at write time, but storage savings are immediate.</li>
                  <li>This is the <strong>default</strong> and recommended setting for most workloads.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.panel}>
              <div className={styles.flow}>
                {['Incoming Data', 'Write Raw\nto Storage', '4 hrs later\n(default)', 'Re-read\nfrom Disk', 'Dedup\n& Compact'].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`${styles.flowStep} ${i === 2 ? styles.flowOrange : styles.flowCyan}`}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span className={styles.stepLabel}>{step}</span>
                    </div>
                    {i < 4 && <div className={styles.arrow}>→</div>}
                  </React.Fragment>
                ))}
              </div>
              <div className={styles.detail}>
                <h3 className={styles.detailTitle}>⏱ Inline Deduplication = OFF (Post-Process)</h3>
                <ul className={styles.detailList}>
                  <li>Data is <strong>not deduplicated</strong> when first written to the storage tier.</li>
                  <li>After <strong>4 hours</strong> (default interval), the data is re-read from disk into memory.</li>
                  <li>Deduplication then runs as a background process, compacting redundant data.</li>
                  <li>Useful when write latency is more critical than immediate storage efficiency.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className={styles.uiNote}>
          <div className={styles.uiNoteTitle}>In Cohesity UI</div>
          <div className={styles.uiMock}>
            <div className={styles.mockRow}>
              <div className={styles.mockToggle} />
              <span className={styles.mockLabel}>Deduplication</span>
            </div>
            <div className={`${styles.mockRow} ${styles.mockSub}`}>
              <div className={`${styles.mockToggle} ${styles.mockToggleOn}`} />
              <div>
                <div className={styles.mockLabel}>Inline Deduplication</div>
                <div className={styles.mockDesc}>
                  If on, deduplication occurs as the Cluster saves blocks to the Partition. If off,
                  deduplication occurs after the Cluster writes data to the Partition.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
