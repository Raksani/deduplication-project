import React, { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const BINARY = '10110100101001101011001010110100101001101011001010110100101001101'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame = 0
    let raf

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cols = Math.floor(canvas.width / 18)
      const rows = Math.floor(canvas.height / 22)
      ctx.font = '12px JetBrains Mono, monospace'
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = (r * cols + c + frame) % BINARY.length
          const bit = BINARY[idx]
          const alpha = 0.03 + (Math.sin((r + c + frame * 0.05) * 0.4) * 0.5 + 0.5) * 0.08
          ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`
          ctx.fillText(bit, c * 18, r * 22 + 14)
        }
      }
      frame++
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          COHESITY · STORAGE SYSTEMS
        </div>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Variable-Length</span>
          <span className={styles.titleLine2}>
            Sliding Window
            <span className={styles.accent}> Deduplication</span>
          </span>
        </h1>
        <p className={styles.subtitle}>
          An interactive deep-dive into how modern storage systems eliminate redundant
          data using Rabin fingerprinting and SHA-1 content-based chunking.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>16–48 KiB</span>
            <span className={styles.statLabel}>Typical Chunk Size</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>SHA-1</span>
            <span className={styles.statLabel}>Hash Algorithm</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>Inline</span>
            <span className={styles.statLabel}>Default Mode</span>
          </div>
        </div>
        <a href="#demo" className={styles.cta}>
          Launch Interactive Demo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3L13 8L8 13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </a>
      </div>
    </section>
  )
}
