"use client";

import { useEffect, useState } from "react";
import { CinematicHero } from '@/components/ui/cinematic-landing-hero'
import React from 'react'
import Component from '../components/ui/testimonial-v2'
import { TechBackground } from '@/components/ui/tech-background'
import { Features } from "@/components/blocks/features-2";

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="overflow-x-hidden w-full min-h-screen relative">
      <TechBackground />
      <CinematicHero 
        brandName="Book Buddy"
        tagline1="Book Buddy"
        tagline2="From browsing to buying—made seamless"
        cardHeadingLeft="Smart Management Order System"
        cardDescriptionLeft="A cloud-based BookBuddy Manager developed by Cloud Solutions, using Flask, AWS EC2, and DynamoDB."
        cardHeadingRight="Smart Connectivity"
        cardDescriptionRight="Real-time Order Management with SNS notifications and IAM Security for a seamless experience."
        metricValue={12500}
        metricLabel="Books Cataloged"
        ctaHeading="Experience Seamless Management"
        ctaDescription="Join the community of readers and managers using our AWS-powered bookstore platform."
      />
      <Features/>
      <Component/>

    </div>
  )
}

export default Page