import { Hero } from "@/components/sections/Hero";
import { WhatIsApi } from "@/components/sections/WhatIsApi";
import { BeginnerStory } from "@/components/sections/BeginnerStory";
import { ApiSecurity } from "@/components/sections/ApiSecurity";
import { TryItYourself } from "@/components/sections/TryItYourself";
import { WhyCare } from "@/components/sections/WhyCare";
import { BuildYourOwn } from "@/components/sections/BuildYourOwn";
import { GoDeeper } from "@/components/sections/GoDeeper";

export default function Home() {
  return (
    <>
      <Hero />
      <BeginnerStory />
      <WhatIsApi />
      <TryItYourself />
      <ApiSecurity />
      <WhyCare />
      <BuildYourOwn />
      <GoDeeper />
    </>
  );
}
