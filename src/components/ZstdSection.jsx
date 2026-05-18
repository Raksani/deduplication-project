import React, { useState } from 'react'
import styles from './ZstdSection.module.css'

const SAMPLE_TEXT = 'Hello World! Hello World! Hello World!'

// Simulated "compressed" representation for visual effect
const ZSTD_VISUAL = [
  { label: 'Magic',        hex: 'FD 2F B5 28', desc: '4-byte magic number identifying zstd format', color: 'cyan' },
  { label: 'Frame Header', hex: 'A4 00',       desc: '2–14 bytes: window size, content size flag, checksum flag', color: 'yellow' },
  { label: 'Dictionary ID',hex: '00 00 00 00', desc: 'Optional dictionary ID (0 = no dictionary)', color: 'orange' },
  { label: 'Data Block',   hex: '52 00 00 00 48 65 6C 6C 6F 20 57 6F 72 6C 64 21 01', desc: 'Compressed data using LZ77 + Huffman/FSE entropy coding', color: 'green' },
  { label: 'Checksum',     hex: 'C4 3A 1F 2B', desc: 'Optional xxHash-64 checksum for corruption detection', color: 'green' },
]

const GZIP_VISUAL = [
  { label: 'Magic',    hex: '1F 8B',       desc: 'gzip magic number', color: 'orange' },
  { label: 'Method',   hex: '08',          desc: 'Compression method (DEFLATE)', color: 'orange' },
  { label: 'Flags',    hex: '00',          desc: 'Flags byte', color: 'orange' },
  { label: 'Mod Time', hex: '00 00 00 00', desc: 'Modification time', color: 'orange' },
  { label: 'XFL/OS',  hex: '00 FF',        desc: 'Extra flags and OS', color: 'orange' },
  { label: 'Data',     hex: 'CB 48 CD C9 C9 57 08 CF 2F CA 49 51 00 ...',  desc: 'DEFLATE compressed data (slower to decompress)', color: 'orange' },
  { label: 'CRC32',    hex: 'A0 C5 B2 2A', desc: 'CRC-32 checksum', color: 'orange' },
]

const REAL_USERS = [
  { name: 'Facebook / Meta', detail: 'Created zstd in 2015. Uses it internally for data compression across its infrastructure.', icon: '📘' },
  { name: 'Linux Kernel',    detail: 'Included since v4.14 (Nov 2017) for btrfs, squashfs filesystems and kernel modules.', icon: '🐧' },
  { name: 'Google Chrome',   detail: 'Added HTTP Content-Encoding support in v123 (March 2024). Websites can now serve zstd-compressed responses.', icon: '🌐' },
  { name: 'Firefox',         detail: 'Added zstd HTTP Content-Encoding support in v126 (May 2024).', icon: '🦊' },
  { name: 'Windows 11',      detail: 'Added native zstd support in Windows Explorer via update KB5031455 (October 2023).', icon: '🪟' },
  { name: 'AWS Redshift',    detail: 'Supports zstd as a column compression encoding for database storage.', icon: '☁️' },
]

