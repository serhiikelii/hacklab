"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { AnnouncementBanner } from "@/components/announcements/AnnouncementBanner"
import { HeroSection } from "@/components/sections/HeroSection"
import { ServiceSection } from "@/components/sections/ServiceSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { CommonIssues } from "@/components/sections/CommonIssues"
import { ArticlesSection } from "@/components/sections/ArticlesSection"

export default function Home() {
  return (
    <>
      <Header />
      <AnnouncementBanner />
      <main>
        <HeroSection />
        <CommonIssues />
        <ArticlesSection />
        <ServiceSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
