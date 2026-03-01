"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stopSpeaking } from "@/lib/speech";

/** Stops any playing speech whenever the route changes (including back button). */
export default function SpeechCleanup() {
  const pathname = usePathname();
  useEffect(() => { stopSpeaking(); }, [pathname]);
  return null;
}
