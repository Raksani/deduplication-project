# Deduplication — Interactive Educational Website

An interactive learning resource for teaching **variable-length sliding window deduplication**, built with React + Vite.

![Tech](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Build](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-Educational-green)

---

## What You'll Learn

- **What deduplication is** — compression via redundancy elimination with pointers
- **Variable-length vs fixed-length chunking** — why Cohesity's approach adapts to content shifts
- **RABIN fingerprinting** — how a rolling hash detects chunk boundaries
- **SHA-1 hashing** — how chunk IDs are generated and compared
- **Inline vs post-process deduplication** — trade-offs in timing
- **Data types** — which workloads benefit most (and least) from dedup

## Interactive Features

| Section | Feature |
|---------|---------|
| 🎬 Hero | Animated binary canvas backdrop |
| 📖 Concepts | Four core concept cards |
| ⚙️ Demo | Step-by-step sliding window visualiser with auto-play |
| 🔄 Inline/Post | Toggle comparison with pipeline diagrams |
| 📊 Data Types | Well/poorly deduplicating workloads side-by-side |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
git clone https://github.com/Raksani/deduplication-edu.git
cd deduplication-edu
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder is ready to deploy to GitHub Pages, Netlify, or Vercel.

---

## Deploy to GitHub Pages

1. Install the gh-pages helper:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json` scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```

3. Add `base` to `vite.config.js`:
   ```js
   base: '/deduplication-edu/'
   ```

4. Run:
   ```bash
   npm run build && npm run deploy
   ```

---

## Project Structure

```
deduplication-edu/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── Hero.jsx / .module.css
        ├── ConceptSection.jsx / .module.css
        ├── SlidingWindowDemo.jsx / .module.css
        ├── InlineVsPost.jsx / .module.css
        ├── DataTypes.jsx / .module.css
        └── Footer.jsx / .module.css
```

---

## Technical Concepts Covered

### RABIN Fingerprinting (Rolling Hash)
A polynomial rolling hash computed over a sliding byte window. When the hash value meets a boundary condition (e.g., last N bits = 0), a chunk boundary is declared. This makes boundaries **content-defined** — inserting bytes at the start doesn't shift all downstream boundaries.

### SHA-1 Chunk Hashing
Each isolated chunk is hashed with SHA-1 to produce a 160-bit fingerprint. This hash serves as the chunk's global ID. Two chunks with identical bytes always produce the same SHA-1 — enabling cross-file, cross-backup deduplication.

### Variable-Length vs Fixed-Length
| | Variable-Length | Fixed-Length |
|--|--|--|
| Boundary method | Content-defined (RABIN) | Fixed byte offset |
| Byte-shift resilience | ✅ Resistant | ❌ All chunks shift |
| Typical size | 16–48 KiB | Fixed (e.g. 4 KiB) |
| Used by | Cohesity, Veeam | Older systems |

---

## References

- Cohesity storage platform technical documentation
- Rabin, M.O. (1981). "Fingerprinting by Random Polynomials"
- Broder, A.Z. (1993). "Some Applications of Rabin's Fingerprinting Method"

---

*Built for educational purposes. Content derived from Cohesity training materials.*
