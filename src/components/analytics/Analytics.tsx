"use client";

import { ConsentBar } from "./ConsentBar";
import { MetaPixel } from "./MetaPixel";
import { ScrollDepth } from "./ScrollDepth";

export function Analytics() {
  return (
    <>
      <MetaPixel />
      <ScrollDepth />
      <ConsentBar />
    </>
  );
}
