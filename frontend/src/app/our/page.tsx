import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App | ADYAPAN",
  description: "ADYAPAN Smart Learning Ecosystem app experience."
};

export default function OurAppPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <iframe
        title="ADYAPAN Smart Learning Ecosystem"
        src="/our.html?embedded=1"
        className="block h-[calc(100vh-80px)] min-h-[720px] w-full border-0 bg-white"
      />
    </main>
  );
}
