import type { Metadata } from "next";
import { Discipline } from "@/components/sections/Discipline";
import { FAQ } from "@/components/sections/FAQ";
import { Guarantee } from "@/components/sections/Guarantee";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Performance } from "@/components/sections/Performance";
import { Pricing } from "@/components/sections/Pricing";
import { Strip } from "@/components/sections/Strip";
import { canonicalUrl } from "@/lib/site";

const canonical = canonicalUrl("/");

export const metadata: Metadata = {
  alternates: canonical ? { canonical } : undefined,
};

export default function Home() {
  return (
    <>
      <Hero />
      <Strip />
      <HowItWorks />
      <Discipline />
      <Guarantee />
      <Performance />
      <Pricing />
      <FAQ />
    </>
  );
}