export default function ZstdSection() {
  const [showGzip, setShowGzip] = useState(false)

  const original = SAMPLE_TEXT.length
  const gzipSize = 32   // approximate for this string
  const zstdSize = 18   // approximate for this string

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>05 / MODERN COMPRESSION</span>
          <h2 className={styles.heading}>
            Zstandard <span className={styles.accent}>(zstd)</span>
          </h2>
          <p className={styles.sub}>
            A fast, lossless <strong>compression</strong> algorithm created by Facebook in 2015.
            Not encryption — compression. It reduces data size while keeping every byte recoverable.
          </p>
        </div>

        {/* Key facts */}
        <div className={styles.factsGrid}>
          {[
            { icon: '⚡', label: 'Speed', val: '500+ MB/s', desc: 'Decompression at default level' },
            { icon: '📦', label: 'Levels', val: '-7 to 22', desc: 'Tune speed vs ratio tradeoff' },
            { icon: '📐', label: 'Standard', val: 'RFC 8878', desc: 'IETF-standardized format' },
            { icon: '🔓', label: 'License', val: 'BSD + GPL2', desc: 'Open source, free to use' },
          ].map((f, i) => (
            <div key={i} className={styles.factCard}>
              <span className={styles.factIcon}>{f.icon}</span>
              <span className={styles.factVal}>{f.val}</span>
              <span className={styles.factLabel}>{f.label}</span>
              <span className={styles.factDesc}>{f.desc}</span>
            </div>
          ))}
        </div>

        {/* Frame structure visual */}
        <div className={styles.frameCard}>
          <div className={styles.frameHeader}>
            <div className={styles.frameTabs}>
              <button
                className={`${styles.frameTab} ${!showGzip ? styles.frameTabActive : ''}`}
                onClick={() => setShowGzip(false)}
              >
                zstd frame structure
              </button>
              <button
                className={`${styles.frameTab} ${showGzip ? styles.frameTabActiveOrange : ''}`}
                onClick={() => setShowGzip(true)}
              >
                gzip (traditional)
              </button>
            </div>
          </div>

          <div className={styles.frameBody}>
            <div className={styles.frameInput}>
              <span className={styles.frameInputLabel}>Original string ({original} bytes):</span>
              <code className={styles.frameInputVal}>"{SAMPLE_TEXT}"</code>
            </div>
            <div className={styles.frameArrow}>↓ compress</div>
            <div className={styles.frameBytes}>
              {(showGzip ? GZIP_VISUAL : ZSTD_VISUAL).map((block, i) => (
                <div key={i} className={`${styles.frameBlock} ${styles[`frameBlock_${block.color}`]}`}>
                  <div className={styles.frameBlockLabel}>{block.label}</div>
                  <div className={styles.frameBlockHex}>{block.hex}</div>
                  <div className={styles.frameBlockDesc}>{block.desc}</div>
                </div>
              ))}
            </div>
            <div className={styles.sizeRow}>
              <div className={styles.sizeBox}>
                <span className={styles.sizeLabel}>Original</span>
                <span className={styles.sizeVal}>{original}B</span>
              </div>
              <div className={styles.sizeArrow}>→</div>
              <div className={`${styles.sizeBox} ${showGzip ? styles.sizeBoxOrange : styles.sizeBoxGreen}`}>
                <span className={styles.sizeLabel}>{showGzip ? 'gzip output' : 'zstd output'}</span>
                <span className={styles.sizeVal}>{showGzip ? gzipSize : zstdSize}B</span>
              </div>
              <div className={styles.sizeSaving}>
                {showGzip ? `~${Math.round((1 - gzipSize/original)*100)}% saved` : `~${Math.round((1 - zstdSize/original)*100)}% saved`}
              </div>
            </div>
          </div>
        </div>

        {/* zstd vs gzip vs brotli comparison */}
        <div className={styles.compCard}>
          <div className={styles.compTitle}>Algorithm Comparison (approximate, typical text data)</div>
          <div className={styles.compTable}>
            {[
              { algo: 'gzip / DEFLATE', year: '1992', ratio: '2.7×', speed: '~200 MB/s', color: 'orange', note: 'Still the most widely deployed' },
              { algo: 'brotli',         year: '2015', ratio: '2.9×', speed: '~100 MB/s', color: 'yellow', note: 'Great ratio, slower compression' },
              { algo: 'zstd (level 3)', year: '2016', ratio: '2.8×', speed: '~500 MB/s', color: 'green',  note: '✓ Best speed/ratio balance' },
              { algo: 'zstd (level 19)',year: '2016', ratio: '3.1×', speed: '~25 MB/s',  color: 'cyan',   note: 'Max ratio, slower compression' },
            ].map((row, i) => (
              <div key={i} className={`${styles.compRow} ${styles[`compRow_${row.color}`]}`}>
                <div className={styles.compAlgo}>{row.algo}</div>
                <div className={styles.compYear}>{row.year}</div>
                <div className={styles.compRatio}>{row.ratio}</div>
                <div className={styles.compSpeed}>{row.speed}</div>
                <div className={styles.compNote}>{row.note}</div>
              </div>
            ))}
          </div>
          <div className={styles.compNote2}>
            ⚠️ Numbers are illustrative averages. Actual results vary heavily by data type.
          </div>
        </div>

        {/* Real users — fact-checked */}
        <div className={styles.usersCard}>
          <div className={styles.usersTitle}>
            ✅ Verified real-world users <span className={styles.usersFact}>(fact-checked)</span>
          </div>
          <div className={styles.usersGrid}>
            {REAL_USERS.map((u, i) => (
              <div key={i} className={styles.userCard}>
                <span className={styles.userIcon}>{u.icon}</span>
                <div>
                  <div className={styles.userName}>{u.name}</div>
                  <div className={styles.userDetail}>{u.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.disclaimer}>
            📌 Note: zstd is a <strong>compression</strong> algorithm, not an encryption algorithm.
            It makes data smaller — a separate encryption layer (AES, TLS) would be added on top if secrecy is needed.
            YouTube was not found in verified sources as a zstd user at the time of writing.
          </div>
        </div>

        {/* Why relevant to dedup */}
        <div className={styles.dedupLink}>
          <div className={styles.dedupLinkTitle}>🔗 How zstd relates to deduplication</div>
          <p className={styles.dedupLinkBody}>
            Deduplication and compression are <strong>complementary</strong> — not competing — techniques.
            In Cohesity and similar systems, data first goes through deduplication (remove duplicate chunks),
            then through compression (shrink the unique chunks that remain). zstd is one compression algorithm
            that could be applied at that second stage. Because zstd is fast to decompress,
            read performance stays high even on compressed data — critical for backup restore speed.
          </p>
        </div>
      </div>
    </section>
  )
}
