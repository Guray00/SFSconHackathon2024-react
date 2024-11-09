"use client";
// this is the main page loaded

import SideNav from "@/components/sideNav";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <SideNav />       
    </section>
  );
}
