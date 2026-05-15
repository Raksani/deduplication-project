import React from 'react'
import styles from './ConceptSection.module.css'

const concepts = [
  {
    icon: '◈',
    color: 'green',
    title: 'What is Deduplication?',
    body: 'A type of compression that identifies redundant segments of data and replaces duplicate segments with a lightweight pointer — rather than storing the same bytes twice.',
  },
  {
    icon: '⧖',
    color: 'cyan',
    title: 'Minimum Chunk Size',
    body: 'Files or chunks smaller than 16 KiB are not deduplicated. Chunks are typically 16–48 KiB. For NAS and View sources, the file size itself primarily determines the resulting chunk size.',
  },
  {
    icon: '⟳',
    color: 'orange',
    title: 'Variable Length vs Fixed Length',
    body: 'Cohesity uses variable-length, sliding-window deduplication. Other vendors may use fixed-length chunking. Variable-length adapts to content shifts (byte insertions), avoiding chunk misalignment that breaks fixed-length dedup.',
  },
  {
    icon: '⚡',
    color: 'yellow',
    title: 'Inline by Default',
    body: 'Deduplication is inline by default — it occurs as the cluster saves blocks to the partition. When disabled, data is first written raw, then re-read 4 hours later (default) and deduplicated in a post-process pass.',
  },
]

export default function ConceptSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>01 / FOUNDATIONS</span>
          <h2 className={styles.heading}>Core Concepts</h2>
          <p className={styles.sub}>Before diving into the mechanics, understand what deduplication is and why it matters.</p>
        </div>
        <div className={styles.grid}>
          {concepts.map((c, i) => (
            <div key={i} className={`${styles.card} ${styles[`card_${c.color}`]}`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{c.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardBody}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
