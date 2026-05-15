import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './SlidingWindowDemo.module.css'

// Simulated data stream — pairs of 8-char binary strings
const DATA_STREAM = [
  { id: 0, bits: '10110100', label: 'A' },
  { id: 1, bits: '01001101', label: 'B' },
  { id: 2, bits: '10110100', label: 'A' }, // duplicate of 0
  { id: 3, bits: '11001010', label: 'C' },
  { id: 4, bits: '01001101', label: 'B' }, // duplicate of 1
  { id: 5, bits: '10110100', label: 'A' }, // duplicate of 0
  { id: 6, bits: '00101101', label: 'D' },
  { id: 7, bits: '11001010', label: 'C' }, // duplicate of 3
]

const CHUNK_HASHES = {
  A: 'SHA1:3a7f2b',
  B: 'SHA1:9c4d1e',
  C: 'SHA1:5e8f3c',
  D: 'SHA1:2b6a9d',
}

const CHUNK_COLORS = {
  A: 'green',
  B: 'cyan',
  C: 'orange',
  D: 'yellow',
}

const STEPS = [
  {
    windowStart: 0,
    windowEnd: 0,
    phase: 'scan',
    description: 'The RABIN fingerprint function begins scanning the data stream from the start.',
    detail: 'A sliding window of variable size moves across the raw byte stream. The Rabin hash is a rolling checksum — computed efficiently as the window slides one byte at a time.',
  },
  {
    windowStart: 0,
    windowEnd: 1,
    phase: 'scan',
    description: 'Window expands. RABIN checks if a chunk boundary condition is met.',
    detail: 'Boundaries are detected when the rolling hash value hits a specific bit pattern (e.g., last N bits equal zero). This gives variable-length chunks — the content drives the split points.',
  },
  {
    windowStart: 0,
    windowEnd: 2,
    phase: 'chunk',
    chunked: [0],
    description: 'Chunk boundary found! Chunk "A" is isolated (bits: 10110100).',
    detail: 'The isolated chunk is passed to SHA-1 to produce a 160-bit fingerprint. This hash is the chunk\'s unique ID — identical data always produces the same hash.',
  },
  {
    windowStart: 1,
    windowEnd: 3,
    phase: 'chunk',
    chunked: [0, 1],
    description: 'Second chunk "B" extracted. SHA-1 hash computed → SHA1:9c4d1e',
    detail: 'Each chunk\'s SHA-1 hash is looked up in the global chunk index. If the hash exists, this chunk is a duplicate. If not, the chunk data is stored and the hash is indexed.',
  },
  {
    windowStart: 2,
    windowEnd: 4,
    phase: 'dedup',
    chunked: [0, 1, 2],
    dupFound: 2,
    description: '⚡ Duplicate detected! Chunk at position 2 has hash SHA1:3a7f2b — same as chunk "A".',
    detail: 'Instead of storing this chunk\'s bytes again, the system only writes a logical pointer back to the already-stored chunk "A". Storage is saved — no bytes duplicated.',
  },
  {
    windowStart: 3,
    windowEnd: 5,
    phase: 'chunk',
    chunked: [0, 1, 2, 3],
    description: 'New unique chunk "C" found. Hash SHA1:5e8f3c not in index — stored to flash/HDD tier.',
    detail: 'Unique chunks are written to the storage tier (flash for performance, HDD for capacity). The hash is added to the global chunk index for future dedup lookups.',
  },
  {
    windowStart: 4,
    windowEnd: 6,
    phase: 'dedup',
    chunked: [0, 1, 2, 3, 4],
    dupFound: 4,
    description: '⚡ Duplicate detected! Chunk at position 4 matches "B" (SHA1:9c4d1e).',
    detail: 'Logical metadata is updated to point to the first occurrence of this chunk. The duplicate bytes are discarded — only the pointer is stored.',
  },
  {
    windowStart: 5,
    windowEnd: 7,
    phase: 'dedup',
    chunked: [0, 1, 2, 3, 4, 5],
    dupFound: 5,
    description: '⚡ Duplicate again! Position 5 matches "A" (SHA1:3a7f2b) — third occurrence.',
    detail: 'High-frequency duplicates like chunk "A" are common in backup workloads (e.g., OS boot volume snapshots). Each duplicate saves 8–48 KiB of actual storage.',
  },
  {
    windowStart: 6,
    windowEnd: 7,
    phase: 'chunk',
    chunked: [0, 1, 2, 3, 4, 5, 6],
    description: 'New unique chunk "D" — SHA1:2b6a9d. Written to storage tier.',
    detail: 'This chunk has never been seen before. The data bytes are stored and the hash is indexed for future deduplication.',
  },
  {
    windowStart: 7,
    windowEnd: 7,
    phase: 'dedup',
    chunked: [0, 1, 2, 3, 4, 5, 6, 7],
    dupFound: 7,
    description: '⚡ Final chunk "C" is a duplicate (SHA1:5e8f3c). Scan complete!',
    detail: 'Result: 8 logical chunks, only 4 unique chunks stored. 4 duplicates replaced by pointers. Space saving: ~50% on this stream.',
  },
]

