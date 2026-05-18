import React, { useState } from 'react'
import styles from './VarVsFixed.module.css'

// Simulated name list — used for the byte-level example
const NAMES = [
  { name: 'Amy',       bytes: 3  },
  { name: 'Jonathan',  bytes: 8  },
  { name: 'Jo',        bytes: 2  },
  { name: 'Alexander', bytes: 9  },
  { name: 'Li',        bytes: 2  },
  { name: 'Sam',       bytes: 3  },
]

// Fixed chunk size for the demo
const FIXED_SIZE = 4

export default function VarVsFixed() {
  const [view, setView] = useState('problem') // 'problem' | 'fixed' | 'variable'

  // Build a flat byte stream from names (simplified)
  const stream = NAMES.map(n => ({ ...n, chars: n.name.split('') }))

  // Fixed chunking — slice every FIXED_SIZE chars regardless of word boundary
  const flatChars = NAMES.flatMap(n => n.name.split(''))
  const fixedChunks = []
  for (let i = 0; i < flatChars.length; i += FIXED_SIZE) {
    fixedChunks.push(flatChars.slice(i, i + FIXED_SIZE))
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>02B / CHUNKING STRATEGY</span>
          <h2 className={styles.heading}>Variable vs Fixed Length Chunking</h2>
          <p className={styles.sub}>
            Why does chunk boundary strategy matter? Let's see what happens
            when names of different lengths are stored — and what each approach does.
          </p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${view === 'problem' ? styles.tabActive : ''}`} onClick={() => setView('problem')}>
            🧩 The Problem
          </button>
          <button className={`${styles.tab} ${view === 'fixed' ? styles.tabActiveOrange : ''}`} onClick={() => setView('fixed')}>
            ✗ Fixed Length
          </button>
          <button className={`${styles.tab} ${view === 'variable' ? styles.tabActiveGreen : ''}`} onClick={() => setView('variable')}>
            ✓ Variable Length
          </button>
        </div>

        {/* Content panels */}
        {view === 'problem' && (
          <div className={styles.panel}>
            <div className={styles.byteGrid}>
              <div className={styles.byteGridTitle}>Each name takes a different number of bytes:</div>
              <div className={styles.nameRows}>
                {NAMES.map((item, i) => (
                  <div key={i} className={styles.nameRow}>
                    <span className={styles.nameLabel}>{item.name}</span>
                    <div className={styles.nameBytes}>
                      {item.name.split('').map((ch, ci) => (
                        <div key={ci} className={styles.byte}>
                          <span className={styles.byteChar}>{ch}</span>
                          <span className={styles.byteHex}>{ch.charCodeAt(0).toString(16).padStart(2,'0')}</span>
                        </div>
                      ))}
                    </div>
                    <span className={styles.byteCount}>{item.bytes}B</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💡</span>
              <p>
                Data in the real world has <strong>variable-length records</strong> — names, log entries, JSON fields.
                A naive fixed-size chunk will slice right through the middle of a word, breaking semantic boundaries.
                This means identical names in two files may land in <em>different</em> chunk positions → deduplication fails.
              </p>
            </div>
          </div>
        )}

        {view === 'fixed' && (
          <div className={styles.panel}>
            <div className={styles.fixedDemo}>
              <div className={styles.byteGridTitle}>
                Fixed chunk size = {FIXED_SIZE} bytes. Stream is sliced mechanically every {FIXED_SIZE} bytes:
              </div>
              <div className={styles.fixedStream}>
                {fixedChunks.map((chunk, ci) => (
                  <div key={ci} className={styles.fixedChunk}>
                    <div className={styles.fixedChunkLabel}>Chunk {ci}</div>
                    <div className={styles.fixedBytes}>
                      {chunk.map((ch, bi) => (
                        <div key={bi} className={styles.byte}>
                          <span className={styles.byteChar}>{ch}</span>
                          <span className={styles.byteHex}>{ch.charCodeAt(0).toString(16).padStart(2,'0')}</span>
                        </div>
                      ))}
                      {/* Pad if last chunk is short */}
                      {Array(FIXED_SIZE - chunk.length).fill(null).map((_, pi) => (
                        <div key={`pad-${pi}`} className={`${styles.byte} ${styles.bytePad}`}>
                          <span className={styles.byteChar}>·</span>
                          <span className={styles.byteHex}>--</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.fixedHash}>SHA1:{Math.abs(chunk.join('').split('').reduce((a,c)=>a+c.charCodeAt(0),0) * 31 % 999983).toString(16).slice(0,6)}</div>
                  </div>
                ))}
              </div>
              <div className={styles.problemBox}>
                <div className={styles.problemTitle}>⚠️ Why this fails</div>
                <ul className={styles.problemList}>
                  <li>Chunk 0 contains <code>AmyJ</code> — it splits Jonathan's name across two chunks.</li>
                  <li>If you insert a new name before "Amy", <strong>every single chunk shifts</strong> — all chunk hashes change.</li>
                  <li>This destroys deduplication — what looked like a duplicate now has a completely different hash.</li>
                  <li>Works fine for fixed-size records (e.g., raw disk blocks), but breaks on real-world variable data.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {view === 'variable' && (
          <div className={styles.panel}>
            <div className={styles.varDemo}>
              <div className={styles.byteGridTitle}>
                Variable chunking — boundaries adapt to content via RABIN rolling hash:
              </div>
              <div className={styles.varStream}>
                {NAMES.map((item, i) => {
                  const colors = ['green','cyan','orange','yellow','green','cyan']
                  const color = colors[i]
                  return (
                    <div key={i} className={`${styles.varChunk} ${styles[`varChunk_${color}`]}`}>
                      <div className={styles.varChunkTop}>
                        <span className={styles.varChunkLabel}>Chunk {i}</span>
                        <span className={styles.varChunkSize}>{item.bytes}B</span>
                      </div>
                      <div className={styles.varBytes}>
                        {item.name.split('').map((ch, ci) => (
                          <div key={ci} className={styles.byte}>
                            <span className={styles.byteChar}>{ch}</span>
                            <span className={styles.byteHex}>{ch.charCodeAt(0).toString(16).padStart(2,'0')}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.varHash}>
                        SHA1:{Math.abs(item.name.split('').reduce((a,c)=>a+c.charCodeAt(0),0) * 31 % 999983).toString(16).slice(0,6)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className={styles.successBox}>
                <div className={styles.successTitle}>✅ Why this works</div>
                <ul className={styles.successList}>
                  <li>Each name lands in its own chunk — <strong>boundaries are content-driven</strong>, not position-driven.</li>
                  <li>Insert a new name at the start → only that chunk changes. <strong>All other chunks stay identical.</strong></li>
                  <li>"Sam" in File A and "Sam" in File B produce the same hash → <strong>deduplicated across files.</strong></li>
                  <li>RABIN fingerprint detects natural boundaries: same technique used for names, JSON keys, log lines, or any variable record.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Comparison table */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell} />
            <div className={`${styles.tableCell} ${styles.tableCellFixed}`}>Fixed Length</div>
            <div className={`${styles.tableCell} ${styles.tableCellVar}`}>Variable Length</div>
          </div>
          {[
            ['Chunk boundary', 'Every N bytes', 'Content-defined (RABIN hash)'],
            ['Insert 1 byte at start', 'ALL chunks shift → 0% dedup', 'Only affected chunk changes'],
            ['Same data, different offset', 'Different chunk hash ✗', 'Same chunk hash ✓'],
            ['Works best for', 'Fixed-size block devices', 'Real-world variable data'],
            ['Used by', 'Older/simpler systems', 'Cohesity, Veritas, and modern systems'],
          ].map(([label, fixed, variable], i) => (
            <div key={i} className={`${styles.tableRow} ${i % 2 === 0 ? styles.tableRowAlt : ''}`}>
              <div className={`${styles.tableCell} ${styles.tableCellLabel}`}>{label}</div>
              <div className={`${styles.tableCell} ${styles.tableCellFixed}`}>{fixed}</div>
              <div className={`${styles.tableCell} ${styles.tableCellVar}`}>{variable}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
