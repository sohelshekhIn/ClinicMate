import Image from "next/image";
import HomePage from "@/components/Home";

export default function IndexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HomePage />
    </main>
  );
}
