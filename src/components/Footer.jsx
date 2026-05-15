import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.brand}>DEDUP·EDU</span>
          <p className={styles.copy}>
            Educational resource on variable-length sliding window deduplication.<br />
            Based on Cohesity storage platform documentation and course materials.
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.tag}>
            <span className={styles.dot} />
            For educational use only
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.bottom}>
        <span className={styles.bottomText}>
          Built with React · Open source educational content
        </span>
        <span className={styles.bottomText}>
          Concepts: RABIN fingerprinting · SHA-1 hashing · Variable-length chunking
        </span>
      </div>
    </footer>
  )
}
