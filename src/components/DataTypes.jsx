import React from 'react'
import styles from './DataTypes.module.css'

const wellData = [
  {
    icon: '💾',
    title: 'Backup Snapshots',
    desc: 'Daily backups of the same dataset contain massive overlap. Only changed blocks differ between runs.',
  },
  {
    icon: '🖥️',
    title: 'Virtual Machine Images',
    desc: 'Hundreds of VMs often share the same OS base image. Dedup stores the OS once, regardless of how many VMs reference it.',
  },
  {
    icon: '📊',
    title: 'Large Datasets with Identical Records',
    desc: 'Data warehouses, log files, and analytics datasets frequently contain repeating rows or time-series patterns.',
  },
]

const poorData = [
  {
    icon: '🔬',
    title: 'Scientific / Genomic Data',
    desc: 'Each file tends to be unique raw sensor or sequencing output — very few duplicate chunks exist.',
    tag: 'Highly Unique',
    color: 'orange',
  },
  {
    icon: '🗜️',
    title: 'Already Compressed Files',
    desc: 'ZIP, GZIP, MP4, JPEG — compression introduces randomness that makes identical chunk boundaries near-impossible.',
    tag: 'Pre-Compressed',
    color: 'orange',
  },
  {
    icon: '🔐',
    title: 'Encrypted Data',
    desc: 'Encryption obscures repeating patterns. Even two identical files produce completely different ciphertext chunks.',
    tag: 'Encrypted',
    color: 'orange',
  },
  {
    icon: '⚡',
    title: 'High-Churn Databases',
    desc: 'Databases with frequent random writes break up patterns. Block-level dedup ratios approach 1:1.',
    tag: 'High Change Rate',
    color: 'orange',
  },
]

export default function DataTypes() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>04 / WORKLOAD PLANNING</span>
          <h2 className={styles.heading}>What Deduplicates Well?</h2>
          <p className={styles.sub}>
            Understanding your data type is critical for predicting deduplication ratios before deployment.
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={styles.colIcon}>✓</span>
              <span className={styles.colTitle}>Deduplicates Well</span>
            </div>
            <div className={styles.cards}>
              {wellData.map((item, i) => (
                <div key={i} className={`${styles.card} ${styles.cardGood}`}>
                  <span className={styles.cardIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.cardDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.colHeader}>
              <span className={`${styles.colIcon} ${styles.colIconBad}`}>✗</span>
              <span className={`${styles.colTitle} ${styles.colTitleBad}`}>Deduplicates Poorly</span>
            </div>
            <div className={styles.cards}>
              {poorData.map((item, i) => (
                <div key={i} className={`${styles.card} ${styles.cardBad}`}>
                  <span className={styles.cardIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.cardTitle}>
                      {item.title}
                      <span className={styles.tag}>{item.tag}</span>
                    </div>
                    <div className={styles.cardDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
