"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InfiniteMovingCards } from "@/src/app/components/ui/infinite-moving-cards";
import { Description } from "@radix-ui/react-dialog";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] fixed flex items-center justify-center">
      {/* Radial gradient for the container */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Scrollable content */}
      <div className="relative z-20 flex flex-col h-full w-full max-w-7xl px-6 sm:px-12 overflow-y-auto">

        <h1 className="text-5xl sm:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight mt-40 mb-16">
          Execute,  save and post your code <br /> in multiple programming languages.
        </h1>

        <div className="flex justify-center w-auto mb-12">
          <button
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={() => router.push("/editor")}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-lg font-medium text-white backdrop-blur-3xl">
              Try Now
            </span>
          </button>
        </div>

        <div className="h-[25rem] rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

      </div>
    </div>
  );
}

const testimonials = [
  {
    feature: "Code Execution",
    description: "Run your code in 15 available programming languages including Python, JavaScript, Java, C, C++ and Bash.",
  },
  {
    feature: "Code Templates",
    description: "Save the code you've written and view others' templates.\n Include them in blogs as well."
  },
  {
    feature: "Blogs",
    description: "Write, save, and post your thoughts and include any templates inside."
  },
];
