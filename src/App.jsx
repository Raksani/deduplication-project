import React from 'react'
import Hero from './components/Hero'
import ConceptSection from './components/ConceptSection'
import SlidingWindowDemo from './components/SlidingWindowDemo'
import VarVsFixed from './components/VarVsFixed'
import InlineVsPost from './components/InlineVsPost'
import DataTypes from './components/DataTypes'
import ZstdSection from './components/ZstdSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Hero />
      <ConceptSection />
      <SlidingWindowDemo />
      <VarVsFixed />
      <InlineVsPost />
      <DataTypes />
      <ZstdSection />
      <Footer />
    </>
  )
}