export default function SlidingWindowDemo() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)
  const current = STEPS[step]

  const next = useCallback(() => {
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }, [])

  const prev = () => setStep(s => Math.max(s - 1, 0))
  const reset = () => { setStep(0); setPlaying(false) }

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= STEPS.length - 1) { setPlaying(false); return s }
          return s + 1
        })
      }, 2200)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  const isDup = (idx) => current.dupFound === idx
  const isChunked = (idx) => current.chunked?.includes(idx)
  const inWindow = (idx) => idx >= current.windowStart && idx <= current.windowEnd

  const uniqueChunks = ['A', 'B', 'C', 'D']
  const processedChunks = current.chunked || []
  const dupCount = processedChunks.filter(i => {
    const d = DATA_STREAM[i]
    const firstIdx = DATA_STREAM.findIndex(x => x.label === d.label)
    return firstIdx !== i
  }).length
  const uniqueCount = processedChunks.length - dupCount

  return (
    <section className={styles.section} id="demo">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>02 / INTERACTIVE DEMO</span>
          <h2 className={styles.heading}>Variable-Length Sliding Window</h2>
          <p className={styles.sub}>
            Step through the deduplication process and see how RABIN fingerprinting
            identifies chunk boundaries and SHA-1 detects duplicates.
          </p>
        </div>

        {/* Main visualiser */}
        <div className={styles.vizCard}>
          {/* Data stream */}
          <div className={styles.streamSection}>
            <div className={styles.streamLabel}>RAW DATA STREAM</div>
            <div className={styles.stream}>
              {DATA_STREAM.map((chunk, idx) => {
                const color = CHUNK_COLORS[chunk.label]
                const inWin = inWindow(idx)
                const dup = isDup(idx)
                const processed = isChunked(idx)
                return (
                  <div
                    key={idx}
                    className={`
                      ${styles.chunk}
                      ${inWin ? styles.inWindow : ''}
                      ${dup ? styles.dupChunk : ''}
                      ${processed && !dup ? styles[`chunk_${color}`] : ''}
                      ${processed && dup ? styles.dupProcessed : ''}
                    `}
                  >
                    <div className={styles.chunkTop}>
                      <span className={styles.rabin}>RABIN</span>
                      <span className={styles.chunkIdx}>#{idx}</span>
                    </div>
                    <div className={styles.bits}>{chunk.bits}</div>
                    <div className={styles.chunkBottom}>
                      {processed ? (
                        dup ? (
                          <span className={styles.pointer}>→ PTR:{chunk.label}</span>
                        ) : (
                          <span className={styles.hash}>{CHUNK_HASHES[chunk.label]}</span>
                        )
                      ) : (
                        <span className={styles.hashEmpty}>SHA-1 HASH</span>
                      )}
                    </div>
                    {dup && <div className={styles.dupBadge}>DUP</div>}
                  </div>
                )
              })}
            </div>

            {/* Window indicator */}
            <div className={styles.windowRow}>
              {DATA_STREAM.map((_, idx) => (
                <div key={idx} className={`${styles.winCell} ${inWindow(idx) ? styles.winActive : ''}`}>
                  {inWindow(idx) && (
                    idx === current.windowStart && idx === current.windowEnd
                      ? '◀▶'
                      : idx === current.windowStart
                      ? '◀'
                      : idx === current.windowEnd
                      ? '▶'
                      : '━'
                  )}
                </div>
              ))}
            </div>
            <div className={styles.windowLabel}>
              ↑ SLIDING WINDOW — variable length driven by RABIN rolling hash boundary detection
            </div>
          </div>

          {/* Index table */}
          <div className={styles.indexSection}>
            <div className={styles.indexTitle}>CHUNK INDEX (Global Dedup Store)</div>
            <div className={styles.indexTable}>
              {uniqueChunks.map(label => {
                const color = CHUNK_COLORS[label]
                const chunk = DATA_STREAM.find(c => c.label === label)
                const revealed = (current.chunked || []).some(i => DATA_STREAM[i].label === label && DATA_STREAM.findIndex(x => x.label === label) === i)
                return (
                  <div key={label} className={`${styles.indexRow} ${revealed ? styles[`indexRow_${color}`] : styles.indexRowHidden}`}>
                    <span className={styles.indexLabel}>Chunk {label}</span>
                    <span className={styles.indexBits}>{revealed ? chunk.bits : '????????'}</span>
                    <span className={styles.indexHash}>{revealed ? CHUNK_HASHES[label] : '——————'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step info panel */}
        <div className={styles.infoPanel}>
          <div className={`${styles.infoPhase} ${styles[`phase_${current.phase}`]}`}>
            {current.phase === 'scan' ? '🔍 SCANNING' : current.phase === 'chunk' ? '✂️ CHUNK FOUND' : '♻️ DUPLICATE'}
          </div>
          <p className={styles.infoDesc}>{current.description}</p>
          <p className={styles.infoDetail}>{current.detail}</p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNum}>{processedChunks.length}</span>
            <span className={styles.statLbl}>Logical Chunks</span>
          </div>
          <div className={styles.statBox}>
            <span className={`${styles.statNum} ${styles.statGreen}`}>{uniqueCount}</span>
            <span className={styles.statLbl}>Unique (Stored)</span>
          </div>
          <div className={styles.statBox}>
            <span className={`${styles.statNum} ${styles.statOrange}`}>{dupCount}</span>
            <span className={styles.statLbl}>Duplicates (Freed)</span>
          </div>
          <div className={styles.statBox}>
            <span className={`${styles.statNum} ${styles.statCyan}`}>
              {processedChunks.length > 0 ? Math.round((dupCount / processedChunks.length) * 100) : 0}%
            </span>
            <span className={styles.statLbl}>Space Saved</span>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.btn} onClick={reset} disabled={step === 0}>↺ Reset</button>
          <button className={styles.btn} onClick={prev} disabled={step === 0}>← Prev</button>
          <button
            className={`${styles.btn} ${styles.btnPlay}`}
            onClick={() => setPlaying(p => !p)}
            disabled={step === STEPS.length - 1}
          >
            {playing ? '⏸ Pause' : '▶ Auto-Play'}
          </button>
          <button className={styles.btn} onClick={next} disabled={step === STEPS.length - 1}>Next →</button>
          <div className={styles.progress}>
            <span className={styles.progressText}>Step {step + 1} / {STEPS.length}</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
